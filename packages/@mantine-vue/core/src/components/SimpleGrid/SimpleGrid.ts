import { withBoxProps } from '../../core'
import SimpleGridComponent from './SimpleGrid.vue'
import classes from './SimpleGrid.module.css'

export const SimpleGrid = withBoxProps(SimpleGridComponent)
Object.assign(SimpleGrid, { classes })

export type {
  SimpleGridOwnProps,
  SimpleGridProps,
  SimpleGridSlots,
  SimpleGridStylesNames,
} from './SimpleGrid.types'
