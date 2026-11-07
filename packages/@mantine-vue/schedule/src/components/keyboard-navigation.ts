export function handleGridKeydown({
  event,
  index,
  columns,
  total,
  getControl,
  dir = 'ltr',
}: {
  event: KeyboardEvent
  index: number
  columns: number
  total: number
  getControl: (index: number) => HTMLButtonElement | null
  dir?: 'ltr' | 'rtl'
}): void {
  const step =
    event.key === 'ArrowRight'
      ? dir === 'rtl'
        ? -1
        : 1
      : event.key === 'ArrowLeft'
        ? dir === 'rtl'
          ? 1
          : -1
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
