export function getOverlayHitPath(
  rect: { top: number; left: number; width: number; height: number } | null,
  padding: number,
) {
  if (!rect) return 'M0 0H10000V10000H0Z'
  const left = rect.left - padding
  const top = rect.top - padding
  const right = rect.left + rect.width + padding
  const bottom = rect.top + rect.height + padding
  return `M0 0H10000V10000H0Z M${left} ${top}V${bottom}H${right}V${top}Z`
}
