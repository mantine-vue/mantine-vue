import type { SVGAttributes } from 'vue'

/** Native SVG attributes accepted by the rating star icon. */
export interface StarIconProps extends SVGAttributes {
  /** Unique identifier assigned to the SVG element. */
  id?: string
}
