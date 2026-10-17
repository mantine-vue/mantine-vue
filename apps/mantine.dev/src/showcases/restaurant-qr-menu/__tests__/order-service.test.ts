import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '../../shared/persistence'
import { createDefaultSelection } from '../domain/modifiers'
import { calculateTotals, createCartLineId, priceCartLines } from '../domain/pricing'
import type { CartLine, OrderDraft } from '../domain/types'
import { ApiError } from '../services/contracts'
import { createMockServices, type MockServicesOptions } from '../services/mock/create-mock-services'
import { DEFAULT_MOCK_DATASET } from '../services/mock/data'
import { productFixture, restaurantFixture, SAFFRON_CLOSED, SAFFRON_OPEN } from './fixtures'

function setup(overrides: Partial<MockServicesOptions> = {}) {
  let now = new Date(SAFFRON_OPEN)
  const storage = createMemoryStorage()
  const options: MockServicesOptions = {
    storage,
    latency: 0,
    random: () => 0.42,
    now: () => now,
    statusStepSeconds: 10,
    ...overrides,
  }
  return {
    services: createMockServices(options),
    storage,
    options,
    advance: (seconds: number) => {
      now = new Date(now.getTime() + seconds * 1000)
    },
    setNow: (date: Date) => {
      now = date
    },
  }
}

function cartLine(productId: string, quantity = 1, restaurantId = 'saffron-house'): CartLine {
  const product = productFixture(productId, restaurantId)
  const selection = createDefaultSelection(product)
  return {
    id: createCartLineId(product, selection, ''),
    productId,
    quantity,
    selection,
    notes: '',
    addedAt: 0,
  }
}

function draft(overrides: Partial<OrderDraft> = {}): OrderDraft {
  return {
    restaurantId: 'saffron-house',
    mode: 'dine-in',
    tableId: '5',
    lines: [cartLine('sh-mixed-grill'), cartLine('sh-mint-lemonade', 2)],
    customer: { name: '', phone: '' },
    scheduledFor: null,
    notes: 'Birthday – candles please',
    tipRate: 0.1,
    paymentMethod: 'pay-at-counter',
    locale: 'en',
    ...overrides,
  }
}

const expectValidation = async (promise: Promise<unknown>, code: string) => {
  const error = await promise.catch((caught: unknown) => caught)
  expect(error).toBeInstanceOf(ApiError)
  expect((error as ApiError).code).toBe('validation')
  expect(
    ((error as ApiError).details as { issues: { code: string }[] }).issues.map(
      (issue) => issue.code,
    ),
  ).toContain(code)
}

