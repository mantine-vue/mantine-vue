import { getPath } from './paths'
import type { FormErrors, FormRule, FormRulesRecord } from './types'

function filterErrors(errors: FormErrors): FormErrors {
  if (errors === null || typeof errors !== 'object') {
    return {}
  }

  return Object.keys(errors).reduce<FormErrors>((acc, key) => {
    const errorValue = errors[key]

    if (errorValue !== undefined && errorValue !== null && errorValue !== false) {
      acc[key] = errorValue
    }

    return acc
  }, {})
}

export function hasLength(payload: { min?: number; max?: number }, error: any = true) {
  return (value: string | unknown[]) => {
    if (payload.min !== undefined && value.length < payload.min) {
      return error
    }

    if (payload.max !== undefined && value.length > payload.max) {
      return error
    }

    return null
  }
}

export function isNotEmpty(error: any = true) {
  return (value: unknown) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? null : error
    }

    return value !== null && value !== undefined && String(value).trim().length > 0 ? null : error
  }
}

export function matches(regexp: RegExp, error: any = true) {
  return (value: string) => (regexp.test(value) ? null : error)
}

export function isEmail(error: any = true) {
  return matches(/^\S+@\S+$/i, error)
}

export function isInRange(payload: { min?: number; max?: number }, error: any = true) {
  return (value: number) => {
    if (payload.min !== undefined && value < payload.min) {
      return error
    }

    if (payload.max !== undefined && value > payload.max) {
      return error
    }

    return null
  }
}

export function matchesField(path: string, error: any = true) {
  return (value: unknown, values: Record<string, any>) =>
    value === getPath(path, values) ? null : error
}

export function isNotEmptyHtml(error: any = true) {
  return (value: string) => {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null
    if (!div) {
      return value && value.replace(/<[^>]*>/g, '').trim().length > 0 ? null : error
    }

    div.innerHTML = value
    return div.textContent?.trim() ? null : error
  }
}

export function isJsonString(error: any = true) {
  return (value: string) => {
    try {
      JSON.parse(value)
      return null
    } catch {
      return error
    }
  }
}

export const formRootRule = Symbol('root-rule')

function validateRulesRecord<Values>(
  rules: FormRulesRecord<Values> | undefined,
  values: Values,
  path = '',
  errors: FormErrors = {},
) {
  if (typeof rules !== 'object' || rules === null) {
    return errors
  }

  return Reflect.ownKeys(rules).reduce<FormErrors>((acc, ruleKey) => {
    const rule = (rules as any)[ruleKey] as FormRule<any, Values>

    if (ruleKey === formRootRule) {
      acc[path] = (rule as any)(path ? getPath(path, values as any) : values, values, path)
      return acc
    }

    const rulePath = `${path === '' ? '' : `${path}.`}${String(ruleKey)}`
    const value = getPath(rulePath, values as any)
    let arrayValidation = false

    if (typeof rule === 'function') {
      acc[rulePath] = rule(value, values, rulePath)
    }

    if (typeof rule === 'object' && Array.isArray(value)) {
      arrayValidation = true
      value.forEach((_item, index) =>
        validateRulesRecord(rule, values, `${rulePath}.${index}`, acc),
      )

      if (formRootRule in rule) {
        acc[rulePath] = (rule as any)[formRootRule](value, values, rulePath)
      }
    }

    if (typeof rule === 'object' && typeof value === 'object' && value !== null) {
      if (!arrayValidation) {
        validateRulesRecord(rule, values, rulePath, acc)
      }

      if (formRootRule in rule) {
        acc[rulePath] = (rule as any)[formRootRule](value, values, rulePath)
      }
    }

    return acc
  }, errors)
}

export function validateValues<Values extends Record<string, any>>(
  rules: FormRulesRecord<Values> | ((values: Values) => FormErrors) | undefined,
  values: Values,
) {
  if (!rules) {
    return { hasErrors: false, errors: {} }
  }

  const errors = filterErrors(
    typeof rules === 'function' ? rules(values) : validateRulesRecord(rules, values),
  )

  return { hasErrors: Object.keys(errors).length > 0, errors }
}

export function validateFieldValue<Values extends Record<string, any>>(
  path: PropertyKey,
  rules: FormRulesRecord<Values> | ((values: Values) => FormErrors) | undefined,
  values: Values,
) {
  const results = validateValues(rules, values)
  const error = results.errors[String(path)]

  return { hasError: error !== undefined, error }
}

export function schemaResolver<T>(schema: { safeParse: (value: T) => any }) {
  return (values: T) => {
    const result = schema.safeParse(values)
    if (result.success) {
      return {}
    }

    return result.error.issues.reduce((acc: FormErrors, issue: any) => {
      acc[issue.path.join('.')] = issue.message
      return acc
    }, {})
  }
}

export const zodResolver = schemaResolver
export const yupResolver = schemaResolver
export const superstructResolver = schemaResolver
export const joiResolver = schemaResolver
