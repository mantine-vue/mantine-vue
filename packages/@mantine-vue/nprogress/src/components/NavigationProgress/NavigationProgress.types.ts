import type { NprogressStore } from '../../nprogress.store'

/** Props accepted by `NavigationProgress`. */
export interface NavigationProgressProps {
  /** Component store, controls state. */
  store?: NprogressStore
  /** Initial progress value @default 0 */
  initialProgress?: number
  /** Key of `theme.colors` or any other valid CSS color. @default theme.primaryColor */
  color?: string
  /** Controls height of the progress bar. */
  size?: number
  /** Step interval in ms. @default 500 */
  stepInterval?: number
  /** Determines whether the progress bar should be rendered within `Portal`. @default true */
  withinPortal?: boolean
  /** Props to pass down to the `Portal` when `withinPortal` is `true`. */
  portalProps?: Record<string, any>
  /** Progressbar z-index. @default 9999 */
  zIndex?: string | number
}
