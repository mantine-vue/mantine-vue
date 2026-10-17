import type { KeyValueStorage } from '../../../shared/persistence'
import { getOpenState } from '../../domain/availability'
import { ORDER_FLOWS, getCheckoutIssues } from '../../domain/order-rules'
import { calculateTotals, priceCartLines } from '../../domain/pricing'
import { checkPromotionEligibility, normalizePromoCode } from '../../domain/promotions'
import type {
  LocalizedText,
  Menu,
  Order,
  OrderDraft,
  OrderStatusEvent,
  Product,
  Promotion,
  Restaurant,
  ServiceRequest,
} from '../../domain/types'
import { ApiError, type QrMenuServices } from '../contracts'
import { DEFAULT_MOCK_DATASET, type MockDataset } from './data'
import { createMockNetwork, type MockNetworkOptions } from './mock-network'

export interface MockServicesOptions extends MockNetworkOptions {
  /** Where placed orders are persisted (orders survive page refreshes). */
  storage: KeyValueStorage
  dataset?: MockDataset
  now?: () => Date
  /** Demo override for the restaurant open state (`null` = use opening hours). */
  openStateOverride?: () => 'open' | 'closed' | null
  /** Seconds between simulated kitchen status updates. */
  statusStepSeconds?: number
}

interface StoredOrder extends Omit<Order, 'status' | 'history'> {
  cancelledAt?: string
}

const ORDERS_KEY = 'orders'
const MAX_STORED_ORDERS = 30

