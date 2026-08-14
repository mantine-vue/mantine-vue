import { factory } from '../../core'
import BlockquoteComponent from './Blockquote.vue'
import type { BlockquoteFactory } from './Blockquote.types'
import classes from './Blockquote.module.css'

export const Blockquote = factory<BlockquoteFactory>(BlockquoteComponent, {
  classes,
})

export type {
  BlockquoteOwnProps,
  BlockquoteProps,
  BlockquoteSlots,
  BlockquoteFactory,
} from './Blockquote.types'
