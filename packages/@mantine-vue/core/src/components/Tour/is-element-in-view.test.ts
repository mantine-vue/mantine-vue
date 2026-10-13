import { describe, expect, it } from 'vitest'
import { isElementInView } from './is-element-in-view'

function rect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
    x: left,
    y: top,
    toJSON: () => ({}),
  }
}

describe('isElementInView', () => {
  it('detects elements clipped by a scrollable ancestor', () => {
    const viewport = document.createElement('div')
    const target = document.createElement('div')
    viewport.style.overflow = 'auto'
    viewport.appendChild(target)
    document.body.appendChild(viewport)

    viewport.getBoundingClientRect = () => rect(100, 100, 200, 100)
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      clientWidth: { configurable: true, value: 200 },
    })
    target.getBoundingClientRect = () => rect(250, 110, 100, 20)

    expect(isElementInView(target)).toBe(false)

    target.getBoundingClientRect = () => rect(120, 110, 100, 20)
    expect(isElementInView(target)).toBe(true)

    viewport.remove()
  })
})
