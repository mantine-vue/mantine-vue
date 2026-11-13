import { camelize } from 'vue'

const WRAPPER_PROPS = new Set<string>([
  'label',
  'description',
  'error',
  'success',
  'withAsterisk',
  'labelProps',
  'descriptionProps',
  'errorProps',
  'successProps',
  'inputContainer',
  'inputWrapperOrder',
  'wrapperProps',
  'variant',
  'mod',
  'radius',
  'leftSection',
  'leftSectionWidth',
  'leftSectionProps',
  'leftSectionPointerEvents',
  'rightSection',
  'rightSectionWidth',
  'rightSectionProps',
  'rightSectionPointerEvents',
  'withErrorStyles',
  'withSuccessStyles',
  'inputSize',
  'pointer',
  'loading',
  'loadingPosition',
  'loaderProps',
  'class',
  'style',
])

/** Splits fallthrough attributes into props of the input wrapper and props of the inner control */
export function splitWrapperProps<T extends Record<string, any>>(props: T) {
  const wrapperProps: Record<string, any> = {}
  const controlProps: Record<string, any> = {}

  for (const key of Object.keys(props)) {
    if (WRAPPER_PROPS.has(camelize(key))) {
      wrapperProps[key] = props[key]
    } else {
      controlProps[key] = props[key]
    }
  }

  return { wrapperProps, controlProps }
}
