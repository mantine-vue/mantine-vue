import type { SVGAttributes } from 'vue'

/** Native SVG attributes accepted by pagination icons. */
export interface PaginationIconProps extends SVGAttributes {
  /** Unique identifier assigned to the SVG element. */
  id?: string
}
