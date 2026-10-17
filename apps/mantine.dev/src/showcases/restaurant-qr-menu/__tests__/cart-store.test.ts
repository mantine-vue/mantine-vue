import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createMemoryStorage } from '../../shared/persistence'
import { createDefaultSelection } from '../domain/modifiers'
import { createCartStore } from '../stores/cart-store'
import { createCustomerStore } from '../stores/customer-store'
import { createPreferencesStore } from '../stores/preferences-store'
import { productFixture } from './fixtures'

const setup = (storage = createMemoryStorage()) => {
  const restaurantId = ref('saffron-house')
  const cart = createCartStore({ storage, restaurantId: () => restaurantId.value })
  return { cart, storage, restaurantId }
}

describe('restaurant-qr-menu cart store', () => {
  it('merges identical items and keeps different choices on separate lines', () => {
    const { cart } = setup()
    const shawarma = productFixture('sh-shawarma')
    const selection = createDefaultSelection(shawarma)

    cart.addItem({ product: shawarma, selection, quantity: 1, maxQuantity: 20 })
    cart.addItem({ product: shawarma, selection, quantity: 2, maxQuantity: 20 })
    expect(cart.lines.value).toHaveLength(1)
    expect(cart.itemCount.value).toBe(3)

    cart.addItem({
      product: shawarma,
      selection: { ...selection, variantId: 'large' },
      quantity: 1,
      maxQuantity: 20,
    })
    cart.addItem({
      product: shawarma,
      selection,
      quantity: 1,
      notes: 'Extra crispy',
      maxQuantity: 20,
    })
    expect(cart.lines.value).toHaveLength(3)
    expect(cart.quantityOf(shawarma.id)).toBe(5)
  })

  it('clamps quantities to the restaurant maximum', () => {
    const { cart } = setup()
    const soup = productFixture('sh-soup')
    const result = cart.addItem({
      product: soup,
      selection: { modifiers: {} },
      quantity: 25,
      maxQuantity: 20,
    })
    expect(result.clamped).toBe(true)
    expect(cart.itemCount.value).toBe(20)
  })

  it('updates, removes and restores lines', () => {
    const { cart } = setup()
    const shawarma = productFixture('sh-shawarma')
    const selection = createDefaultSelection(shawarma)
    const { line } = cart.addItem({ product: shawarma, selection, quantity: 1, maxQuantity: 20 })

    cart.setQuantity(line.id, 4, 20)
    expect(cart.itemCount.value).toBe(4)

    const updated = cart.updateItem(line.id, {
      product: shawarma,
      selection: { ...selection, variantId: 'plate' },
      quantity: 2,
      maxQuantity: 20,
    })
    expect(cart.lines.value).toHaveLength(1)
    expect(updated.line.selection.variantId).toBe('plate')
    expect(cart.itemCount.value).toBe(2)

    const removed = cart.removeLine(updated.line.id)!
    expect(cart.isEmpty.value).toBe(true)
    cart.restoreLine(removed)
    expect(cart.lines.value[0].id).toBe(updated.line.id)

    cart.setQuantity(updated.line.id, 0, 20)
    expect(cart.isEmpty.value).toBe(true)
  })

  it('merges into an existing identical line when an edit makes them equal', () => {
    const { cart } = setup()
    const shawarma = productFixture('sh-shawarma')
    const selection = createDefaultSelection(shawarma)
    cart.addItem({ product: shawarma, selection, quantity: 1, maxQuantity: 20 })
    const large = cart.addItem({
      product: shawarma,
      selection: { ...selection, variantId: 'large' },
      quantity: 2,
      maxQuantity: 20,
    })
    cart.updateItem(large.line.id, { product: shawarma, selection, quantity: 2, maxQuantity: 20 })
    expect(cart.lines.value).toHaveLength(1)
    expect(cart.itemCount.value).toBe(3)
  })

  it('keeps a separate cart per restaurant', () => {
    const { cart, restaurantId } = setup()
    cart.addItem({
      product: productFixture('sh-soup'),
      selection: { modifiers: {} },
      quantity: 1,
      maxQuantity: 20,
    })
    restaurantId.value = 'brew-and-bloom'
    expect(cart.isEmpty.value).toBe(true)
    cart.addItem({
      product: productFixture('bb-orange-juice', 'brew-and-bloom'),
      selection: { modifiers: {} },
      quantity: 2,
      maxQuantity: 10,
    })
    restaurantId.value = 'saffron-house'
    expect(cart.itemCount.value).toBe(1)
  })

  it('persists cart, notes, promo code and tip across reloads', () => {
    const storage = createMemoryStorage()
    const first = setup(storage).cart
    first.addItem({
      product: productFixture('sh-soup'),
      selection: { modifiers: {} },
      quantity: 2,
      maxQuantity: 20,
    })
    first.setNotes('Allergic to peanuts')
    first.setPromoCode('WELCOME10')
    first.setTip({ kind: 'rate', rate: 0.1 })

    const reloaded = setup(storage).cart
    expect(reloaded.itemCount.value).toBe(2)
    expect(reloaded.cart.value.notes).toBe('Allergic to peanuts')
    expect(reloaded.cart.value.promoCode).toBe('WELCOME10')
    expect(reloaded.cart.value.tip).toEqual({ kind: 'rate', rate: 0.1 })
  })
})

describe('restaurant-qr-menu customer & preference persistence', () => {
  it('persists favorites, recently viewed, sessions and saved details', () => {
    const storage = createMemoryStorage()
    const customer = createCustomerStore({ storage })
    expect(customer.toggleFavorite('saffron-house', 'sh-soup')).toBe(true)
    customer.markViewed('saffron-house', 'sh-fries')
    customer.markViewed('saffron-house', 'sh-soup')
    customer.markViewed('saffron-house', 'sh-fries')
    customer.setTable('saffron-house', '5')
    customer.setMode('saffron-house', 'dine-in')

    const reloaded = createCustomerStore({ storage })
    expect(reloaded.isFavorite('saffron-house', 'sh-soup')).toBe(true)
    expect(reloaded.recentlyViewed('saffron-house')).toEqual(['sh-fries', 'sh-soup'])
    expect(reloaded.getSession('saffron-house')).toEqual({ mode: 'dine-in', tableId: '5' })

    reloaded.reset()
    expect(createCustomerStore({ storage }).favorites('saffron-house')).toEqual([])
  })

  it('persists language, appearance and layout preferences', () => {
    const storage = createMemoryStorage()
    const preferences = createPreferencesStore({ storage })
    preferences.setLocale('ar')
    preferences.setThemePreset('berry')
    preferences.updateAppearance({ density: 'compact', radius: 'xl' })
    preferences.setLayout('compact')
    preferences.setColorScheme('dark')

    const reloaded = createPreferencesStore({ storage })
    expect(reloaded.state.locale).toBe('ar')
    expect(reloaded.state.appearance).toMatchObject({
      themePreset: 'berry',
      density: 'compact',
      radius: 'xl',
    })
    expect(reloaded.state.layoutPreset).toBe('compact')
    expect(reloaded.state.colorScheme).toBe('dark')

    reloaded.resetAppearance()
    expect(reloaded.state.appearance.themePreset).toBeNull()
    expect(reloaded.state.layoutPreset).toBeNull()
    expect(reloaded.state.locale).toBe('ar')
  })
})
