import type { BoxProps, Factory } from '../../core'

/** Props declared by `Space` itself. See `SpaceProps` for the full public type. */
export interface SpaceOwnProps {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Width, theme key: theme.spacing */
  w?: string | number

  /** Height, theme key: theme.spacing */
  h?: string | number

  /** MinWidth, theme key: theme.spacing */
  miw?: string | number

  /** MinHeight, theme key: theme.spacing */
  mih?: string | number
}

export interface SpaceProps extends Omit<BoxProps, keyof SpaceOwnProps>, SpaceOwnProps {}

export type SpaceFactory = Factory<{
  props: Omit<SpaceProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
