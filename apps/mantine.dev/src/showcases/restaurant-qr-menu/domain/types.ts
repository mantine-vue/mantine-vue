/**
 * Domain models for the Restaurant QR Menu showcase.
 *
 * These interfaces are the contract shared by the UI, the business logic and the
 * data layer. Mock repositories return them today; a real API client only has to
 * map its responses onto the same shapes.
 *
 * Money is always stored in **minor units** (cents, fils, …) as integers to avoid
 * floating point drift. Use `domain/money.ts` to convert and round.
 */

/** BCP-47-ish language code used for content (`en`, `ar`, …). */
export type LocaleCode = string

/** ISO 4217 currency code (`USD`, `BHD`, `EUR`, …). */
export type CurrencyCode = string

/** A text value translated into one or more content locales. */
export type LocalizedText = Readonly<Partial<Record<LocaleCode, string>>>

/** Integer amount in the currency's minor unit. */
export type Money = number

export type OrderMode = 'dine-in' | 'takeaway' | 'delivery'

export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'dairy-free' | 'keto'

export type Allergen =
  | 'gluten'
  | 'dairy'
  | 'eggs'
  | 'nuts'
  | 'peanuts'
  | 'sesame'
  | 'soy'
  | 'fish'
  | 'shellfish'
  | 'mustard'

export type ProductBadge = 'popular' | 'new' | 'spicy' | 'recommended' | 'chef-special' | 'limited'

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'x' | 'whatsapp' | 'website'

export type PaymentMethod = 'cash' | 'card-on-delivery' | 'pay-at-counter' | 'demo-online'

export interface ImageAsset {
  /** Base URL of the image. Width/quality parameters are appended by the image helpers. */
  url: string
  alt?: LocalizedText
}

/* -------------------------------------------------------------------------- */
/*                                 Restaurant                                 */
/* -------------------------------------------------------------------------- */

/** One opening window. `close` earlier than `open` means the window ends after midnight. */
export interface OpeningWindow {
  /** 0 = Sunday … 6 = Saturday (matches `Date#getDay`). */
  day: number
  /** `HH:mm`, 24h, in the restaurant's time zone. */
  open: string
  /** `HH:mm`, 24h, in the restaurant's time zone. */
  close: string
}

export interface RestaurantTable {
  id: string
  label: string
  area: LocalizedText
  seats: number
}

export interface FeeRule {
  id: string
  label: LocalizedText
  kind: 'percentage' | 'fixed'
  /** Percentage as a fraction (`0.05`) or a fixed minor-unit amount. */
  value: number
  modes: OrderMode[]
  /** Whether tax is applied on top of this fee (only used when prices exclude tax). */
  taxable: boolean
}

export interface DeliverySettings {
  fee: Money
  minimumOrder: Money
  /** Orders with a discounted subtotal at or above this amount ship for free. */
  freeDeliveryAbove?: Money
  estimatedMinutes: [number, number]
  areas: LocalizedText[]
}

export interface OrderingSettings {
  modes: OrderMode[]
  defaultMode: OrderMode
  tables: RestaurantTable[]
  /** `true` when menu prices already include tax (common in the EU / GCC). */
  pricesIncludeTax: boolean
  /** Tax rate as a fraction, e.g. `0.1` for 10%. */
  taxRate: number
  taxLabel: LocalizedText
  fees: FeeRule[]
  /** Suggested tip percentages as fractions. Empty array disables tipping. */
  tipOptions: number[]
  delivery?: DeliverySettings
  /** Average preparation time used for estimates. */
  preparationMinutes: number
  paymentMethods: Partial<Record<OrderMode, PaymentMethod[]>>
  /** Allows takeaway / delivery orders to be scheduled for a later time slot. */
  allowScheduling: boolean
  /** Enables call waiter / request bill for dine-in guests. */
  allowServiceRequests: boolean
  maxQuantityPerLine: number
}

