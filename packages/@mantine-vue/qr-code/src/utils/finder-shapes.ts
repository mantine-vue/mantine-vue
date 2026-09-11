import type { QRCodeCornerStyle } from '../QRCode.types'

export interface FinderPaths {
  outer: string
  inner: string
}

function roundedRect(x: number, y: number, width: number, height: number, radius: number) {
  return (
    `M${x + radius},${y}` +
    `h${width - 2 * radius}a${radius},${radius} 0 0,1 ${radius},${radius}` +
    `v${height - 2 * radius}a${radius},${radius} 0 0,1 ${-radius},${radius}` +
    `h${-(width - 2 * radius)}a${radius},${radius} 0 0,1 ${-radius},${-radius}` +
    `v${-(height - 2 * radius)}a${radius},${radius} 0 0,1 ${radius},${-radius}z`
  )
}

function roundedRectReverse(x: number, y: number, width: number, height: number, radius: number) {
  return (
    `M${x + radius},${y}` +
    `a${radius},${radius} 0 0,0 ${-radius},${radius}` +
    `v${height - 2 * radius}a${radius},${radius} 0 0,0 ${radius},${radius}` +
    `h${width - 2 * radius}a${radius},${radius} 0 0,0 ${radius},${-radius}` +
    `v${-(height - 2 * radius)}a${radius},${radius} 0 0,0 ${-radius},${-radius}z`
  )
}

/** Generates separate outer-ring and inner paths for a 7x7 finder pattern. */
export function finderPatternPaths(
  x: number,
  y: number,
  cellSize: number,
  style: QRCodeCornerStyle,
): FinderPaths {
  if (style === 'square') {
    const outer =
      `M${x},${y}h${cellSize * 7}v${cellSize * 7}h${-cellSize * 7}z` +
      `M${x + cellSize},${y + cellSize}v${cellSize * 5}h${cellSize * 5}v${-cellSize * 5}z`
    const inner =
      `M${x + cellSize * 2},${y + cellSize * 2}` +
      `h${cellSize * 3}v${cellSize * 3}h${-cellSize * 3}z`
    return { outer, inner }
  }

  const outerRadius = style === 'dots' ? cellSize * 3.5 : cellSize * 1.2
  const holeRadius = style === 'dots' ? cellSize * 2.5 : cellSize * 0.8
  const innerRadius = style === 'dots' ? cellSize * 1.5 : cellSize * 0.6

  return {
    outer:
      roundedRect(x, y, cellSize * 7, cellSize * 7, outerRadius) +
      roundedRectReverse(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5, holeRadius),
    inner: roundedRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3, innerRadius),
  }
}
