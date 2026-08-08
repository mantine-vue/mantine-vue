export type CarouselStyleProp<T> = T | Partial<Record<string, T>>
export interface CarouselVariablesProps {
  /** CSS selector used to scope generated responsive carousel variables. */
  selector: string
  /** Controls slide width based on viewport or container width. @default '100%' */
  slideSize?: CarouselStyleProp<string | number>
  /** Key of `theme.spacing` or any valid CSS value to set gap between slides. @default 0 */
  slideGap?: CarouselStyleProp<string | number>
}