export interface Announcement {
  id: string
  tone: 'info' | 'promo' | 'warning'
  title: LocalizedText
  message: LocalizedText
  /** Optional product the announcement links to. */
  productId?: string
}

export interface SocialLink {
  platform: SocialPlatform
  url: string
  handle?: string
}

export interface RestaurantBranding {
  /** Default theme preset id for this restaurant. */
  themePreset: string
  /** Default layout preset id for this restaurant. */
  layoutPreset: string
}

export interface Restaurant {
  id: string
  name: LocalizedText
  tagline: LocalizedText
  description: LocalizedText
  cuisines: LocalizedText[]
  logo: ImageAsset
  cover: ImageAsset
  gallery: ImageAsset[]
  currency: CurrencyCode
  defaultLocale: LocaleCode
  /** IANA time zone used for opening hours and pickup slots. */
  timeZone: string
  priceRange: 1 | 2 | 3 | 4
  rating: { average: number; count: number }
  contact: { phone: string; email: string; whatsapp?: string; website?: string }
  address: { line: LocalizedText; city: LocalizedText; mapUrl: string }
  social: SocialLink[]
  openingHours: OpeningWindow[]
  wifi?: { network: string; password: string }
  announcements: Announcement[]
  ordering: OrderingSettings
  branding: RestaurantBranding
}

/** Lightweight view used by restaurant pickers. */
export interface RestaurantSummary {
  id: string
  name: LocalizedText
  tagline: LocalizedText
  logo: ImageAsset
  currency: CurrencyCode
  cuisines: LocalizedText[]
}

/* -------------------------------------------------------------------------- */
/*                                    Menu                                    */
/* -------------------------------------------------------------------------- */

export interface MenuCategory {
  id: string
  name: LocalizedText
  description?: LocalizedText
  image?: ImageAsset
  /** Optional time window (restaurant local time) when the category can be ordered. */
  availableBetween?: { from: string; to: string }
}

export interface ProductVariant {
  id: string
  name: LocalizedText
  /** Absolute price of the product when this variant is selected. */
  price: Money
  calories?: number
  available?: boolean
}

export interface ModifierOption {
  id: string
  name: LocalizedText
  /** Amount added to the unit price when selected (may be 0). */
  priceDelta: Money
  available?: boolean
  /** Pre-selected when the product sheet opens. */
  selectedByDefault?: boolean
  calories?: number
}

export interface ModifierGroup {
  id: string
  name: LocalizedText
  description?: LocalizedText
  /** `single` renders radios, `multiple` renders checkboxes. */
  selection: 'single' | 'multiple'
  /** Minimum number of options. `0` means optional. */
  min: number
  /** Maximum number of options. */
  max: number
  options: ModifierOption[]
}

export interface Product {
  id: string
  categoryId: string
  name: LocalizedText
  description: LocalizedText
  images: ImageAsset[]
  /** Price when the product has no variants (or the variant-less base). */
  price: Money
  /** Optional strike-through price used for promotions. */
  compareAtPrice?: Money
  variants?: ProductVariant[]
  modifierGroups?: ModifierGroup[]
  badges: ProductBadge[]
  dietary: DietaryTag[]
  allergens: Allergen[]
  /** 0 = not spicy … 3 = very hot. */
  spiceLevel?: 0 | 1 | 2 | 3
  calories?: number
  preparationMinutes?: number
  portion?: LocalizedText
  /** `false` renders the product as sold out. */
  available: boolean
  /** Ids of products suggested as add-ons / pairings. */
  pairsWith?: string[]
  /** Relative popularity used by the "Most popular" sort. */
  popularity: number
  rating?: { average: number; count: number }
  /** ISO date used by the "Newest" sort. */
  addedAt: string
  keywords?: LocalizedText
  featured?: boolean
}

export interface Menu {
  restaurantId: string
  categories: MenuCategory[]
  products: Product[]
  /** ISO timestamp of the last menu change, useful for caching. */
  updatedAt: string
}

