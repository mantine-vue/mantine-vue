import { computed, reactive, ref, shallowRef, watch, type InjectionKey } from 'vue'
import { createBrowserStorage, type KeyValueStorage } from '../../shared/persistence'
import { QR_MENU_CONFIG } from '../config'
import { getOpenState, type OpenState } from '../domain/availability'
import { calculateTotals, priceCartLines } from '../domain/pricing'
import {
  checkPromotionEligibility,
  normalizePromoCode,
  type PromotionEligibility,
} from '../domain/promotions'
import type { LocalizedText, Money, OrderMode, Promotion } from '../domain/types'
import { createFormatters, createQrMenuI18n, localizeText } from '../i18n'
import { ApiError, type QrMenuServices } from '../services/contracts'
import { createMockServices } from '../services/mock/create-mock-services'
import { createCartStore } from '../stores/cart-store'
import { createCustomerStore } from '../stores/customer-store'
import { createMenuFilterStore } from '../stores/menu-filter-store'
import { createPreferencesStore } from '../stores/preferences-store'
import { createRestaurantDataStore } from '../stores/restaurant-data-store'
import { buildMantineTheme, resolveAppearance } from '../theme/build-theme'
import { getLayoutPreset } from '../theme/presets'

export interface CreateQrMenuContextOptions {
  storage?: KeyValueStorage
  /** Inject real API services here. Defaults to the mock implementation. */
  services?: QrMenuServices
  now?: () => Date
  defaults?: { locale?: string; restaurantId?: string }
}

export type PromoApplyResult =
  | { ok: true; promotion: Promotion }
  | {
      ok: false
      reason: 'not-found' | 'network' | Exclude<PromotionEligibility, { eligible: true }>['reason']
      minSubtotal?: Money
    }

/** UI overlay state shared by the shell and the views. */
export interface QrMenuOverlays {
  cart: boolean
  info: boolean
  settings: boolean
  favorites: boolean
  orders: boolean
  service: boolean
  filters: boolean
}

/**
 * Composition root of the showcase. Creates services, stores, i18n and derived
 * business state. Presentation components receive everything through
 * `useQrMenu()` and never talk to the mock layer directly.
 */
