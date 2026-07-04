import type { CSSProperties } from 'vue'
import type { ArrowPosition, FloatingPlacement, FloatingPosition, FloatingSide } from '../types'

function horizontalSide(
  placement: FloatingPlacement | 'center',
  arrowY: number | undefined,
  offset: number,
  position: ArrowPosition,
) {
  if (placement === 'center' || position === 'center') return { top: arrowY }
  return placement === 'end' ? { bottom: offset } : { top: offset }
}
function verticalSide(
  placement: FloatingPlacement | 'center',
  arrowX: number | undefined,
  offset: number,
  position: ArrowPosition,
  dir: 'rtl' | 'ltr',
) {
  if (placement === 'center' || position === 'center') return { left: arrowX }
  if (placement === 'end') return { [dir === 'ltr' ? 'right' : 'left']: offset }
  return { [dir === 'ltr' ? 'left' : 'right']: offset }
}
const radiusBySide: Record<FloatingSide, keyof CSSProperties> = {
  bottom: 'borderTopLeftRadius',
  left: 'borderTopRightRadius',
  right: 'borderBottomLeftRadius',
  top: 'borderBottomRightRadius',
}
function mergeStyles(
  position: FloatingPosition,
  size: number,
  dir: 'rtl' | 'ltr',
): CSSProperties | undefined {
  const [side, placement] = position.split('-') as [FloatingSide, FloatingPlacement?]
  if (!placement) return undefined
  const base: CSSProperties = { width: `${size}px`, height: `${size}px`, position: 'absolute' }
  if (side === 'bottom' || side === 'top') {
    const physical =
      placement === 'start' ? (dir === 'ltr' ? 'left' : 'right') : dir === 'ltr' ? 'right' : 'left'
    const startShape = (placement === 'start') !== (dir === 'rtl')
    return {
      ...base,
      [side === 'bottom' ? 'top' : 'bottom']: -size,
      [physical]: 0,
      clipPath:
        side === 'bottom'
          ? startShape
            ? 'polygon(0% 0%, 0% 100%, 100% 100%)'
            : 'polygon(100% 0%, 0% 100%, 100% 100%)'
          : startShape
            ? 'polygon(0% 0%, 100% 0%, 0% 100%)'
            : 'polygon(0% 0%, 100% 0%, 100% 100%)',
    }
  }
  return {
    ...base,
    [side === 'left' ? 'right' : 'left']: -size,
    [placement === 'start' ? 'top' : 'bottom']: 0,
    clipPath:
      side === 'left'
        ? placement === 'start'
          ? 'polygon(0% 0%, 100% 0%, 0% 100%)'
          : 'polygon(0% 0%, 0% 100%, 100% 100%)'
        : placement === 'start'
          ? 'polygon(0% 0%, 100% 0%, 100% 100%)'
          : 'polygon(100% 0%, 0% 100%, 100% 100%)',
  }
}

export function getArrowPositionStyles(input: {
  position: FloatingPosition
  arrowSize: number
  arrowOffset: number
  arrowRadius: number
  arrowPosition: ArrowPosition
  arrowX?: number
  arrowY?: number
  dir: 'rtl' | 'ltr'
}): CSSProperties {
  if (input.arrowPosition === 'merge') {
    const merged = mergeStyles(input.position, input.arrowSize, input.dir)
    if (merged) return merged
  }
  const [side, placement = 'center'] = input.position.split('-') as [
    FloatingSide,
    FloatingPlacement | 'center',
  ]
  const base: CSSProperties = {
    width: `${input.arrowSize}px`,
    height: `${input.arrowSize}px`,
    transform: 'rotate(45deg)',
    position: 'absolute',
    [radiusBySide[side]]: `${input.arrowRadius}px`,
  }
  const edge = -input.arrowSize / 2
  if (side === 'left')
    return {
      ...base,
      ...horizontalSide(placement, input.arrowY, input.arrowOffset, input.arrowPosition),
      right: edge,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
      clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
    }
  if (side === 'right')
    return {
      ...base,
      ...horizontalSide(placement, input.arrowY, input.arrowOffset, input.arrowPosition),
      left: edge,
      borderRightColor: 'transparent',
      borderTopColor: 'transparent',
      clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
    }
  if (side === 'top')
    return {
      ...base,
      ...verticalSide(placement, input.arrowX, input.arrowOffset, input.arrowPosition, input.dir),
      bottom: edge,
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
    }
  return {
    ...base,
    ...verticalSide(placement, input.arrowX, input.arrowOffset, input.arrowPosition, input.dir),
    top: edge,
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    clipPath: 'polygon(0 100%, 0 0, 100% 0)',
  }
}

export function getArrowMergeDropdownStyles({
  position,
  dir,
}: {
  position: FloatingPosition
  dir: 'rtl' | 'ltr'
}): CSSProperties | undefined {
  const [side, placement] = position.split('-') as [FloatingSide, FloatingPlacement?]
  if (!placement) return undefined
  const physicallyLeft =
    (placement === 'start' && dir === 'ltr') || (placement === 'end' && dir === 'rtl')
  if (side === 'bottom')
    return physicallyLeft ? { borderTopLeftRadius: 0 } : { borderTopRightRadius: 0 }
  if (side === 'top')
    return physicallyLeft ? { borderBottomLeftRadius: 0 } : { borderBottomRightRadius: 0 }
  if (side === 'left')
    return placement === 'start' ? { borderTopRightRadius: 0 } : { borderBottomRightRadius: 0 }
  return placement === 'start' ? { borderTopLeftRadius: 0 } : { borderBottomLeftRadius: 0 }
}
