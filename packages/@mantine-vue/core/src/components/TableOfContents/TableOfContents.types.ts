import type { BoxProps, MantineColor, MantineRadius, MantineSize, StylesApiProps } from '../../core'
import type { UseScrollSpyHeadingData, UseScrollSpyOptions } from '@mantine-vue/hooks'
import type { Ref } from 'vue'

/** Props declared by `TableOfContents` itself. See `TableOfContentsProps` for the full public type. */
export interface TableOfContentsOwnProps extends StylesApiProps<TableOfContentsProps> {
  /**
   * Key of `theme.colors` or any valid CSS color value
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls font-size and padding of all elements
   *
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** Options passed down to `use-scroll-spy` hook */
  scrollSpyOptions?: UseScrollSpyOptions

  /** Data used to render content until actual values are retrieved from the DOM */
  initialData?: InitialTableOfContentsData[]

  /**
   * A function to pass props down to controls, accepts values from `use-scroll-spy` hook as an argument and active state.
   *
   * @default ({ data }: any) => ({ children: data.value })
   */
  getControlProps?: (payload: {
    active: boolean
    data: UseScrollSpyHeadingData
  }) => Record<string, any>

  /** Minimum `depth` value that requires offset, `1` by default */
  minDepthToOffset?: number

  /** Controls padding on the left side of control, multiplied by (`depth` - `minDepthToOffset`), `20px` by default */
  depthOffset?: string | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** A function to reinitialize headings from `use-scroll-spy` hook */
  reinitializeRef?: Ref<(() => void) | null>

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'filled'
   */
  variant?: TableOfContentsVariant
}

export interface TableOfContentsProps
  extends Omit<BoxProps, keyof TableOfContentsOwnProps>, TableOfContentsOwnProps {}

export type TableOfContentsStylesNames = 'root' | 'control'
export type TableOfContentsVariant = 'filled' | 'light' | 'none'
export type TableOfContentsCssVariables = {
  root: '--toc-bg' | '--toc-color' | '--toc-size' | '--toc-depth-offset' | '--toc-radius'
}

export interface InitialTableOfContentsData {
  /** Heading depth from 1 to 6. */
  depth: number
  /** Heading text content. */
  value: string
  /** Unique heading id. */
  id?: string
}
