import type { RingProgressSection } from '../RingProgress'

interface RootCurveData {
  value?: never
  color?: string
}

interface GetCurves {
  sections: RingProgressSection[]
  size: number
  thickness: number
  renderRoundedLineCaps: boolean | undefined
  rootColor?: string
  sectionGap?: number
}

interface Curve {
  sum: number
  offset: number
  root: boolean
  data: RingProgressSection | RootCurveData
  lineRoundCaps?: boolean
}

export function getCurves({
  size,
  thickness,
  sections,
  renderRoundedLineCaps,
  rootColor,
  sectionGap = 0,
}: GetCurves) {
  const sum = sections.reduce((acc, current) => acc + current.value, 0)
  const accumulated = Math.PI * ((size * 0.9 - thickness * 2) / 2) * 2
  let offset = accumulated
  const curves: Curve[] = []
  const curvesInOrder: Curve[] = []
  const gapPercentage = (sectionGap / 360) * 100

  for (let i = 0; i < sections.length; i += 1) {
    const adjustedValue = Math.max(0, sections[i].value - gapPercentage)
    curves.push({ sum, offset, data: { ...sections[i], value: adjustedValue }, root: false })
    offset -= (sections[i].value / 100) * accumulated
  }

  curves.push({ sum, offset, data: { color: rootColor }, root: true })
  curvesInOrder.push({ ...curves[curves.length - 1], lineRoundCaps: false })

  if (curves.length > 2) {
    curvesInOrder.push({ ...curves[0], lineRoundCaps: renderRoundedLineCaps })
    curvesInOrder.push({ ...curves[curves.length - 2], lineRoundCaps: renderRoundedLineCaps })

    for (let i = 1; i <= curves.length - 3; i += 1) {
      curvesInOrder.push({ ...curves[i], lineRoundCaps: false })
    }
  } else {
    curvesInOrder.push({ ...curves[0], lineRoundCaps: renderRoundedLineCaps })
  }

  return curvesInOrder
}
