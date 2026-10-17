import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useQrMenu } from '../app/use-qr-menu'
import { canQuickAdd } from '../domain/modifiers'
import { getStartingPrice } from '../domain/pricing'
import type { Product } from '../domain/types'
import { useCartActions } from './use-cart-actions'
import { useProductSheet } from './use-product-sheet'

export interface ProductCardModel {
  product: Product
  name: string
  description: string
  priceLabel: string
  compareAtLabel: string | null
  soldOut: boolean
  favorite: boolean
  inCart: number
  quickAddable: boolean
}

export interface ProductCardActions {
  open: () => void
  add: () => void
  toggleFavorite: () => void
}

/**
 * View model + actions for product cards. All card variants share this, so a
 * layout preset can never diverge in behaviour from another one.
 */
export function useProductCard(source: MaybeRefOrGetter<Product>) {
  const ctx = useQrMenu()
  const sheet = useProductSheet()
  const actions = useCartActions()

  const model = computed<ProductCardModel>(() => {
    const product = toValue(source)
    const startingPrice = ctx.price(getStartingPrice(product))
    return {
      product,
      name: ctx.localize(product.name),
      description: ctx.localize(product.description),
      priceLabel: product.variants?.length
        ? ctx.t('product.from', { price: startingPrice })
        : startingPrice,
      compareAtLabel: product.compareAtPrice ? ctx.price(product.compareAtPrice) : null,
      soldOut: !product.available,
      favorite: ctx.customer.isFavorite(ctx.restaurantId.value, product.id),
      inCart: ctx.cart.quantityOf(product.id),
      quickAddable: canQuickAdd(product),
    }
  })

  const handlers: ProductCardActions = {
    open: () => sheet.open(toValue(source).id),
    add: () => actions.quickAdd(toValue(source)),
    toggleFavorite: () => actions.toggleFavorite(toValue(source)),
  }

  return { model, actions: handlers }
}
