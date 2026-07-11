import { ref, toRaw, type Ref } from 'vue'
import {
  getDataPath,
  getPath,
  insertPath,
  removePath,
  reorderPath,
  replacePath,
  setPath,
} from './paths'
import { validateFieldValue, validateValues } from './validators'
import type { FormErrors, FormStatus, UseFormInput, UseFormReturnType } from './types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(toRaw(value ?? {}))) as T
}

function isEqual(a: unknown, b: unknown) {
  return JSON.stringify(toRaw(a)) === JSON.stringify(toRaw(b))
}

function shouldValidate(path: PropertyKey, rule: boolean | string[] | undefined) {
  if (Array.isArray(rule)) {
    return rule.includes(String(path))
  }

  return Boolean(rule)
}

function getStatus(status: FormStatus, path?: unknown) {
  const paths = Object.keys(status)

  if (typeof path === 'string') {
    const nestedPaths = paths.filter((statusPath) => statusPath.startsWith(`${path}.`))
    return status[path] || nestedPaths.some((statusPath) => status[statusPath]) || false
  }

  return paths.some((statusPath) => status[statusPath])
}

function clearListState(path: PropertyKey, state: FormStatus) {
  if (typeof path !== 'string') {
    return state
  }

  return Object.keys(state).reduce<FormStatus>((acc, key) => {
    if (!key.startsWith(`${path}.`)) {
      acc[key] = state[key]
    }

    return acc
  }, {})
}

function changeErrorIndices(
  path: PropertyKey,
  index: number | undefined,
  errors: FormErrors,
  change: 1 | -1,
) {
  if (typeof path !== 'string' || index === undefined) {
    return errors
  }

  const pathRegex = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.(\\d+)(.*)$`)

  return Object.keys(errors).reduce<FormErrors>((acc, key) => {
    const match = key.match(pathRegex)
    if (!match) {
      acc[key] = errors[key]
      return acc
    }

    const itemIndex = Number(match[1])
    if (change === -1 && itemIndex === index) {
      return acc
    }

    const nextIndex = itemIndex >= index ? itemIndex + change : itemIndex
    acc[`${path}.${nextIndex}${match[2]}`] = errors[key]
    return acc
  }, {})
}

function reorderErrors(
  path: PropertyKey,
  payload: { from: number; to: number },
  errors: FormErrors,
) {
  if (typeof path !== 'string') {
    return errors
  }

  const pathRegex = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.(\\d+)(.*)$`)

  return Object.keys(errors).reduce<FormErrors>((acc, key) => {
    const match = key.match(pathRegex)
    if (!match) {
      acc[key] = errors[key]
      return acc
    }

    const itemIndex = Number(match[1])
    let nextIndex = itemIndex

    if (itemIndex === payload.from) {
      nextIndex = payload.to
    } else if (payload.from < payload.to && itemIndex > payload.from && itemIndex <= payload.to) {
      nextIndex = itemIndex - 1
    } else if (payload.from > payload.to && itemIndex >= payload.to && itemIndex < payload.from) {
      nextIndex = itemIndex + 1
    }

    acc[`${path}.${nextIndex}${match[2]}`] = errors[key]
    return acc
  }, {})
}

function getInputValue(input: any, type: 'input' | 'checkbox' | 'radio') {
  if (typeof input === 'function') {
    return input
  }

  const target = input?.currentTarget ?? input?.target

  if (target) {
    if (type === 'checkbox' || target.type === 'checkbox') {
      return target.checked
    }

    return target.value
  }

  return input
}

export function useForm<
  Values extends Record<string, any> = Record<string, any>,
  TransformedValues = Values,
