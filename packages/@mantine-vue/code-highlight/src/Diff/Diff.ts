import { factory } from '@mantine-vue/core'
import DiffComponent, { varsResolver } from './Diff.vue'
import type { DiffFactory } from './Diff.types'
import classes from './Diff.module.css'

export const Diff = factory<DiffFactory>(DiffComponent, { classes, varsResolver })
export type * from './Diff.types'