function initials(name: LocalizedText) {
  return (name.en ?? Object.values(name)[0] ?? 'QR')
    .split(/\s+/)
    .filter((word) => /^[a-z]/i.test(word))
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * In-memory implementation of every service contract, backed by the mock dataset.
 * It reproduces the behaviour of a real backend: latency, failures, validation,
 * re-pricing on the "server", persisted orders and time-based status updates.
 */
export function createMockServices(options: MockServicesOptions): QrMenuServices {
  const {
    storage,
    dataset = DEFAULT_MOCK_DATASET,
    now = () => new Date(),
    openStateOverride = () => null,
    statusStepSeconds = 25,
  } = options
  const random = options.random ?? Math.random
  const request = createMockNetwork(options)
  const serviceRequestLog = new Map<string, number>()

  const findRestaurant = (restaurantId: string): Restaurant => {
    const restaurant = dataset.restaurants.find((item) => item.id === restaurantId)
    if (!restaurant) {
      throw new ApiError('not-found', `Restaurant "${restaurantId}" was not found`)
    }
    return restaurant
  }

  const findMenu = (restaurantId: string): Menu => {
    const menu = dataset.menus[restaurantId]
    if (!menu) {
      throw new ApiError('not-found', `Menu for "${restaurantId}" was not found`)
    }
    return menu
  }

  const findPromotion = (restaurantId: string, code: string) => {
    const normalized = normalizePromoCode(code)
    const promotion = (dataset.promotions[restaurantId] ?? []).find(
      (item) => item.code && normalizePromoCode(item.code) === normalized,
    )
    if (!promotion) {
      throw new ApiError('not-found', `Promo code "${normalized}" is not valid`)
    }
    return promotion
  }

  const isRestaurantOpen = (restaurant: Restaurant) => {
    const override = openStateOverride()
    if (override) {
      return override === 'open'
    }
    return getOpenState(restaurant.openingHours, now(), restaurant.timeZone).open
  }

  const readOrders = () => storage.get<StoredOrder[]>(ORDERS_KEY, [])
  const writeOrders = (orders: StoredOrder[]) =>
    storage.set(ORDERS_KEY, orders.slice(0, MAX_STORED_ORDERS))

  /** Derives the current status from the elapsed time so tracking survives reloads. */
  const hydrateOrder = (stored: StoredOrder): Order => {
    const { cancelledAt, ...order } = stored
    const flow = ORDER_FLOWS[order.mode]
    const created = new Date(order.createdAt).getTime()
    const step = statusStepSeconds * 1000
    // Scheduled orders wait in "accepted" so the final status lands on the scheduled time.
    const scheduledStart = order.scheduledFor
      ? new Date(order.scheduledFor).getTime() - (flow.length - 2) * step
      : created

    const timeline: OrderStatusEvent[] = flow.map((status, index) => {
      if (index === 0) {
        return { status, at: order.createdAt }
      }
      const base = index === 1 ? created : Math.max(created + step, scheduledStart)
      const offset = index === 1 ? step : (index - 1) * step
      return { status, at: new Date(base + offset).toISOString() }
    })

    const current = now().getTime()
    let history = timeline.filter((event) => new Date(event.at).getTime() <= current)

    if (cancelledAt) {
      history = [
        ...history.filter(
          (event) => new Date(event.at).getTime() <= new Date(cancelledAt).getTime(),
        ),
        { status: 'cancelled', at: cancelledAt },
      ]
    }

    return { ...order, history, status: history[history.length - 1].status }
  }

  const getStoredOrder = (orderId: string) => {
    const stored = readOrders().find((order) => order.id === orderId)
    if (!stored) {
      throw new ApiError('not-found', `Order "${orderId}" was not found`)
    }
    return stored
  }

  const updateStoredOrder = (orderId: string, update: (order: StoredOrder) => StoredOrder) => {
    const orders = readOrders().map((order) => (order.id === orderId ? update(order) : order))
    writeOrders(orders)
    return getStoredOrder(orderId)
  }

  const describeSelection = (product: Product, draftLine: OrderDraft['lines'][number]) => {
    const parts: LocalizedText[] = []
    const variant = product.variants?.find((item) => item.id === draftLine.selection.variantId)
    if (variant) {
      parts.push(variant.name)
    }
    for (const group of product.modifierGroups ?? []) {
      for (const optionId of draftLine.selection.modifiers[group.id] ?? []) {
        const option = group.options.find((item) => item.id === optionId)
        if (option) {
          parts.push(option.name)
        }
      }
    }
    return parts
  }

  const placeOrder = (draft: OrderDraft): Order => {
    const restaurant = findRestaurant(draft.restaurantId)
    const menu = findMenu(draft.restaurantId)
    const products = new Map(menu.products.map((product) => [product.id, product]))
    const lines = priceCartLines(draft.lines, products)

    let promotion: Promotion | null = null
    if (draft.promoCode) {
      promotion = findPromotion(draft.restaurantId, draft.promoCode)
    }

    const totals = calculateTotals({
      lines,
      settings: restaurant.ordering,
      currency: restaurant.currency,
      mode: draft.mode,
      promotion,
      tipRate: draft.tipRate,
      tipAmount: draft.tipAmount,
      now: now(),
    })

    if (promotion) {
      const eligibility = checkPromotionEligibility(promotion, {
        subtotal: totals.subtotal,
        mode: draft.mode,
        now: now(),
      })
      if (!eligibility.eligible) {
        throw new ApiError('validation', 'Promo code cannot be applied', {
          issues: [{ code: 'promo-invalid', reason: eligibility.reason }],
        })
      }
    }

    if (draft.scheduledFor && new Date(draft.scheduledFor).getTime() < now().getTime()) {
      throw new ApiError('validation', 'Scheduled time is in the past', {
        issues: [{ code: 'schedule-in-past' }],
      })
    }

    const issues = getCheckoutIssues({
      restaurant,
      mode: draft.mode,
      lines,
      totals,
      tableId: draft.tableId,
      customer: draft.customer,
      deliveryAddress: draft.deliveryAddress,
      paymentMethod: draft.paymentMethod,
      isOpen: isRestaurantOpen(restaurant),
      scheduledFor: draft.scheduledFor,
    })

    if (issues.length > 0) {
      throw new ApiError('validation', 'Order validation failed', { issues })
    }

    const createdAt = now()
    const settings = restaurant.ordering
    const deliveryMinutes =
      draft.mode === 'delivery' ? (settings.delivery?.estimatedMinutes[0] ?? 0) : 0
    const readyBase = draft.scheduledFor ? new Date(draft.scheduledFor) : createdAt
    const estimatedReadyAt = new Date(
      readyBase.getTime() +
        (draft.scheduledFor ? 0 : (settings.preparationMinutes + deliveryMinutes) * 60_000),
    )

    const id = `ord_${createdAt.getTime().toString(36)}${Math.floor(random() * 1e6).toString(36)}`
    const stored: StoredOrder = {
      id,
      number: `${initials(restaurant.name)}-${String(Math.floor(1000 + random() * 9000))}`,
      restaurantId: restaurant.id,
      mode: draft.mode,
      createdAt: createdAt.toISOString(),
      scheduledFor: draft.scheduledFor,
      estimatedReadyAt: estimatedReadyAt.toISOString(),
      table:
        draft.mode === 'dine-in'
          ? settings.tables.find((table) => table.id === draft.tableId)
          : undefined,
      customer: {
        name: draft.customer.name.trim(),
        phone: draft.customer.phone.trim(),
        email: draft.customer.email?.trim() || undefined,
      },
      deliveryAddress: draft.mode === 'delivery' ? draft.deliveryAddress : undefined,
      lines: lines.map((line) => ({
        productId: line.line.productId,
        name: line.product!.name,
        image: line.product!.images[0],
        quantity: line.line.quantity,
        unitPrice: line.unitPrice,
        total: line.total,
        options: describeSelection(line.product!, line.line),
        selection: line.line.selection,
        notes: line.line.notes,
      })),
      notes: draft.notes.trim(),
      promoCode: promotion?.code,
      totals,
      payment: {
        method: draft.paymentMethod,
        status: draft.paymentMethod === 'demo-online' ? 'simulated' : 'due',
        reference: `DEMO-${Math.floor(random() * 1e8)
          .toString(36)
          .toUpperCase()}`,
      },
    }

    writeOrders([stored, ...readOrders()])
    return hydrateOrder(stored)
  }

  return {
    restaurants: {
      list: () =>
        request(() =>
          dataset.restaurants.map(({ id, name, tagline, logo, currency, cuisines }) => ({
            id,
            name,
            tagline,
            logo,
            currency,
            cuisines,
          })),
        ),
      getById: (restaurantId) => request(() => findRestaurant(restaurantId)),
    },
    menus: {
      getMenu: (restaurantId) => request(() => findMenu(restaurantId)),
    },
    promotions: {
      listActive: (restaurantId) =>
        request(() =>
          (dataset.promotions[restaurantId] ?? []).filter(
            (promotion) =>
              !promotion.validUntil || new Date(promotion.validUntil).getTime() > now().getTime(),
          ),
        ),
      findByCode: (restaurantId, code) => request(() => findPromotion(restaurantId, code)),
    },
    orders: {
      placeOrder: (draft) => request(() => placeOrder(draft)),
      getOrder: (orderId) => request(() => hydrateOrder(getStoredOrder(orderId))),
      listOrders: (restaurantId) =>
        request(() =>
          readOrders()
            .filter((order) => order.restaurantId === restaurantId)
            .map(hydrateOrder),
        ),
      cancelOrder: (orderId) =>
        request(() => {
          const order = hydrateOrder(getStoredOrder(orderId))
          if (order.status !== 'received') {
            throw new ApiError('conflict', 'The kitchen has already accepted this order')
          }
          return hydrateOrder(
            updateStoredOrder(orderId, (stored) => ({
              ...stored,
              cancelledAt: now().toISOString(),
            })),
          )
        }),
      submitFeedback: (orderId, feedback) =>
        request(() => {
          if (!Number.isInteger(feedback.rating) || feedback.rating < 1 || feedback.rating > 5) {
            throw new ApiError('validation', 'Rating must be between 1 and 5')
          }
          return hydrateOrder(
            updateStoredOrder(orderId, (stored) => ({
              ...stored,
              feedback: { rating: feedback.rating, comment: feedback.comment.trim().slice(0, 500) },
            })),
          )
        }),
    },
    serviceRequests: {
      create: (input) =>
        request((): ServiceRequest => {
          const restaurant = findRestaurant(input.restaurantId)
          if (!restaurant.ordering.allowServiceRequests) {
            throw new ApiError('validation', 'Service requests are not available')
          }
          if (!restaurant.ordering.tables.some((table) => table.id === input.tableId)) {
            throw new ApiError('validation', 'Unknown table')
          }

          const key = `${input.restaurantId}:${input.tableId}:${input.type}`
          const last = serviceRequestLog.get(key)
          const current = now().getTime()
          if (last && current - last < 60_000) {
            throw new ApiError('rate-limited', 'A request was already sent', {
              retryInSeconds: Math.ceil((60_000 - (current - last)) / 1000),
            })
          }
          serviceRequestLog.set(key, current)

          return {
            id: `req_${current.toString(36)}`,
            type: input.type,
            tableId: input.tableId,
            createdAt: new Date(current).toISOString(),
            etaMinutes: 2 + Math.floor(random() * 3),
          }
        }),
    },
  }
}
