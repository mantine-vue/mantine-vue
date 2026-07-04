import { getPath } from './paths'
import type { FormErrors, FormRulesRecord } from './types'

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

export function validateValues<Values extends Record<string, any>>(
  rules: FormRulesRecord<Values> | ((values: Values) => FormErrors) | undefined,
  values: Values,
) {
  if (!rules) {
    return { hasErrors: false, errors: {} }
  }

  const errors =
    typeof rules === 'function'
      ? rules(values)
      : Object.keys(rules).reduce<FormErrors>((acc, path) => {
          const rule = rules[path as keyof Values]
          const error = rule?.(getPath(path, values) as Values[keyof Values], values, path)
          if (error) {
            acc[path] = error
          }
          return acc
        }, {})

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

export const formRootRule = Symbol('formRootRule')

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
