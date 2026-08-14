import { factory } from '../../core'
import VisuallyHiddenComponent from './VisuallyHidden.vue'
import type { VisuallyHiddenFactory } from './VisuallyHidden.types'
import classes from './VisuallyHidden.module.css'

export const VisuallyHidden = factory<VisuallyHiddenFactory>(VisuallyHiddenComponent, {
  classes,
})

export type {
  VisuallyHiddenFactory,
  VisuallyHiddenOwnProps,
  VisuallyHiddenProps,
  VisuallyHiddenStylesNames,
} from './VisuallyHidden.types'
