import type { FloatingPlacement, FloatingPosition, FloatingSide } from '../types'

export function getFloatingPosition(
  dir: 'rtl' | 'ltr',
  position: FloatingPosition,
): FloatingPosition {
  if (dir === 'rtl' && (position.includes('right') || position.includes('left'))) {
    const [side, placement] = position.split('-') as [FloatingSide, FloatingPlacement?]
    const flipped = side === 'right' ? 'left' : 'right'
    return placement ? `${flipped}-${placement}` : flipped
  }
  return position
}
