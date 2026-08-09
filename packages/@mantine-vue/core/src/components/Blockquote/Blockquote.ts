import { withBoxProps } from '../../core'
import BlockquoteComponent from './Blockquote.vue'

export const Blockquote = withBoxProps(BlockquoteComponent)

export type { BlockquoteOwnProps, BlockquoteProps, BlockquoteSlots } from './Blockquote.types'
