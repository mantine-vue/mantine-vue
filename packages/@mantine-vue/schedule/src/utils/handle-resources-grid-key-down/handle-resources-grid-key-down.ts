export type ResourcesGridControls = Array<Array<HTMLButtonElement | undefined>>

export interface HandleResourcesGridKeyDownInput {
  controls: ResourcesGridControls
  resourceIndex: number
  slotIndex: number
  event: KeyboardEvent
}

export function handleResourcesGridKeyDown({
  controls,
  resourceIndex,
  slotIndex,
  event,
}: HandleResourcesGridKeyDownInput): void {
  const deltas: Record<string, [number, number]> = {
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
  }
  const delta = deltas[event.key]
  if (!delta) return
  event.preventDefault()

  let row = resourceIndex + delta[0]
  let column = slotIndex + delta[1]
  while (row >= 0 && row < controls.length) {
    const rowControls = controls[row] || []
    if (delta[0] !== 0) column = Math.min(column, rowControls.length - 1)
    if (column < 0 || column >= rowControls.length) return
    const control = rowControls[column]
    if (control && !control.disabled && !control.hasAttribute('data-hidden')) {
      control.focus()
      return
    }
    row += delta[0]
    column += delta[1]
  }
}
