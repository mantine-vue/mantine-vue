import { describe, expect, it } from 'vitest'
import { toMajorUnits, toMinorUnits } from '../domain/money'
import {
  calculateTotals,
  createCartLineId,
  getStartingPrice,
  getUnitPrice,
  priceCartLines,
} from '../domain/pricing'
import type { CartLine, Product, Promotion } from '../domain/types'
import { productFixture, settingsFixture } from './fixtures'

const line = (product: Product, overrides: Partial<CartLine> = {}): CartLine => ({
  id: product.id,
  productId: product.id,
  quantity: 1,
  selection: { modifiers: {} },
  notes: '',
  addedAt: 0,
  ...overrides,
})

const products = (...items: Product[]) => new Map(items.map((item) => [item.id, item]))

describe('restaurant-qr-menu pricing', () => {
  it('converts currencies with 2 and 3 minor digits', () => {
    expect(toMajorUnits(1250, 'USD')).toBe(12.5)
    expect(toMajorUnits(7900, 'BHD')).toBe(7.9)
    expect(toMinorUnits(7.9, 'BHD')).toBe(7900)
    expect(toMinorUnits(12.345, 'USD')).toBe(1235)
  })

  it('adds variant price and modifier deltas to the unit price', () => {
    const grill = productFixture('sh-mixed-grill')
    const unit = getUnitPrice(grill, {
      variantId: 'double',
      modifiers: { bread: ['saffron-rice'], sides: ['hummus', 'toum'] },
    })
    // 13.500 + 0.400 rice + 0.800 hummus + 0.300 toum
    expect(unit).toBe(13500 + 400 + 800 + 300)
    expect(getStartingPrice(grill)).toBe(7900)
  })

  it('creates the same line id for equivalent selections regardless of order', () => {
    const grill = productFixture('sh-mixed-grill')
    const a = createCartLineId(
      grill,
      { variantId: 'single', modifiers: { sides: ['toum', 'hummus'] } },
      'No onion',
    )
    const b = createCartLineId(
      grill,
      { variantId: 'single', modifiers: { sides: ['hummus', 'toum'] } },
      ' no onion ',
    )
    expect(a).toBe(b)
  })

  it('flags sold-out, missing and invalid lines and excludes them from totals', () => {
    const brownie = productFixture('sh-brownie')
    const burger = productFixture('sh-burger')
    const fries = productFixture('sh-fries')
    const priced = priceCartLines(
      [
        line(brownie),
        line(burger, { selection: { modifiers: {} } }),
        line(fries, { selection: { variantId: 'regular', modifiers: {} }, quantity: 2 }),
        { ...line(fries), id: 'ghost', productId: 'does-not-exist' },
      ],
      products(brownie, burger, fries),
    )
    expect(priced.map((item) => item.issue)).toEqual([
      'sold-out',
      'invalid-selection',
      undefined,
      'missing',
    ])

    const totals = calculateTotals({
      lines: priced,
      settings: settingsFixture(),
      currency: 'BHD',
      mode: 'takeaway',
    })
    expect(totals.subtotal).toBe(2400)
    expect(totals.itemCount).toBe(2)
  })

  it('applies dine-in service charge and exclusive VAT', () => {
    const fries = productFixture('sh-fries')
    const priced = priceCartLines(
      [line(fries, { selection: { variantId: 'regular', modifiers: {} }, quantity: 3 })],
      products(fries),
    )
    const totals = calculateTotals({
      lines: priced,
      settings: settingsFixture(),
      currency: 'BHD',
      mode: 'dine-in',
    })
    expect(totals.subtotal).toBe(3600)
    expect(totals.fees).toEqual([expect.objectContaining({ id: 'service', amount: 180 })])
    expect(totals.tax).toBe(378) // 10% of 3.780
    expect(totals.taxIncluded).toBe(false)
    expect(totals.total).toBe(3600 + 180 + 378)
  })

  it('extracts inclusive tax without changing the total', () => {
    const settings = settingsFixture({ pricesIncludeTax: true, taxRate: 0.05, fees: [] })
    const fries = productFixture('sh-fries')
    const priced = priceCartLines(
      [line(fries, { selection: { variantId: 'regular', modifiers: {} } })],
      products(fries),
    )
    const totals = calculateTotals({ lines: priced, settings, currency: 'AED', mode: 'dine-in' })
    expect(totals.total).toBe(1200)
    expect(totals.tax).toBe(57) // 1200 - 1200 / 1.05
    expect(totals.taxIncluded).toBe(true)
  })

  it('charges delivery unless above the free delivery threshold or with a free-delivery promo', () => {
    const grill = productFixture('sh-mixed-grill')
    const priced = (quantity: number) =>
      priceCartLines(
        [
          line(grill, {
            quantity,
            selection: { variantId: 'single', modifiers: { bread: ['arabic-bread'], sides: [] } },
          }),
        ],
        products(grill),
      )
    const settings = settingsFixture()

    const small = calculateTotals({ lines: priced(1), settings, currency: 'BHD', mode: 'delivery' })
    expect(small.deliveryFee).toBe(800)
    expect(small.fees.map((fee) => fee.id)).toEqual(['packaging'])

    const large = calculateTotals({ lines: priced(2), settings, currency: 'BHD', mode: 'delivery' })
    expect(large.deliveryFee).toBe(0)

    const freeDelivery: Promotion = {
      id: 'p',
      title: {},
      description: {},
      kind: 'free-delivery',
      value: 0,
      modes: ['delivery'],
    }
    const promo = calculateTotals({
      lines: priced(1),
      settings,
      currency: 'BHD',
      mode: 'delivery',
      promotion: freeDelivery,
    })
    expect(promo.deliveryFee).toBe(0)
  })

  it('caps percentage discounts and ignores ineligible promotions', () => {
    const grill = productFixture('sh-mixed-grill')
    const priced = priceCartLines(
      [
        line(grill, {
          quantity: 4,
          selection: { variantId: 'family', modifiers: { bread: ['arabic-bread'], sides: [] } },
        }),
      ],
      products(grill),
    )
    const welcome: Promotion = {
      id: 'welcome',
      code: 'WELCOME10',
      title: {},
      description: {},
      kind: 'percentage',
      value: 0.1,
      minSubtotal: 5000,
      maxDiscount: 2000,
    }
    const totals = calculateTotals({
      lines: priced,
      settings: settingsFixture(),
      currency: 'BHD',
      mode: 'takeaway',
      promotion: welcome,
    })
    expect(totals.subtotal).toBe(96000)
    expect(totals.discount).toBe(2000)

    const tooSmall = priceCartLines(
      [line(productFixture('sh-soup'))],
      products(productFixture('sh-soup')),
    )
    const ineligible = calculateTotals({
      lines: tooSmall,
      settings: settingsFixture(),
      currency: 'BHD',
      mode: 'takeaway',
      promotion: welcome,
    })
    expect(ineligible.discount).toBe(0)
  })

  it('computes tips from a rate or a custom amount', () => {
    const soup = productFixture('sh-soup')
    const priced = priceCartLines([line(soup, { quantity: 5 })], products(soup))
    const settings = settingsFixture({ fees: [] })
    expect(
      calculateTotals({ lines: priced, settings, currency: 'BHD', mode: 'takeaway', tipRate: 0.1 })
        .tip,
    ).toBe(800)
    expect(
      calculateTotals({
        lines: priced,
        settings,
        currency: 'BHD',
        mode: 'takeaway',
        tipAmount: 1234,
      }).tip,
    ).toBe(1234)
    expect(
      calculateTotals({
        lines: priced,
        settings: { ...settings, tipOptions: [] },
        currency: 'BHD',
        mode: 'takeaway',
        tipRate: 0.2,
      }).tip,
    ).toBe(0)
  })
})
