// Ported verbatim from @mantine/carousel/src/get-chevron-rotation.ts – pure function, no
// React/Vue specifics.
export interface GetChevronRotationOptions {
  dir: 'rtl' | 'ltr'
  orientation: 'horizontal' | 'vertical' | undefined
  direction: 'next' | 'previous'
}

export function getChevronRotation({ dir, orientation, direction }: GetChevronRotationOptions) {
  if (direction === 'previous') {
    return orientation === 'horizontal' ? 90 * (dir === 'ltr' ? 1 : -1) : -180
  }

  return orientation === 'horizontal' ? 90 * (dir === 'ltr' ? -1 : 1) : 0
}
