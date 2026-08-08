import { withBoxProps } from '../../core'
import VisuallyHiddenComponent from './VisuallyHidden.vue'

export const VisuallyHidden = withBoxProps(VisuallyHiddenComponent)

export type {
  VisuallyHiddenOwnProps,
  VisuallyHiddenProps,
  VisuallyHiddenStylesNames,
} from './VisuallyHidden.types'