describe('restaurant-qr-menu mock order service', () => {
  it('places an order re-priced on the "server" with matching totals', async () => {
    const { services } = setup()
    const order = await services.orders.placeOrder(draft())

    const products = new Map(
      DEFAULT_MOCK_DATASET.menus['saffron-house'].products.map((item) => [item.id, item]),
    )
    const expected = calculateTotals({
      lines: priceCartLines(draft().lines, products),
      settings: restaurantFixture().ordering,
      currency: 'BHD',
      mode: 'dine-in',
      tipRate: 0.1,
    })

    expect(order.totals).toEqual(expected)
    expect(order.status).toBe('received')
    expect(order.number).toMatch(/^SH-\d{4}$/)
    expect(order.table?.id).toBe('5')
    expect(order.lines).toHaveLength(2)
    expect(order.payment).toMatchObject({ method: 'pay-at-counter', status: 'due' })
  })

  it('marks the demo online payment as simulated', async () => {
    const { services } = setup()
    const order = await services.orders.placeOrder(draft({ paymentMethod: 'demo-online' }))
    expect(order.payment.status).toBe('simulated')
    expect(order.payment.reference).toMatch(/^DEMO-/)
  })

  it('validates mode specific rules', async () => {
    const { services } = setup()
    await expectValidation(
      services.orders.placeOrder(draft({ tableId: undefined })),
      'table-required',
    )
    await expectValidation(
      services.orders.placeOrder(draft({ mode: 'takeaway', tableId: undefined })),
      'customer-name',
    )
    await expectValidation(
      services.orders.placeOrder(
        draft({
          mode: 'delivery',
          lines: [cartLine('sh-soup')],
          customer: { name: 'Sam', phone: '+973 3600 0000' },
          deliveryAddress: { area: 'Adliya', street: 'Road 1', building: '12' },
          paymentMethod: 'cash',
        }),
      ),
      'minimum-order',
    )
    await expectValidation(
      services.orders.placeOrder(
        draft({ mode: 'takeaway', customer: { name: 'Sam', phone: '12' } }),
      ),
      'customer-phone',
    )
    await expectValidation(
      services.orders.placeOrder(draft({ paymentMethod: 'cash' })),
      'payment-method',
    )
    await expectValidation(
      services.orders.placeOrder(draft({ lines: [cartLine('sh-brownie')] })),
      'unavailable-items',
    )
  })

  it('requires scheduling when the restaurant is closed', async () => {
    const { services, setNow } = setup()
    setNow(SAFFRON_CLOSED)
    const takeaway = draft({
      mode: 'takeaway',
      tableId: undefined,
      customer: { name: 'Sam', phone: '+973 3600 0000' },
    })
    await expectValidation(services.orders.placeOrder(takeaway), 'restaurant-closed')

    const scheduled = await services.orders.placeOrder({
      ...takeaway,
      scheduledFor: new Date(SAFFRON_CLOSED.getTime() + 10 * 3_600_000).toISOString(),
    })
    expect(scheduled.status).toBe('received')
    expect(scheduled.scheduledFor).not.toBeNull()
  })

  it('honours the demo open/closed override', async () => {
    const { services } = setup({ openStateOverride: () => 'closed' })
    await expectValidation(services.orders.placeOrder(draft()), 'restaurant-closed')
  })

  it('rejects promo codes that are unknown or not eligible', async () => {
    const { services } = setup()
    await expect(services.orders.placeOrder(draft({ promoCode: 'NOPE' }))).rejects.toMatchObject({
      code: 'not-found',
    })
    await expectValidation(
      services.orders.placeOrder(draft({ lines: [cartLine('sh-soup')], promoCode: 'WELCOME10' })),
      'promo-invalid',
    )
    const order = await services.orders.placeOrder(draft({ promoCode: 'welcome10' }))
    expect(order.promoCode).toBe('WELCOME10')
    expect(order.totals.discount).toBeGreaterThan(0)
  })

  it('advances the order status over time and persists it', async () => {
    const { services, advance, options } = setup()
    const order = await services.orders.placeOrder(draft())

    advance(10)
    expect((await services.orders.getOrder(order.id)).status).toBe('accepted')
    advance(10)
    expect((await services.orders.getOrder(order.id)).status).toBe('preparing')
    advance(60)
    const served = await services.orders.getOrder(order.id)
    expect(served.status).toBe('served')
    expect(served.history.map((event) => event.status)).toEqual([
      'received',
      'accepted',
      'preparing',
      'ready',
      'served',
    ])

    // A new service instance (page refresh) reads the same order back from storage.
    const reloaded = createMockServices(options)
    expect((await reloaded.orders.listOrders('saffron-house')).map((item) => item.id)).toEqual([
      order.id,
    ])

    const withFeedback = await reloaded.orders.submitFeedback(order.id, {
      rating: 5,
      comment: 'Great!',
    })
    expect(withFeedback.feedback).toEqual({ rating: 5, comment: 'Great!' })
  })

  it('only allows cancelling before the kitchen accepts the order', async () => {
    const { services, advance } = setup()
    const first = await services.orders.placeOrder(draft())
    const cancelled = await services.orders.cancelOrder(first.id)
    expect(cancelled.status).toBe('cancelled')
    advance(120)
    expect((await services.orders.getOrder(first.id)).status).toBe('cancelled')

    const second = await services.orders.placeOrder(draft())
    advance(15)
    await expect(services.orders.cancelOrder(second.id)).rejects.toMatchObject({ code: 'conflict' })
  })

  it('surfaces simulated network failures as ApiError("network")', async () => {
    const { services } = setup({ failureRate: () => 1 })
    await expect(services.menus.getMenu('saffron-house')).rejects.toMatchObject({ code: 'network' })
  })

  it('rate-limits repeated service requests from the same table', async () => {
    const { services, advance } = setup()
    const request = await services.serviceRequests.create({
      restaurantId: 'saffron-house',
      tableId: '5',
      type: 'bill',
    })
    expect(request.etaMinutes).toBeGreaterThanOrEqual(2)
    await expect(
      services.serviceRequests.create({
        restaurantId: 'saffron-house',
        tableId: '5',
        type: 'bill',
      }),
    ).rejects.toMatchObject({ code: 'rate-limited' })
    advance(61)
    await expect(
      services.serviceRequests.create({
        restaurantId: 'saffron-house',
        tableId: '5',
        type: 'bill',
      }),
    ).resolves.toMatchObject({ type: 'bill' })
  })
})
