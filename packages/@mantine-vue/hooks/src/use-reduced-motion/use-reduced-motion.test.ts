import { describe, expect, it } from 'vitest'
import { useReducedMotion } from './use-reduced-motion'

describe('@mantine-vue/hooks/use-reduced-motion', () => {
  it('supports reduced motion media query wrapper', () => {
    const reducedMotion = useReducedMotion(false, { getInitialValueInEffect: false })
    expect(reducedMotion.value).toBe(false)
  })
})
