import { percentOf, roundMoney, sumMoney } from './money'
import { normalizeSelection, validateSelection } from './modifiers'
import { checkPromotionEligibility, getPromotionDiscount } from './promotions'
import type {
  CartLine,
  CurrencyCode,
  FeeLine,
  Money,
  OrderMode,
  OrderTotals,
  OrderingSettings,
  Product,
  ProductSelection,
  Promotion,
} from './types'

/** Unit price for a product with the given variant and modifier options. */
export function getUnitPrice(product: Product, selection: ProductSelection): Money {
  const variant = product.variants?.find((item) => item.id === selection.variantId)
  let price = variant?.price ?? product.price

  for (const group of product.modifierGroups ?? []) {
    for (const optionId of selection.modifiers[group.id] ?? []) {
      price += group.options.find((option) => option.id === optionId)?.priceDelta ?? 0
    }
  }

  return price
}

/** Lowest price a customer can pay for the product, used for "from" labels. */
export function getStartingPrice(product: Product): Money {
  if (!product.variants?.length) {
    return product.price
  }

  return Math.min(...product.variants.map((variant) => variant.price))
}

/** Stable id for a cart line: same product + same choices + same notes merge together. */
export function createCartLineId(product: Product, selection: ProductSelection, notes: string) {
  const normalized = normalizeSelection(product, selection)
  const modifiers = Object.keys(normalized.modifiers)
    .sort()
    .map((groupId) => `${groupId}:${normalized.modifiers[groupId].join(',')}`)
    .join('|')

  return [product.id, normalized.variantId ?? '', modifiers, notes.trim().toLowerCase()].join('#')
}

export type PricedLineIssue = 'missing' | 'sold-out' | 'invalid-selection'

export interface PricedLine {
  line: CartLine
  product?: Product
  unitPrice: Money
  total: Money
  issue?: PricedLineIssue
}

/** Prices cart lines against the current menu and flags lines that can no longer be ordered. */
export function priceCartLines(lines: CartLine[], products: Map<string, Product>): PricedLine[] {
  return lines.map((line) => {
    const product = products.get(line.productId)

    if (!product) {
      return { line, unitPrice: 0, total: 0, issue: 'missing' }
    }

    const unitPrice = getUnitPrice(product, line.selection)
    const total = unitPrice * line.quantity

    if (!product.available) {
      return { line, product, unitPrice, total, issue: 'sold-out' }
    }

    if (!validateSelection(product, line.selection).valid) {
      return { line, product, unitPrice, total, issue: 'invalid-selection' }
    }

    return { line, product, unitPrice, total }
  })
}

export interface TotalsInput {
  lines: PricedLine[]
  settings: OrderingSettings
  currency: CurrencyCode
  mode: OrderMode
  promotion?: Promotion | null
  /** Tip as a fraction of the subtotal. */
  tipRate?: number
  /** Custom tip amount in minor units; overrides `tipRate`. */
  tipAmount?: Money
  now?: Date
}

/**
 * Computes the full order breakdown.
 *
 * Order of operations: items subtotal → promotion discount → mode-specific fees
 * (calculated on the discounted subtotal) → delivery fee → tax → tip.
 * When `pricesIncludeTax` is set the tax is extracted from the amounts instead of
 * being added on top.
 */
export function calculateTotals({
  lines,
  settings,
  currency,
  mode,
  promotion,
  tipRate = 0,
  tipAmount,
  now,
}: TotalsInput): OrderTotals {
  const orderable = lines.filter((line) => !line.issue)
  const subtotal = sumMoney(orderable.map((line) => line.total))
  const itemCount = orderable.reduce((acc, line) => acc + line.line.quantity, 0)

  const eligible =
    promotion && checkPromotionEligibility(promotion, { subtotal, mode, now }).eligible
  const discount = eligible && promotion ? getPromotionDiscount(promotion, subtotal) : 0
  const discountedSubtotal = subtotal - discount

  const fees: FeeLine[] = settings.fees
    .filter((fee) => fee.modes.includes(mode))
    .map((fee) => ({
      id: fee.id,
      label: fee.label,
      amount:
        subtotal === 0
          ? 0
          : fee.kind === 'percentage'
            ? percentOf(discountedSubtotal, fee.value)
            : roundMoney(fee.value),
    }))
    .filter((fee) => fee.amount > 0)

  const delivery = settings.delivery
  const freeDelivery =
    (eligible && promotion?.kind === 'free-delivery') ||
    (delivery?.freeDeliveryAbove !== undefined && discountedSubtotal >= delivery.freeDeliveryAbove)
  const deliveryFee =
    mode === 'delivery' && delivery && subtotal > 0 && !freeDelivery ? delivery.fee : 0

  const taxableFees = sumMoney(
    fees
      .filter((fee) => settings.fees.find((rule) => rule.id === fee.id)?.taxable)
      .map((fee) => fee.amount),
  )
  const taxableBase = discountedSubtotal + taxableFees + deliveryFee
  const tax = settings.pricesIncludeTax
    ? roundMoney(taxableBase - taxableBase / (1 + settings.taxRate))
    : percentOf(taxableBase, settings.taxRate)

  const tip =
    settings.tipOptions.length === 0 || subtotal === 0
      ? 0
      : tipAmount !== undefined
        ? Math.max(0, roundMoney(tipAmount))
        : percentOf(subtotal, tipRate)

  const total =
    discountedSubtotal +
    sumMoney(fees.map((fee) => fee.amount)) +
    deliveryFee +
    (settings.pricesIncludeTax ? 0 : tax) +
    tip

  return {
    currency,
    itemCount,
    subtotal,
    discount,
    fees,
    deliveryFee,
    tax,
    taxIncluded: settings.pricesIncludeTax,
    tip,
    total,
  }
}
