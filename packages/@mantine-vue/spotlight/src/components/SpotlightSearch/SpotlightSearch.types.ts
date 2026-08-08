export type SpotlightSearchStylesNames = 'input' | 'wrapper' | 'section' | 'bottomSection'
/** Props accepted by `SpotlightSearch`. */
export interface SpotlightSearchProps {
  /** Input size @default 'lg' */
  size?: string | number
  /** Controlled input value. */
  modelValue?: string
  /** CSS classes applied to component elements. */
  classNames?: Record<string, any>
  /** Inline styles applied to component elements. */
  styles?: Record<string, any>
  /** CSS variables applied to component elements. */
  vars?: Record<string, any>
  [key: string]: any
}

/** Events emitted by `SpotlightSearch`. */
export interface SpotlightSearchEmits {
  /** Emitted when the search input changes. */
  'update:modelValue': [value: string]
  /** Emitted when the search input changes. */
  change: [value: string]
  /** Emitted when a key is pressed. */
  keydown: [event: KeyboardEvent]
}
