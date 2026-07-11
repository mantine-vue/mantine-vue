import type { Ref } from 'vue'

export type FormErrors = Record<string, any>
export type FormStatus = Record<string, boolean>
export type FormMode = 'controlled' | 'uncontrolled'
export type OnSubmitPreventDefault = 'always' | 'never' | 'validation-failed'
export interface ReorderPayload {
  from: number
  to: number
}
export type FormRule<Value, Values> = (value: Value, values: Values, path: string) => any
export type FormRulesRecord<Values> = {
  [K in keyof Values]?: Values[K] extends ReadonlyArray<infer ListValue>
    ?
        | Partial<Record<keyof ListValue, FormRule<any, Values> | FormRulesRecord<any>>>
        | FormRule<Values[K], Values>
    : Values[K] extends Record<string, any>
      ? FormRulesRecord<Values[K]> | FormRule<Values[K], Values>
      : FormRule<Values[K], Values>
} & Record<PropertyKey, any>

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
  enhanceGetInputProps?: (payload: {
    inputProps: Record<string, any>
    field: keyof Values | string
    options: GetInputPropsOptions
    form: UseFormReturnType<Values, TransformedValues>
  }) => Record<string, any> | undefined | void
  onSubmitPreventDefault?: OnSubmitPreventDefault
  touchTrigger?: 'focus' | 'change'
  cascadeUpdates?: boolean
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
  watch: (
    path: keyof Values | string,
    subscriber: (input: {
      previousValue: any
      value: any
      touched: boolean
      dirty: boolean
    }) => void,
  ) => () => void
  getValues: () => Values
  getInitialValues: () => Values
  setInitialValues: (values: Values) => void
  setValues: (values: Partial<Values> | ((values: Values) => Partial<Values>)) => void
  setFieldValue: (
    path: keyof Values | string,
    value: any,
    options?: { forceUpdate?: boolean },
  ) => void
  reset: () => void
  onReset: (event?: Event) => void
  resetField: (path: keyof Values | string) => void
  initialize: (values: Values) => void
  setSubmitting: (submitting: boolean | ((submitting: boolean) => boolean)) => void
  setErrors: (errors: FormErrors | ((errors: FormErrors) => FormErrors)) => void
  setFieldError: (path: keyof Values | string, error: any) => void
  clearFieldError: (path: keyof Values | string) => void
  clearErrors: () => void
  setTouched: (touched: FormStatus | ((touched: FormStatus) => FormStatus)) => void
  setDirty: (dirty: FormStatus | ((dirty: FormStatus) => FormStatus)) => void
  resetTouched: () => void
  resetDirty: (values?: Values) => void
  getTouched: () => FormStatus
  getDirty: () => FormStatus
  isTouched: (path?: keyof Values | string) => boolean
  isDirty: (path?: keyof Values | string) => boolean
  reorderListItem: (path: keyof Values | string, payload: ReorderPayload) => void
  insertListItem: (path: keyof Values | string, item: any, index?: number) => void
  removeListItem: (path: keyof Values | string, index: number) => void
  replaceListItem: (path: keyof Values | string, index: number, item: any) => void
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
  getInputNode: <NodeType extends HTMLElement = HTMLElement>(
    path: keyof Values | string,
  ) => NodeType | null
}
