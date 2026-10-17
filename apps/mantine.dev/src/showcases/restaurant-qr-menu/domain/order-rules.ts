import type { PricedLine } from './pricing'
import type {
  CustomerDetails,
  DeliveryAddress,
  OrderMode,
  OrderStatus,
  OrderTotals,
  Restaurant,
} from './types'

/** Status progression per ordering mode. The last status is final. */
export const ORDER_FLOWS: Record<OrderMode, OrderStatus[]> = {
  'dine-in': ['received', 'accepted', 'preparing', 'ready', 'served'],
  takeaway: ['received', 'accepted', 'preparing', 'ready', 'picked-up'],
  delivery: ['received', 'accepted', 'preparing', 'out-for-delivery', 'delivered'],
}

export const FINAL_STATUSES: OrderStatus[] = ['served', 'picked-up', 'delivered', 'cancelled']

export function isFinalStatus(status: OrderStatus) {
  return FINAL_STATUSES.includes(status)
}

export function canCancelOrder(status: OrderStatus) {
  return status === 'received'
}

export type CheckoutIssue =
  | { code: 'empty-cart' }
  | { code: 'unavailable-items'; productIds: string[] }
  | { code: 'mode-unavailable' }
  | { code: 'table-required' }
  | { code: 'minimum-order'; minimum: number }
  | { code: 'customer-name' }
  | { code: 'customer-phone' }
  | { code: 'customer-email' }
  | { code: 'address-required' }
  | { code: 'restaurant-closed' }
  | { code: 'payment-method' }

const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidPhone(phone: string) {
  return PHONE_PATTERN.test(phone.trim()) && phone.replace(/\D/g, '').length >= 7
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim())
}

export interface CheckoutRulesInput {
  restaurant: Restaurant
  mode: OrderMode
  lines: PricedLine[]
  totals: OrderTotals
  tableId?: string
  customer: CustomerDetails
  deliveryAddress?: DeliveryAddress
  paymentMethod?: string
  isOpen: boolean
  scheduledFor: string | null
}

/**
 * Business rules for submitting an order. Shared by the checkout form (for instant
 * feedback) and by the order service (as the authoritative server-side check).
 */
export function getCheckoutIssues(input: CheckoutRulesInput): CheckoutIssue[] {
  const { restaurant, mode, lines, totals, customer } = input
  const issues: CheckoutIssue[] = []
  const settings = restaurant.ordering

  if (lines.length === 0) {
    issues.push({ code: 'empty-cart' })
  }

  const unavailable = lines.filter((line) => line.issue).map((line) => line.line.productId)
  if (unavailable.length) {
    issues.push({ code: 'unavailable-items', productIds: unavailable })
  }

  if (!settings.modes.includes(mode)) {
    issues.push({ code: 'mode-unavailable' })
  }

  if (mode === 'dine-in' && !settings.tables.some((table) => table.id === input.tableId)) {
    issues.push({ code: 'table-required' })
  }

  if (
    mode === 'delivery' &&
    settings.delivery &&
    totals.subtotal < settings.delivery.minimumOrder
  ) {
    issues.push({ code: 'minimum-order', minimum: settings.delivery.minimumOrder })
  }

  const contactRequired = mode !== 'dine-in'
  if (contactRequired && customer.name.trim().length < 2) {
    issues.push({ code: 'customer-name' })
  }

  if ((contactRequired || customer.phone.trim()) && !isValidPhone(customer.phone)) {
    issues.push({ code: 'customer-phone' })
  }

  if (customer.email?.trim() && !isValidEmail(customer.email)) {
    issues.push({ code: 'customer-email' })
  }

  if (mode === 'delivery') {
    const address = input.deliveryAddress
    if (!address || !address.area.trim() || !address.street.trim() || !address.building.trim()) {
      issues.push({ code: 'address-required' })
    }
  }

  const canSchedule = settings.allowScheduling && mode !== 'dine-in'
  if (!input.isOpen && !(canSchedule && input.scheduledFor)) {
    issues.push({ code: 'restaurant-closed' })
  }

  const methods = settings.paymentMethods[mode] ?? []
  if (!input.paymentMethod || !methods.includes(input.paymentMethod as never)) {
    issues.push({ code: 'payment-method' })
  }

  return issues
}