>({
  name,
  mode = 'controlled',
  initialValues,
  initialErrors = {},
  initialDirty = {},
  initialTouched = {},
  clearInputErrorOnChange = true,
  validateInputOnChange = false,
  validateInputOnBlur = false,
  validate: rules,
  transformValues = ((values: Values) => values) as any,
  onValuesChange,
  enhanceGetInputProps,
  onSubmitPreventDefault = 'always',
  touchTrigger = 'change',
  cascadeUpdates = false,
}: UseFormInput<Values, TransformedValues> = {}): UseFormReturnType<Values, TransformedValues> {
  const initialSnapshot = ref(clone(initialValues ?? ({} as Values))) as Ref<Values>
  const values = ref(clone(initialSnapshot.value)) as Ref<Values>
  const errors = ref({ ...initialErrors }) as Ref<FormErrors>
  const touched = ref({ ...initialTouched }) as Ref<FormStatus>
  const dirty = ref({ ...initialDirty }) as Ref<FormStatus>
  const initialized = ref(false)
  const submitting = ref(false)
  const formKey = ref(0)
  const fieldKeys = ref<Record<string, number>>({})
  const watchers = new Map<string, Set<(input: any) => void>>()

  const notifyWatchers = (previous: Values, updated = values.value, changedPath?: PropertyKey) => {
    watchers.forEach((subscribers, path) => {
      if (changedPath && !cascadeUpdates && path !== String(changedPath)) {
        return
      }

      if (
        changedPath &&
        cascadeUpdates &&
        path !== String(changedPath) &&
        !path.startsWith(`${String(changedPath)}.`) &&
        !String(changedPath).startsWith(`${path}.`)
      ) {
        return
      }

      const previousValue = getPath(path, previous)
      const value = getPath(path, updated)

      if (previousValue !== value) {
        subscribers.forEach((subscriber) =>
          subscriber({
            previousValue,
            value,
            touched: api.isTouched(path),
            dirty: api.isDirty(path),
          }),
        )
      }
    })
  }

  const handleValuesChange = (previous: Values, changedPath?: PropertyKey) => {
    onValuesChange?.(values.value, previous)
    notifyWatchers(previous, values.value, changedPath)
  }

  const setValues = (nextValues: Partial<Values> | ((values: Values) => Partial<Values>)) => {
    const previous = clone(values.value)
    const patch = typeof nextValues === 'function' ? nextValues(values.value) : nextValues
    values.value = { ...values.value, ...(patch as any) }

    if (clearInputErrorOnChange) {
      errors.value = {}
    }

    if (mode === 'uncontrolled') {
      formKey.value += 1
    }

    handleValuesChange(previous)
  }

  const setFieldValue = (
    path: keyof Values | string,
    value: any,
    options: { forceUpdate?: boolean } = {},
  ) => {
    const currentValue = getPath(path, values.value)
    const resolvedValue = typeof value === 'function' ? value(currentValue) : value

    if (currentValue === resolvedValue) {
      return
    }

    const previous = clone(values.value)
    values.value = setPath(path, resolvedValue, values.value) as Values
    dirty.value = {
      ...clearListState(path, dirty.value),
      [String(path)]: !isEqual(resolvedValue, getPath(path, initialSnapshot.value)),
    }

    if (touchTrigger === 'change') {
      touched.value[String(path)] = true
    }

    if (clearInputErrorOnChange) {
      delete errors.value[String(path)]
    }

    if (shouldValidate(path, validateInputOnChange)) {
      const result = validateFieldValue(path, rules, values.value)
      if (result.hasError) {
        errors.value[String(path)] = result.error
      }
    }

    if (mode === 'uncontrolled' && options.forceUpdate !== false) {
      fieldKeys.value[String(path)] = (fieldKeys.value[String(path)] ?? 0) + 1
    }

    handleValuesChange(previous, path)
  }

  const reset = () => {
    const previous = clone(values.value)
    values.value = clone(initialSnapshot.value)
    errors.value = {}
    touched.value = {}
    dirty.value = {}
    formKey.value += 1
    handleValuesChange(previous)
  }

  const resetField = (path: keyof Values | string) => {
    const initialValue = getPath(path, initialSnapshot.value)
    if (typeof initialValue === 'undefined') {
      return
    }

    setFieldValue(path, initialValue)
    delete touched.value[String(path)]
    delete dirty.value[String(path)]
  }

  const validate = () => {
    const result = validateValues(rules, values.value)
    errors.value = result.errors
    return result
  }

  const validateField = (path: keyof Values | string) => {
    const result = validateFieldValue(path, rules, values.value)

    if (result.hasError) {
      errors.value[String(path)] = result.error
    } else {
      delete errors.value[String(path)]
    }

    return result
  }

  const getInputProps = (
    path: keyof Values | string,
    { type = 'input', withError = true, withFocus = type !== 'radio', value: radioValue }: any = {},
  ) => {
    const currentValue = getPath(path, values.value)
    const payload: Record<string, any> = {
      'data-path': getDataPath(name, path),
    }

    if (withError) {
      payload.error = errors.value[String(path)]
    }

    const onChange = (eventOrValue: any) =>
      setFieldValue(path, getInputValue(eventOrValue, type), { forceUpdate: false })

    payload.onChange = onChange
    payload.onInput = onChange

    if (type === 'checkbox') {
      payload[mode === 'controlled' ? 'checked' : 'defaultChecked'] = currentValue
    } else if (type === 'radio') {
      payload.checked = currentValue === radioValue
      payload.value = radioValue
    } else {
      payload[mode === 'controlled' ? 'value' : 'defaultValue'] = currentValue
    }

    if (withFocus) {
      payload.onFocus = () => {
        touched.value[String(path)] = true
      }
      payload.onBlur = () => {
        if (shouldValidate(path, validateInputOnBlur)) {
          validateField(path)
        }
      }
    }

    return Object.assign(
      payload,
      enhanceGetInputProps?.({
        inputProps: payload,
        field: path,
        options: { type, withError, withFocus, value: radioValue },
        form: api,
      }),
    )
  }

  const api: UseFormReturnType<Values, TransformedValues> = {
    watch: (path, subscriber) => {
      const key = String(path)
      const subscribers = watchers.get(key) ?? new Set()
      subscribers.add(subscriber)
      watchers.set(key, subscribers)

      return () => {
        const current = watchers.get(key)
        current?.delete(subscriber)
        if (current?.size === 0) {
          watchers.delete(key)
        }
      }
    },
    values,
    initialized,
    errors,
    touched,
    dirty,
    submitting,
    getValues: () => values.value,
    getInitialValues: () => initialSnapshot.value,
    setInitialValues: (nextValues) => {
      initialSnapshot.value = clone(nextValues)
    },
    setValues,
    setFieldValue,
    reset,
    onReset: (event?: Event) => {
      event?.preventDefault()
      reset()
    },
    resetField,
    initialize: (nextValues) => {
      if (initialized.value) {
        return
      }

      const previous = clone(values.value)
      initialSnapshot.value = clone(nextValues)
      values.value = clone(nextValues)
      initialized.value = true
      if (mode === 'uncontrolled') {
        formKey.value += 1
      }
      handleValuesChange(previous)
    },
    setSubmitting: (nextSubmitting) => {
      submitting.value =
        typeof nextSubmitting === 'function' ? nextSubmitting(submitting.value) : nextSubmitting
    },
    setErrors: (nextErrors) => {
      errors.value = typeof nextErrors === 'function' ? nextErrors(errors.value) : nextErrors
    },
    setFieldError: (path, error) => {
      errors.value[String(path)] = error
    },
    clearFieldError: (path) => {
      delete errors.value[String(path)]
    },
    clearErrors: () => {
      errors.value = {}
    },
    setTouched: (nextTouched) => {
      touched.value = typeof nextTouched === 'function' ? nextTouched(touched.value) : nextTouched
    },
    setDirty: (nextDirty) => {
      dirty.value = typeof nextDirty === 'function' ? nextDirty(dirty.value) : nextDirty
    },
    resetTouched: () => {
      touched.value = {}
    },
    resetDirty: (nextValues) => {
      initialSnapshot.value = nextValues
        ? ({ ...values.value, ...clone(nextValues) } as Values)
        : clone(values.value)
      dirty.value = {}
    },
    getTouched: () => touched.value,
    getDirty: () => dirty.value,
    isTouched: (path) =>
      path ? getStatus(touched.value, String(path)) : Object.values(touched.value).some(Boolean),
    isDirty: (path) => {
      if (path) {
        const overriddenValue = getPath(path, dirty.value)

        if (typeof overriddenValue === 'boolean') {
          return overriddenValue
        }

        return !isEqual(getPath(path, values.value), getPath(path, initialSnapshot.value))
      }

      return Object.keys(dirty.value).length > 0
        ? getStatus(dirty.value)
        : !isEqual(values.value, initialSnapshot.value)
    },
    reorderListItem: (path, payload) => {
      const previous = clone(values.value)
      dirty.value = clearListState(path, dirty.value)
      errors.value = reorderErrors(path, payload, errors.value)
      values.value = reorderPath(path, payload, values.value) as Values
      handleValuesChange(previous, path)
    },
    insertListItem: (path, item, index) => {
      const previous = clone(values.value)
      dirty.value = clearListState(path, dirty.value)
      errors.value = changeErrorIndices(path, index, errors.value, 1)
      values.value = insertPath(path, item, index, values.value) as Values
      handleValuesChange(previous, path)
    },
    removeListItem: (path, index) => {
      const previous = clone(values.value)
      dirty.value = clearListState(path, dirty.value)
      errors.value = changeErrorIndices(path, index, errors.value, -1)
      values.value = removePath(path, index, values.value) as Values
      handleValuesChange(previous, path)
    },
    replaceListItem: (path, index, item) => {
      const previous = clone(values.value)
      dirty.value = clearListState(path, dirty.value)
      values.value = replacePath(path, item, index, values.value) as Values
      handleValuesChange(previous, path)
    },
    validate,
    validateField,
    isValid: (path) =>
      path
        ? !validateFieldValue(path, rules, values.value).hasError
        : !validateValues(rules, values.value).hasErrors,
    getInputProps,
    onSubmit: (submit, validationFailure) => (event?: Event) => {
      if (onSubmitPreventDefault === 'always') {
        event?.preventDefault()
      }

      const result = validate()
      if (result.hasErrors) {
        if (onSubmitPreventDefault === 'validation-failed') {
          event?.preventDefault()
        }

        validationFailure?.(result.errors, values.value, event)
        return
      }

      const submitResult = submit(transformValues(values.value), event)
      if (submitResult instanceof Promise) {
        submitResult.finally(() => {
          submitting.value = false
        })
      } else {
        submitting.value = false
      }
    },
    getTransformedValues: (input) => transformValues(input ?? values.value),
    key: (path) => `${formKey.value}-${String(path)}-${fieldKeys.value[String(path)] ?? 0}`,
    getInputNode: (path) =>
      typeof document === 'undefined'
        ? null
        : document.querySelector(`[data-path="${getDataPath(name, path)}"]`),
  }

  return api
}
