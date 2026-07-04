import { rem } from '../../../core'
import type { IndicatorPosition } from '../Indicator.types'

export function getPositionVariables(
  position: IndicatorPosition = 'top-end',
  offset: number | { x: number; y: number } = 0,
) {
  const variables: Record<string, string | undefined> = {
    '--indicator-top': undefined,
    '--indicator-bottom': undefined,
    '--indicator-left': undefined,
    '--indicator-right': undefined,
    '--indicator-translate-x': undefined,
    '--indicator-translate-y': undefined,
  }

  const offsetX = typeof offset === 'number' ? offset : offset.x
  const offsetY = typeof offset === 'number' ? offset : offset.y
  const [side, placement] = position.split('-')

  if (side === 'top') {
    variables['--indicator-top'] = rem(offsetY)
    variables['--indicator-translate-y'] = '-50%'
  }

  if (side === 'middle') {
    variables['--indicator-top'] = '50%'
    variables['--indicator-translate-y'] = '-50%'
  }

  if (side === 'bottom') {
    variables['--indicator-bottom'] = rem(offsetY)
    variables['--indicator-translate-y'] = '50%'
  }

  if (placement === 'start') {
    variables['--indicator-left'] = rem(offsetX)
    variables['--indicator-translate-x'] = '-50%'
  }

  if (placement === 'center') {
    variables['--indicator-left'] = '50%'
    variables['--indicator-translate-x'] = '-50%'
  }

  if (placement === 'end') {
    variables['--indicator-right'] = rem(offsetX)
    variables['--indicator-translate-x'] = '50%'
  }

  return variables
}
