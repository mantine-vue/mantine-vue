/**
 * Repository / service contracts used by the showcase.
 *
 * UI components and stores only depend on these interfaces. The mock
 * implementations in `./mock` satisfy them today; an HTTP implementation can be
 * dropped in later by implementing the same interfaces.
 */
import type {
  Menu,
  Order,
  OrderDraft,
  Promotion,
  Restaurant,
  RestaurantSummary,
  ServiceRequest,
  ServiceRequestType,
} from '../domain/types'

export type ApiErrorCode =
  | 'network'
  | 'not-found'
  | 'validation'
  | 'conflict'
  | 'rate-limited'
  | 'unknown'

/** Error type thrown by every service. `details` carries machine-readable context. */
export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly details?: unknown

  constructor(code: ApiErrorCode, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export interface RestaurantRepository {
  list: () => Promise<RestaurantSummary[]>
  getById: (restaurantId: string) => Promise<Restaurant>
}

export interface MenuRepository {
  getMenu: (restaurantId: string) => Promise<Menu>
}

export interface PromotionRepository {
  /** Promotions displayed on the menu (banners / offers carousel). */
  listActive: (restaurantId: string) => Promise<Promotion[]>
  /** Looks up a promo code. Throws `ApiError('not-found')` for unknown codes. */
  findByCode: (restaurantId: string, code: string) => Promise<Promotion>
}

export interface OrderService {
  /** Validates, prices and stores an order. Throws `ApiError('validation')` with issues. */
  placeOrder: (draft: OrderDraft) => Promise<Order>
  getOrder: (orderId: string) => Promise<Order>
  /** Orders placed from this device for a restaurant, newest first. */
  listOrders: (restaurantId: string) => Promise<Order[]>
  cancelOrder: (orderId: string) => Promise<Order>
  submitFeedback: (orderId: string, feedback: { rating: number; comment: string }) => Promise<Order>
}

export interface ServiceRequestService {
  /** Dine-in service request (call waiter, ask for the bill, …). */
  create: (input: {
    restaurantId: string
    tableId: string
    type: ServiceRequestType
    note?: string
  }) => Promise<ServiceRequest>
}

/** Everything the showcase needs from a backend. */
export interface QrMenuServices {
  restaurants: RestaurantRepository
  menus: MenuRepository
  promotions: PromotionRepository
  orders: OrderService
  serviceRequests: ServiceRequestService
}
