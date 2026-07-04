import type { ColorFormat, HsvaColor, RgbaColor } from '../ColorPicker.types'
import { round } from './parsers'
export function hsvaToRgbaObject({ h, s, v, a }: HsvaColor): RgbaColor {
  const hue = (h / 360) * 6
  const sat = s / 100
  const val = v / 100
  const hh = Math.floor(hue)
  const l = val * (1 - sat)
  const c = val * (1 - (hue - hh) * sat)
  const d = val * (1 - (1 - hue + hh) * sat)
  const mod = hh % 6
  return {
    r: round([val, c, l, l, d, val][mod] * 255),
    g: round([d, val, val, c, l, l][mod] * 255),
    b: round([l, l, d, val, val, c][mod] * 255),
    a: round(a, 2),
  }
}
export function hsvaToRgba(color: HsvaColor, alpha: boolean) {
  const { r, g, b, a } = hsvaToRgbaObject(color)
  return alpha ? `rgba(${r}, ${g}, ${b}, ${round(a, 2)})` : `rgb(${r}, ${g}, ${b})`
}
export function hsvaToHsl({ h, s, v, a }: HsvaColor, alpha: boolean) {
  const hh = ((200 - s) * v) / 100
  const result = {
    h: Math.round(h),
    s: Math.round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
    l: Math.round(hh / 2),
  }
  return alpha
    ? `hsla(${result.h}, ${result.s}%, ${result.l}%, ${round(a, 2)})`
    : `hsl(${result.h}, ${result.s}%, ${result.l}%)`
}
const hexPart = (number: number) => number.toString(16).padStart(2, '0')
export function hsvaToHex(color: HsvaColor) {
  const { r, g, b } = hsvaToRgbaObject(color)
  return `#${hexPart(r)}${hexPart(g)}${hexPart(b)}`
}
export function hsvaToHexa(color: HsvaColor) {
  return `${hsvaToHex(color)}${hexPart(Math.round(color.a * 255))}`
}
const CONVERTERS: Record<ColorFormat, (color: HsvaColor) => string> = {
  hex: hsvaToHex,
  hexa: hsvaToHexa,
  rgb: (color) => hsvaToRgba(color, false),
  rgba: (color) => hsvaToRgba(color, true),
  hsl: (color) => hsvaToHsl(color, false),
  hsla: (color) => hsvaToHsl(color, true),
}
export function convertHsvaTo(format: ColorFormat, color: HsvaColor) {
  return color ? (CONVERTERS[format] ?? CONVERTERS.hex)(color) : '#000000'
}
