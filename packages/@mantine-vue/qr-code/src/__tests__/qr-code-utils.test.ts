import { describe, expect, it } from 'vitest'
import { dotPath } from '../lib/dot-shapes'
import { finderPatternPaths } from '../lib/finder-shapes'
import { generateQRMatrix, isFinderPattern } from '../lib/qr-encoder'
import { getExcavationMask } from '../lib/utils'

describe('@mantine-vue/qr-code utilities', () => {
  it('generates distinct paths for every dot and finder shape', () => {
    const dotPaths = ['square', 'rounded', 'dots'].map((style) => dotPath(1, 2, 1, style as any))
    const finderPaths = ['square', 'rounded', 'dots'].map((style) =>
      finderPatternPaths(0, 0, 1, style as any),
    )

    expect(new Set(dotPaths).size).toBe(3)
    expect(new Set(finderPaths.map((item) => item.outer)).size).toBe(3)
    finderPaths.forEach((item) => {
      expect(item.outer).toBeTruthy()
      expect(item.inner).toBeTruthy()
    })
  })

  it('generates a square QR matrix and detects only finder regions', () => {
    const qr = generateQRMatrix('test', 'M')
    expect(qr.modules).toHaveLength(qr.size)
    expect(qr.modules.every((row) => row.length === qr.size)).toBe(true)
    expect(isFinderPattern(0, 0, qr.size)).toBe(true)
    expect(isFinderPattern(0, qr.size - 1, qr.size)).toBe(true)
    expect(isFinderPattern(qr.size - 1, 0, qr.size)).toBe(true)
    expect(isFinderPattern(qr.size - 1, qr.size - 1, qr.size)).toBe(false)
    expect(isFinderPattern(8, 8, qr.size)).toBe(false)
  })

  it('builds a centered excavation mask including image padding', () => {
    const mask = getExcavationMask(21, 5, 1)
    const excavated = mask.flat().filter(Boolean)
    expect(excavated).toHaveLength(49)
    expect(mask[7][7]).toBe(true)
    expect(mask[13][13]).toBe(true)
    expect(mask[6][6]).toBe(false)
  })
})