/* -------------------------------------------------------------------------- */
/*                                 Promotions                                 */
/* -------------------------------------------------------------------------- */

export interface Promotion {
  id: string
  /** Code typed by the customer. Promotions without a code are display-only offers. */
  code?: string
  title: LocalizedText
  description: LocalizedText
  image?: ImageAsset
  kind: 'percentage' | 'fixed' | 'free-delivery'
  /** Fraction for `percentage`, minor units for `fixed`, ignored for `free-delivery`. */
  value: number
  minSubtotal?: Money
  maxDiscount?: Money
  modes?: OrderMode[]
  validUntil?: string
  /** Product the promotion card links to. */
  productId?: string
}

/* -------------------------------------------------------------------------- */
/*                                    Cart                                    */
/* -------------------------------------------------------------------------- */

/** The customer's choices for a product: a variant plus option ids per modifier group. */
export interface ProductSelection {
  variantId?: string
  modifiers: Record<string, string[]>
}

export interface CartLine {
  /** Stable id derived from product + selection + notes. */
  id: string
  productId: string
  quantity: number
  selection: ProductSelection
  notes: string
  addedAt: number
}

/* -------------------------------------------------------------------------- */
/*                                   Orders                                   */
/* -------------------------------------------------------------------------- */

export type OrderStatus =
  | 'received'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'out-for-delivery'
  | 'delivered'
  | 'picked-up'
  | 'cancelled'

export interface CustomerDetails {
  name: string
  phone: string
  email?: string
}

export interface DeliveryAddress {
  area: string
  street: string
  building: string
  instructions?: string
}

export interface OrderDraft {
  restaurantId: string
  mode: OrderMode
  tableId?: string
  lines: CartLine[]
  customer: CustomerDetails
  deliveryAddress?: DeliveryAddress
  /** ISO timestamp for scheduled orders, `null` for "as soon as possible". */
  scheduledFor: string | null
  notes: string
  promoCode?: string
  /** Tip as a fraction of the subtotal. Ignored when `tipAmount` is set. */
  tipRate: number
  /** Custom tip in minor units. */
  tipAmount?: Money
  paymentMethod: PaymentMethod
  locale: LocaleCode
}

export interface OrderLineSnapshot {
  productId: string
  name: LocalizedText
  image?: ImageAsset
  quantity: number
  unitPrice: Money
  total: Money
  /** Human readable list of selected variant + options. */
  options: LocalizedText[]
  /** Original choices, used by "order again". */
  selection: ProductSelection
  notes: string
}

export interface FeeLine {
  id: string
  label: LocalizedText
  amount: Money
}

export interface OrderTotals {
  currency: CurrencyCode
  itemCount: number
  subtotal: Money
  discount: Money
  fees: FeeLine[]
  deliveryFee: Money
  tax: Money
  /** `true` when the tax amount is already part of the item prices. */
  taxIncluded: boolean
  tip: Money
  total: Money
}

export interface OrderStatusEvent {
  status: OrderStatus
  at: string
}

export interface Order {
  id: string
  /** Short human friendly reference shown to customers. */
  number: string
  restaurantId: string
  mode: OrderMode
  status: OrderStatus
  createdAt: string
  scheduledFor: string | null
  estimatedReadyAt: string
  table?: RestaurantTable
  customer: CustomerDetails
  deliveryAddress?: DeliveryAddress
  lines: OrderLineSnapshot[]
  notes: string
  promoCode?: string
  totals: OrderTotals
  payment: {
    method: PaymentMethod
    /** `simulated` is used for the demo online payment; no money is ever charged. */
    status: 'due' | 'simulated'
    reference: string
  }
  history: OrderStatusEvent[]
  feedback?: { rating: number; comment: string }
}

export type ServiceRequestType = 'waiter' | 'bill' | 'water' | 'cutlery'

export interface ServiceRequest {
  id: string
  type: ServiceRequestType
  tableId: string
  createdAt: string
  etaMinutes: number
}
