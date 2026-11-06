import { factory } from '@mantine-vue/core'
import DiagramComponent from './Diagram.vue'
import type { DiagramFactory } from './Diagram.types'
import classes from './Diagram.module.css'

export const Diagram = factory<DiagramFactory>(DiagramComponent, { classes })

export type {
  DiagramContextMenuContext,
  DiagramCssVariables,
  DiagramEmits,
  DiagramExposed,
  DiagramFactory,
  DiagramGridOptions,
  DiagramMenuItem,
  DiagramMenuState,
  DiagramOwnProps,
  DiagramProps,
  DiagramSlots,
  DiagramStylesNames,
} from './Diagram.types'
