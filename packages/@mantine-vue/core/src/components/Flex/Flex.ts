import { polymorphicFactory } from '../../core'
import FlexComponent from './Flex.vue'
import type { FlexFactory } from './Flex.types'
import classes from './Flex.module.css'

export const Flex = polymorphicFactory<FlexFactory>(FlexComponent, {
  classes,
})

export type { FlexFactory, FlexOwnProps, FlexProps, FlexSlots, FlexStylesNames } from './Flex.types'
