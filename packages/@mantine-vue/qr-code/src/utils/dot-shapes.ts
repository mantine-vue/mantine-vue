import type { QRCodeDotStyle } from '../QRCode.types'

/** Generates SVG path data for one data module. */
export function dotPath(x: number, y: number, cellSize: number, style: QRCodeDotStyle): string {
  if (style === 'dots') {
    const radius = cellSize / 2
    const centerX = x + radius
    const centerY = y + radius
    return `M${centerX},${centerY - radius}a${radius},${radius} 0 1,1 0,${radius * 2}a${radius},${radius} 0 1,1 0,${-radius * 2}z`
  }

  if (style === 'rounded') {
    const radius = cellSize * 0.3
    return (
      `M${x + radius},${y}` +
      `h${cellSize - 2 * radius}` +
      `a${radius},${radius} 0 0,1 ${radius},${radius}` +
      `v${cellSize - 2 * radius}` +
      `a${radius},${radius} 0 0,1 ${-radius},${radius}` +
      `h${-(cellSize - 2 * radius)}` +
      `a${radius},${radius} 0 0,1 ${-radius},${-radius}` +
      `v${-(cellSize - 2 * radius)}` +
      `a${radius},${radius} 0 0,1 ${radius},${-radius}z`
    )
  }

  return `M${x},${y}h${cellSize}v${cellSize}h${-cellSize}z`
}
