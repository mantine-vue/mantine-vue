import { describe, expect, it } from 'vitest'
import {
  canQuickAdd,
  createDefaultSelection,
  isGroupAtMax,
  toggleModifierOption,
  validateSelection,
} from '../domain/modifiers'
import { productFixture } from './fixtures'

describe('restaurant-qr-menu modifiers', () => {
  it('pre-selects defaults and the first available variant', () => {
    const shawarma = productFixture('sh-shawarma')
    const selection = createDefaultSelection(shawarma)
    expect(selection.variantId).toBe('regular')
    expect(selection.modifiers).toEqual({ sauces: ['toum'], extras: [], remove: [] })
    expect(validateSelection(shawarma, selection).valid).toBe(true)
  })

  it('reports a missing required single choice', () => {
    const burger = productFixture('sh-burger')
    const result = validateSelection(burger, createDefaultSelection(burger))
    expect(result.valid).toBe(false)
    expect(result.groupErrors).toEqual([{ groupId: 'doneness', code: 'required', limit: 1 }])
  })

  it('replaces the choice in single-select groups', () => {
    const burger = productFixture('sh-burger')
    const group = burger.modifierGroups![0]
    let selection = createDefaultSelection(burger)
    selection = toggleModifierOption(selection, group, 'rare')
    selection = toggleModifierOption(selection, group, 'well-done')
    expect(selection.modifiers.doneness).toEqual(['well-done'])
    // Required single groups cannot be cleared by toggling again.
    expect(toggleModifierOption(selection, group, 'well-done').modifiers.doneness).toEqual([
      'well-done',
    ])
  })

  it('enforces the maximum of multi-select groups', () => {
    const grill = productFixture('sh-mixed-grill')
    const sides = grill.modifierGroups!.find((group) => group.id === 'sides')!
    let selection = createDefaultSelection(grill)
    for (const option of ['hummus', 'fries', 'grilled-veg', 'toum']) {
      selection = toggleModifierOption(selection, sides, option)
    }
    expect(selection.modifiers.sides).toEqual(['hummus', 'fries', 'grilled-veg'])
    expect(isGroupAtMax(selection, sides)).toBe(true)
    selection = toggleModifierOption(selection, sides, 'fries')
    expect(selection.modifiers.sides).toEqual(['hummus', 'grilled-veg'])
  })

  it('rejects too many options, too few options and unavailable options', () => {
    const shawarma = productFixture('sh-shawarma')
    const base = createDefaultSelection(shawarma)

    const tooMany = validateSelection(shawarma, {
      ...base,
      modifiers: { ...base.modifiers, sauces: ['toum', 'tahini', 'chilli'] },
    })
    expect(tooMany.groupErrors).toEqual([{ groupId: 'sauces', code: 'max', limit: 2 }])

    const none = validateSelection(shawarma, {
      ...base,
      modifiers: { ...base.modifiers, sauces: [] },
    })
    expect(none.groupErrors[0]).toMatchObject({ groupId: 'sauces', code: 'required' })

    const unavailable = validateSelection(shawarma, {
      ...base,
      modifiers: { ...base.modifiers, extras: ['halloumi'] },
    })
    expect(unavailable.groupErrors).toEqual([{ groupId: 'extras', code: 'unavailable' }])
  })

  it('requires a valid variant for products with sizes', () => {
    const fries = productFixture('sh-fries')
    expect(validateSelection(fries, { modifiers: {} }).variantError).toBe('required')
    expect(validateSelection(fries, { variantId: 'regular', modifiers: {} }).valid).toBe(true)
  })

  it('only allows quick add without required choices', () => {
    expect(canQuickAdd(productFixture('sh-soup'))).toBe(true)
    expect(canQuickAdd(productFixture('sh-burger'))).toBe(false)
    expect(canQuickAdd(productFixture('sh-fries'))).toBe(false)
    expect(canQuickAdd(productFixture('sh-brownie'))).toBe(false)
  })
})
