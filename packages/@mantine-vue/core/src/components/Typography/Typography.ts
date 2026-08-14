import { factory } from '../../core'
import TypographyComponent from './Typography.vue'
import type { TypographyFactory } from './Typography.types'
import classes from './Typography.module.css'

export const Typography = factory<TypographyFactory>(TypographyComponent, {
  classes,
})

export type {
  TypographyFactory,
  TypographyOwnProps,
  TypographyProps,
  TypographyStylesNames,
} from './Typography.types'
