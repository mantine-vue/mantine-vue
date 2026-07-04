import type { Ref } from 'vue'

export type FormErrors = Record<string, any>
export type FormStatus = Record<string, boolean>
export type FormMode = 'controlled' | 'uncontrolled'
export type FormRule<Value, Values> = (value: Value, values: Values, path: string) => any
export type FormRulesRecord<Values> = {
  [K in keyof Values]?: FormRule<Values[K], Values>
}

export interface UseFormInput<Values extends Record<string, any>, TransformedValues = Values> {
  name?: string
  mode?: FormMode
  initialValues?: Values
  initialErrors?: FormErrors
  initialDirty?: FormStatus
  initialTouched?: FormStatus
  clearInputErrorOnChange?: boolean
  validateInputOnChange?: boolean | string[]
  validateInputOnBlur?: boolean | string[]
  validate?: FormRulesRecord<Values> | ((values: Values) => FormErrors)
  transformValues?: (values: Values) => TransformedValues
  onValuesChange?: (values: Values, previous: Values) => void
}

export interface GetInputPropsOptions {
  type?: 'input' | 'checkbox' | 'radio'
  withError?: boolean
  withFocus?: boolean
  value?: any
}

export interface UseFormReturnType<Values extends Record<string, any>, TransformedValues = Values> {
  values: Ref<Values>
  initialized: Ref<boolean>
  errors: Ref<FormErrors>
  touched: Ref<FormStatus>
  dirty: Ref<FormStatus>
  submitting: Ref<boolean>
  getValues: () => Values
  setValues: (values: Partial<Values> | ((values: Values) => Partial<Values>)) => void
  setFieldValue: (path: keyof Values | string, value: any) => void
  reset: () => void
  resetField: (path: keyof Values | string) => void
  initialize: (values: Values) => void
  setErrors: (errors: FormErrors) => void
  setFieldError: (path: keyof Values | string, error: any) => void
  clearFieldError: (path: keyof Values | string) => void
  clearErrors: () => void
  setTouched: (touched: FormStatus) => void
  setDirty: (dirty: FormStatus) => void
  isTouched: (path?: keyof Values | string) => boolean
  isDirty: (path?: keyof Values | string) => boolean
  validate: () => { hasErrors: boolean; errors: FormErrors }
  validateField: (path: keyof Values | string) => { hasError: boolean; error: any }
  isValid: (path?: keyof Values | string) => boolean
  getInputProps: (
    path: keyof Values | string,
    options?: GetInputPropsOptions,
  ) => Record<string, any>
  onSubmit: (
    submit: (values: TransformedValues, event?: Event) => void | Promise<void>,
    validationFailure?: (errors: FormErrors, values: Values, event?: Event) => void,
  ) => (event?: Event) => void
  getTransformedValues: (values?: Values) => TransformedValues
  key: (path: keyof Values | string) => string
}
