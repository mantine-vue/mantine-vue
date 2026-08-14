import { factory } from '../../core'
import CodeComponent, { varsResolver } from './Code.vue'
import type { CodeFactory } from './Code.types'
import classes from './Code.module.css'

export const Code = factory<CodeFactory>(CodeComponent, {
  classes,
  varsResolver,
})

export type {
  CodeCssVariables,
  CodeOwnProps,
  CodeProps,
  CodeSlots,
  CodeStylesNames,
  CodeFactory,
} from './Code.types'
