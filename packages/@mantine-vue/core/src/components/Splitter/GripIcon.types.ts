import type { SVGAttributes } from 'vue'

/** Native SVG attributes accepted by splitter grip icons. */
export interface GripIconProps extends SVGAttributes {
  /** Unique identifier assigned to the SVG element. */
  id?: string
}
