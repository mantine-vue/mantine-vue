import { polymorphicFactory } from '../../core'
import { varsResolver } from '../Text/Text.vue'
import AnchorComponent from './Anchor.vue'
import type { AnchorFactory } from './Anchor.types'
import classes from './Anchor.module.css'

export const Anchor = polymorphicFactory<AnchorFactory>(AnchorComponent, {
  classes,
  varsResolver,
})

export type {
  AnchorCssVariables,
  AnchorFactory,
  AnchorOwnProps,
  AnchorProps,
  AnchorSlots,
  AnchorStylesNames,
  AnchorVariant,
} from './Anchor.types'
