import { factory } from '../../core'
import SimpleGridComponent from './SimpleGrid.vue'
import type { SimpleGridFactory } from './SimpleGrid.types'
import classes from './SimpleGrid.module.css'

export const SimpleGrid = factory<SimpleGridFactory>(SimpleGridComponent, { classes })

export type {
  SimpleGridOwnProps,
  SimpleGridProps,
  SimpleGridSlots,
  SimpleGridStylesNames,
  SimpleGridFactory,
} from './SimpleGrid.types'
