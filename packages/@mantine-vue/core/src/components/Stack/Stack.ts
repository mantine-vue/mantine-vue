import { factory } from '../../core'
import StackComponent, { varsResolver } from './Stack.vue'
import type { StackFactory } from './Stack.types'
import classes from './Stack.module.css'

export const Stack = factory<StackFactory>(StackComponent, {
  classes,
  varsResolver,
})

export type { StackOwnProps, StackProps, StackFactory } from './Stack.types'
