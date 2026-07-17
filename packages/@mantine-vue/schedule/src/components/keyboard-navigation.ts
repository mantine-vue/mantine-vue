export function handleGridKeydown({
  event,
  index,
  columns,
  total,
  getControl,
}: {
  event: KeyboardEvent
  index: number
  columns: number
  total: number
  getControl: (index: number) => HTMLButtonElement | null
}): void {
  const step =
    event.key === 'ArrowRight'
      ? 1
      : event.key === 'ArrowLeft'
        ? -1
        : event.key === 'ArrowDown'
          ? columns
          : event.key === 'ArrowUp'
            ? -columns
            : 0

  if (step === 0) return
  event.preventDefault()

  for (let next = index + step; next >= 0 && next < total; next += step) {
    const control = getControl(next)
    if (control && !control.disabled && !control.hasAttribute('data-hidden')) {
      control.focus()
      return
    }
  }
}
