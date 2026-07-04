import { ref, toRaw, type Ref } from 'vue'
import { deepMerge } from '@mantine-vue/utils'
import { getDataPath, getPath, setPath } from './paths'
import { validateFieldValue, validateValues } from './validators'
import type { FormErrors, FormStatus, UseFormInput, UseFormReturnType } from './types'

function clone<T>(value: T): T {
  return structuredClone(toRaw(value ?? {})) as T
}

function shouldValidate(path: PropertyKey, rule: boolean | string[] | undefined) {
  if (Array.isArray(rule)) {
    return rule.includes(String(path))
  }

  return Boolean(rule)
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
}: UseFormInput<Values, TransformedValues> = {}): UseFormReturnType<Values, TransformedValues> {
  const initialSnapshot = ref(clone(initialValues ?? ({} as Values))) as Ref<Values>
  const values = ref(clone(initialSnapshot.value)) as Ref<Values>
  const errors = ref({ ...initialErrors }) as Ref<FormErrors>
  const touched = ref({ ...initialTouched }) as Ref<FormStatus>
  const dirty = ref({ ...initialDirty }) as Ref<FormStatus>
  const initialized = ref(Boolean(initialValues))
  const submitting = ref(false)
  const formKey = ref(0)
  const fieldKeys = ref<Record<string, number>>({})

  const setValues = (nextValues: Partial<Values> | ((values: Values) => Partial<Values>)) => {
    const previous = clone(values.value)
    const patch = typeof nextValues === 'function' ? nextValues(values.value) : nextValues
    values.value = deepMerge(values.value, patch as any)
    onValuesChange?.(values.value, previous)
  }

  const setFieldValue = (path: keyof Values | string, value: any) => {
    const previous = clone(values.value)
    values.value = setPath(
      path,
      typeof value === 'function' ? value(getPath(path, values.value)) : value,
      values.value,
    ) as Values
    dirty.value[String(path)] = getPath(path, values.value) !== getPath(path, initialSnapshot.value)
    touched.value[String(path)] = true

    if (clearInputErrorOnChange) {
      delete errors.value[String(path)]
    }

    if (shouldValidate(path, validateInputOnChange)) {
      const result = validateFieldValue(path, rules, values.value)
      if (result.hasError) {
        errors.value[String(path)] = result.error
      }
    }

    if (mode === 'uncontrolled') {
      fieldKeys.value[String(path)] = (fieldKeys.value[String(path)] ?? 0) + 1
    }

    onValuesChange?.(values.value, previous)
  }

  const reset = () => {
    values.value = clone(initialSnapshot.value)
    errors.value = {}
    touched.value = {}
    dirty.value = {}
    formKey.value += 1
  }

  const resetField = (path: keyof Values | string) => {
    setFieldValue(path, getPath(path, initialSnapshot.value))
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
      onInput: (event: Event) => {
        const target = event.target as HTMLInputElement
        setFieldValue(path, type === 'checkbox' ? target.checked : target.value)
      },
      onChange: (event: Event) => {
        const target = event.target as HTMLInputElement
        setFieldValue(path, type === 'checkbox' ? target.checked : target.value)
      },
    }

    if (withError) {
      payload.error = errors.value[String(path)]
    }

    if (type === 'checkbox') {
      payload.checked = currentValue
    } else if (type === 'radio') {
      payload.checked = currentValue === radioValue
      payload.value = radioValue
    } else {
      payload.value = currentValue
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

    return payload
  }

  const api: UseFormReturnType<Values, TransformedValues> = {
    values,
    initialized,
    errors,
    touched,
    dirty,
    submitting,
    getValues: () => values.value,
    setValues,
    setFieldValue,
    reset,
    resetField,
    initialize: (nextValues) => {
      initialSnapshot.value = clone(nextValues)
      values.value = clone(nextValues)
      initialized.value = true
    },
    setErrors: (nextErrors) => {
      errors.value = nextErrors
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
      touched.value = nextTouched
    },
    setDirty: (nextDirty) => {
      dirty.value = nextDirty
    },
    isTouched: (path) =>
      path ? Boolean(touched.value[String(path)]) : Object.values(touched.value).some(Boolean),
    isDirty: (path) =>
      path ? Boolean(dirty.value[String(path)]) : Object.values(dirty.value).some(Boolean),
    validate,
    validateField,
    isValid: (path) => (path ? !validateField(path).hasError : !validate().hasErrors),
    getInputProps,
    onSubmit: (submit, validationFailure) => (event?: Event) => {
      event?.preventDefault()
      submitting.value = true
      const result = validate()
      if (result.hasErrors) {
        validationFailure?.(result.errors, values.value, event)
        submitting.value = false
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
  }

  return api
}
