export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))
export function getPosition({ value, min, max }: { value: number; min: number; max: number }) {
  return clamp(((value - min) / (max - min)) * 100, 0, 100)
}
export function getPrecision(step: number) {
  if (!step) return 0
  const split = step.toString().split('.')
  return split.length > 1 ? split[1].length : 0
}
export function getFloatingValue(value: number, precision: number) {
  return parseFloat(value.toFixed(precision))
}
export function getChangeValue({
  value,
  containerWidth,
  min,
  max,
  step,
  precision,
}: {
  value: number
  containerWidth?: number
  min: number
  max: number
  step: number
  precision?: number
}) {
  const left = !containerWidth ? value : clamp(value, 0, containerWidth) / containerWidth
  const dx = left * (max - min)
  const next = Math.max((dx !== 0 ? Math.round(dx / step) * step : 0) + min, min)
  return precision === undefined ? next : Number(next.toFixed(precision))
}
export function getNextMarkValue(current: number, marks: { value: number }[]) {
  return (
    [...marks].sort((a, b) => a.value - b.value).find((mark) => mark.value > current)?.value ??
    current
  )
}
export function getPreviousMarkValue(current: number, marks: { value: number }[]) {
  return (
    [...marks].sort((a, b) => b.value - a.value).find((mark) => mark.value < current)?.value ??
    current
  )
}
export function findClosest(value: number, values: number[]) {
  return values.reduce(
    (closest, item) => (Math.abs(item - value) < Math.abs(closest - value) ? item : closest),
    values[0] ?? value,
  )
}
export function isMarkFilled({
  mark,
  offset,
  value,
  inverted = false,
  startPointValue,
}: {
  mark: { value: number }
  offset?: number
  value: number
  inverted?: boolean
  startPointValue?: number
}) {
  if (typeof startPointValue === 'number' && !inverted)
    return (
      (mark.value >= startPointValue && mark.value <= value) ||
      (mark.value <= startPointValue && mark.value >= value)
    )
  return inverted
    ? typeof offset === 'number'
      ? mark.value <= offset || mark.value >= value
      : mark.value >= value
    : typeof offset === 'number'
      ? mark.value >= offset && mark.value <= value
      : mark.value <= value
}
