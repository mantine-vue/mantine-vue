import type { SVGAttributes } from 'vue'

/** Native SVG attributes accepted by the color input eye-dropper icon. */
export interface EyeDropperIconProps extends SVGAttributes {
  /** Unique identifier assigned to the SVG element. */
  id?: string
}