export function createQrMenuContext(options: CreateQrMenuContextOptions = {}) {
  const storage = options.storage ?? createBrowserStorage(QR_MENU_CONFIG.storageNamespace)
  const now = options.now ?? (() => new Date())

  const preferences = createPreferencesStore({
    storage,
    defaults: {
      locale: options.defaults?.locale ?? QR_MENU_CONFIG.defaultLocale,
      restaurantId: options.defaults?.restaurantId ?? QR_MENU_CONFIG.defaultRestaurantId,
    },
  })

  const services =
    options.services ??
    createMockServices({
      storage,
      now,
      latency: QR_MENU_CONFIG.mockLatency,
      failureRate: () => (preferences.state.demo.unreliableNetwork ? 0.3 : 0),
      openStateOverride: () =>
        preferences.state.demo.openState === 'auto' ? null : preferences.state.demo.openState,
    })

  const i18n = createQrMenuI18n()
  const format = createFormatters(i18n)
  const t = i18n.t

  const restaurantId = computed(() => preferences.state.restaurantId)
  const data = createRestaurantDataStore({ services, storage })
  const cart = createCartStore({ storage, restaurantId: () => restaurantId.value })
  const customer = createCustomerStore({ storage })
  const menuFilters = createMenuFilterStore({
    products: () => data.products.value,
    categories: () => data.categories.value,
    categoriesById: () => data.categoriesById.value,
  })

  /* ------------------------------ Localization ------------------------------ */

  const setLocale = async (code: string) => {
    await i18n.setLocale(code)
    preferences.setLocale(i18n.locale.value)
  }

  const localize = (text: LocalizedText | undefined) =>
    localizeText(text, i18n.locale.value, data.restaurant.value?.defaultLocale)

  const currency = computed(() => data.restaurant.value?.currency ?? 'USD')
  const price = (amount: Money) => format.price(amount, currency.value)

  /* ------------------------------- Restaurant ------------------------------- */

  const clock = ref(now())
  const tick = () => {
    clock.value = now()
  }

  const openState = computed<OpenState>(() => {
    const restaurant = data.restaurant.value
    const override = preferences.state.demo.openState
    if (override === 'open') {
      return { open: true, closesAt: '23:59', closesInMinutes: Infinity, closingSoon: false }
    }
    if (!restaurant || override === 'closed') {
      return { open: false, opensAt: null, opensDay: null, opensInMinutes: null }
    }
    return getOpenState(restaurant.openingHours, clock.value, restaurant.timeZone)
  })

  const settings = computed(() => data.restaurant.value?.ordering)

  const session = computed(() => customer.getSession(restaurantId.value))
  const mode = computed<OrderMode>(() => {
    const available = settings.value?.modes ?? ['dine-in']
    const selected = session.value.mode
    return selected && available.includes(selected)
      ? selected
      : (settings.value?.defaultMode ?? available[0])
  })
  const table = computed(
    () => settings.value?.tables.find((item) => item.id === session.value.tableId) ?? null,
  )

  const setMode = (next: OrderMode) => customer.setMode(restaurantId.value, next)
  const setTable = (tableId: string | null) => customer.setTable(restaurantId.value, tableId)

  /* ---------------------------------- Cart ---------------------------------- */

  const pricedLines = computed(() => priceCartLines(cart.lines.value, data.productsById.value))
  const promotion = shallowRef<Promotion | null>(null)

  const subtotal = computed(() =>
    pricedLines.value.filter((line) => !line.issue).reduce((acc, line) => acc + line.total, 0),
  )

  const promotionEligibility = computed<PromotionEligibility | null>(() =>
    promotion.value
      ? checkPromotionEligibility(promotion.value, {
          subtotal: subtotal.value,
          mode: mode.value,
          now: clock.value,
        })
      : null,
  )

  const totals = computed(() => {
    const ordering = settings.value
    if (!ordering) {
      return null
    }
    const tip = cart.cart.value.tip
    return calculateTotals({
      lines: pricedLines.value,
      settings: ordering,
      currency: currency.value,
      mode: mode.value,
      promotion: promotion.value,
      tipRate: tip.kind === 'rate' ? tip.rate : 0,
      tipAmount: tip.kind === 'amount' ? tip.amount : undefined,
      now: clock.value,
    })
  })

  const applyPromoCode = async (code: string): Promise<PromoApplyResult> => {
    const normalized = normalizePromoCode(code)
    if (!normalized) {
      return { ok: false, reason: 'no-code' }
    }
    try {
      const found = await services.promotions.findByCode(restaurantId.value, normalized)
      const eligibility = checkPromotionEligibility(found, {
        subtotal: subtotal.value,
        mode: mode.value,
        now: clock.value,
      })
      if (!eligibility.eligible) {
        return { ok: false, reason: eligibility.reason, minSubtotal: eligibility.minSubtotal }
      }
      promotion.value = found
      cart.setPromoCode(found.code ?? normalized)
      return { ok: true, promotion: found }
    } catch (error) {
      if (error instanceof ApiError && error.code === 'not-found') {
        return { ok: false, reason: 'not-found' }
      }
      return { ok: false, reason: 'network' }
    }
  }

  const removePromoCode = () => {
    promotion.value = null
    cart.setPromoCode(null)
  }

  // Restore a persisted promo code after reload / restaurant switch.
  watch(
    () => [restaurantId.value, cart.cart.value.promoCode] as const,
    async ([id, code]) => {
      if (!code) {
        promotion.value = null
        return
      }
      if (promotion.value?.code === code) {
        return
      }
      try {
        const found = await services.promotions.findByCode(id, code)
        if (restaurantId.value === id) {
          promotion.value = found
        }
      } catch {
        promotion.value = null
      }
    },
    { immediate: true },
  )

  /* ------------------------------- Appearance ------------------------------- */

  const appearance = computed(() =>
    resolveAppearance(preferences.state.appearance, data.restaurant.value?.branding.themePreset),
  )
  const theme = computed(() => buildMantineTheme(appearance.value))
  const layout = computed(() =>
    getLayoutPreset(preferences.state.layoutPreset ?? data.restaurant.value?.branding.layoutPreset),
  )

  /* -------------------------------- Overlays -------------------------------- */

  const overlays = reactive<QrMenuOverlays>({
    cart: false,
    info: false,
    settings: false,
    favorites: false,
    orders: false,
    service: false,
    filters: false,
  })

  const resetDemoData = () => {
    cart.resetAll()
    customer.reset()
    removePromoCode()
    storage.remove('orders')
  }

  return {
    storage,
    services,
    preferences,
    i18n,
    t,
    format,
    localize,
    price,
    currency,
    setLocale,
    restaurantId,
    data,
    cart,
    customer,
    menuFilters,
    clock,
    tick,
    openState,
    settings,
    mode,
    table,
    setMode,
    setTable,
    pricedLines,
    subtotal,
    promotion,
    promotionEligibility,
    totals,
    applyPromoCode,
    removePromoCode,
    appearance,
    theme,
    layout,
    overlays,
    resetDemoData,
  }
}

export type QrMenuContext = ReturnType<typeof createQrMenuContext>

export const QrMenuContextKey: InjectionKey<QrMenuContext> = Symbol('QrMenuContext')
