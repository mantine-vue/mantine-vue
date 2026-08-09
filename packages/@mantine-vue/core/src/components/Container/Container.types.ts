import type { BoxProps, MantineSize, StylesApiProps } from '../../core'

/** Props declared by `Container` itself. See `ContainerProps` for the full public type. */
export interface ContainerOwnProps extends StylesApiProps<ContainerProps> {
  /**
   * `max-width` of the container, value is not responsive – it is the same for all screen sizes. Numbers are converted to rem. Ignored when `fluid` prop is set.
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * If set, the container takes 100% width of its parent and `size` prop is ignored.
   *
   * @default false
   */
  fluid?: boolean

  /**
   * Centering strategy
   *
   * @default 'block'
   */
  strategy?: 'block' | 'grid'
}

export interface ContainerProps
  extends Omit<BoxProps, keyof ContainerOwnProps>, ContainerOwnProps {}
