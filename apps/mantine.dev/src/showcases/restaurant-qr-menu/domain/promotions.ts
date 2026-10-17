import { percentOf } from './money'
import type { Money, OrderMode, Promotion } from './types'

export type PromotionIneligibleReason = 'expired' | 'min-subtotal' | 'mode' | 'no-code'

export type PromotionEligibility =
  | { eligible: true }
  | { eligible: false; reason: PromotionIneligibleReason; minSubtotal?: Money }

export interface PromotionContext {
  subtotal: Money
  mode: OrderMode
  now?: Date
}

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase()
}

export function checkPromotionEligibility(
  promotion: Promotion,
  { subtotal, mode, now = new Date() }: PromotionContext,
): PromotionEligibility {
  if (promotion.validUntil && new Date(promotion.validUntil).getTime() < now.getTime()) {
    return { eligible: false, reason: 'expired' }
  }

  if (promotion.modes?.length && !promotion.modes.includes(mode)) {
    return { eligible: false, reason: 'mode' }
  }

  if (promotion.kind === 'free-delivery' && mode !== 'delivery') {
    return { eligible: false, reason: 'mode' }
  }

  if (promotion.minSubtotal !== undefined && subtotal < promotion.minSubtotal) {
    return { eligible: false, reason: 'min-subtotal', minSubtotal: promotion.minSubtotal }
  }

  return { eligible: true }
}

/** Discount amount applied to the items subtotal. Free delivery is handled by the totals. */
export function getPromotionDiscount(promotion: Promotion, subtotal: Money): Money {
  if (promotion.kind === 'percentage') {
    const discount = percentOf(subtotal, promotion.value)
    return Math.min(promotion.maxDiscount ?? discount, discount, subtotal)
  }

  if (promotion.kind === 'fixed') {
    return Math.min(promotion.value, subtotal)
  }

  return 0
}
