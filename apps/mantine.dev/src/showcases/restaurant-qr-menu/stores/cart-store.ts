import { computed, reactive } from 'vue'
import type { KeyValueStorage } from '../../shared/persistence'
import { normalizeSelection } from '../domain/modifiers'
import { createCartLineId } from '../domain/pricing'
import type { CartLine, Money, Product, ProductSelection } from '../domain/types'

export type TipChoice = { kind: 'rate'; rate: number } | { kind: 'amount'; amount: Money }

export interface CartState {
  lines: CartLine[]
  notes: string
  promoCode: string | null
  tip: TipChoice
}

export interface AddToCartInput {
  product: Product
  selection: ProductSelection
  quantity: number
  notes?: string
  /** Upper bound per line (restaurant setting). */
  maxQuantity: number
}

export interface AddToCartResult {
  line: CartLine
  /** `true` when the requested quantity was reduced to respect `maxQuantity`. */
  clamped: boolean
}

const STORAGE_KEY = 'carts'

export function createEmptyCart(): CartState {
  return { lines: [], notes: '', promoCode: null, tip: { kind: 'rate', rate: 0 } }
}

const clampQuantity = (value: number, max: number) =>
  Math.max(1, Math.min(max, Math.floor(Number.isFinite(value) ? value : 1)))

/**
 * Carts are scoped per restaurant so switching restaurants never mixes items or
 * currencies. Every mutation is persisted immediately.
 */
export function createCartStore(options: { storage: KeyValueStorage; restaurantId: () => string }) {
  const { storage } = options
  const carts = reactive<Record<string, CartState>>(storage.get(STORAGE_KEY, {}))

  const persist = () => storage.set(STORAGE_KEY, carts)

  const emptyCart = Object.freeze(createEmptyCart()) as CartState

  /** Read-only view of the active cart. */
  const cart = computed<CartState>(() => carts[options.restaurantId()] ?? emptyCart)

  /** Mutable cart for the active restaurant, created on first write. */
  const ensureCart = () => {
    const id = options.restaurantId()
    if (!carts[id]) {
      carts[id] = createEmptyCart()
    }
    return carts[id]
  }

  const lines = computed(() => cart.value.lines)
  const itemCount = computed(() => lines.value.reduce((acc, line) => acc + line.quantity, 0))
  const isEmpty = computed(() => lines.value.length === 0)

  const quantityOf = (productId: string) =>
    lines.value
      .filter((line) => line.productId === productId)
      .reduce((acc, line) => acc + line.quantity, 0)

  const addItem = ({ product, selection, quantity, notes = '', maxQuantity }: AddToCartInput) => {
    const normalized = normalizeSelection(product, selection)
    const trimmedNotes = notes.trim()
    const id = createCartLineId(product, normalized, trimmedNotes)
    const existing = ensureCart().lines.find((line) => line.id === id)
    const requested = (existing?.quantity ?? 0) + quantity
    const next = clampQuantity(requested, maxQuantity)

    let line: CartLine
    if (existing) {
      existing.quantity = next
      line = existing
    } else {
      line = {
        id,
        productId: product.id,
        quantity: next,
        selection: normalized,
        notes: trimmedNotes,
        addedAt: Date.now(),
      }
      ensureCart().lines.push(line)
    }

    persist()
    return { line: { ...line }, clamped: next < requested } satisfies AddToCartResult
  }

  /** Replaces a line's choices (used by "edit item"). Merges into an identical line if one exists. */
  const updateItem = (
    lineId: string,
    { product, selection, quantity, notes = '', maxQuantity }: AddToCartInput,
  ) => {
    const index = ensureCart().lines.findIndex((line) => line.id === lineId)
    if (index === -1) {
      return addItem({ product, selection, quantity, notes, maxQuantity })
    }

    const normalized = normalizeSelection(product, selection)
    const trimmedNotes = notes.trim()
    const id = createCartLineId(product, normalized, trimmedNotes)
    const duplicate = ensureCart().lines.find((line) => line.id === id && line.id !== lineId)

    if (duplicate) {
      const requested = duplicate.quantity + quantity
      duplicate.quantity = clampQuantity(requested, maxQuantity)
      ensureCart().lines.splice(index, 1)
      persist()
      return { line: { ...duplicate }, clamped: duplicate.quantity < requested }
    }

    const line = ensureCart().lines[index]
    const next = clampQuantity(quantity, maxQuantity)
    Object.assign(line, { id, selection: normalized, notes: trimmedNotes, quantity: next })
    persist()
    return { line: { ...line }, clamped: next < quantity }
  }

  const setQuantity = (lineId: string, quantity: number, maxQuantity: number) => {
    const line = ensureCart().lines.find((item) => item.id === lineId)
    if (!line) {
      return
    }
    if (quantity <= 0) {
      removeLine(lineId)
      return
    }
    line.quantity = clampQuantity(quantity, maxQuantity)
    persist()
  }

  /** Removes a line and returns what is needed to undo the removal. */
  const removeLine = (lineId: string) => {
    const index = ensureCart().lines.findIndex((line) => line.id === lineId)
    if (index === -1) {
      return null
    }
    const [removed] = ensureCart().lines.splice(index, 1)
    persist()
    return { line: removed, index }
  }

  const restoreLine = (removed: { line: CartLine; index: number }) => {
    if (ensureCart().lines.some((line) => line.id === removed.line.id)) {
      return
    }
    ensureCart().lines.splice(Math.min(removed.index, ensureCart().lines.length), 0, removed.line)
    persist()
  }

  const clear = () => {
    const id = options.restaurantId()
    carts[id] = { ...createEmptyCart(), tip: ensureCart().tip }
    persist()
  }

  const setNotes = (notes: string) => {
    ensureCart().notes = notes.slice(0, 300)
    persist()
  }

  const setPromoCode = (code: string | null) => {
    ensureCart().promoCode = code
    persist()
  }

  const setTip = (tip: TipChoice) => {
    ensureCart().tip = tip
    persist()
  }

  /** Clears the carts of every restaurant (used by the demo reset). */
  const resetAll = () => {
    Object.keys(carts).forEach((key) => delete carts[key])
    persist()
  }

  return {
    cart,
    lines,
    itemCount,
    isEmpty,
    quantityOf,
    addItem,
    updateItem,
    setQuantity,
    removeLine,
    restoreLine,
    clear,
    setNotes,
    setPromoCode,
    setTip,
    resetAll,
  }
}

export type CartStore = ReturnType<typeof createCartStore>
