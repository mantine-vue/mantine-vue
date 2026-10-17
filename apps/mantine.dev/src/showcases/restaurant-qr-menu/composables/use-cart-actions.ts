import { h } from 'vue'
import { Anchor } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { useQrMenu } from '../app/use-qr-menu'
import { canQuickAdd, createDefaultSelection, validateSelection } from '../domain/modifiers'
import type { Product, ProductSelection } from '../domain/types'
import { useProductSheet } from './use-product-sheet'

export interface AddToCartOptions {
  product: Product
  selection: ProductSelection
  quantity: number
  notes?: string
  /** When set, the existing cart line is replaced instead of a new one being added. */
  lineId?: string | null
}

/**
 * Cart interactions shared by every layout and card variant, so changing the
 * presentation never changes ordering behaviour.
 */
export function useCartActions() {
  const ctx = useQrMenu()
  const sheet = useProductSheet()
  const { t, cart, localize } = ctx

  const maxQuantity = () => ctx.settings.value?.maxQuantityPerLine ?? 20

  const notify = (title: string, message: string, id?: string) =>
    notifications.show({
      id,
      title,
      color: 'brand',
      autoClose: 2500,
      message: h('span', [
        message,
        ' · ',
        h(
          Anchor,
          {
            component: 'button',
            type: 'button',
            size: 'sm',
            fw: 600,
            onClick: () => {
              ctx.overlays.cart = true
              if (id) {
                notifications.hide(id)
              }
            },
          },
          () => t('notifications.viewCart'),
        ),
      ]),
    })

  const addToCart = ({ product, selection, quantity, notes = '', lineId }: AddToCartOptions) => {
    const validation = validateSelection(product, selection)
    if (!validation.valid || !product.available) {
      return { ok: false as const, validation }
    }

    const input = { product, selection, quantity, notes, maxQuantity: maxQuantity() }
    const result = lineId ? cart.updateItem(lineId, input) : cart.addItem(input)

    if (result.clamped) {
      notifications.show({
        color: 'yellow',
        message: t('errors.maxQuantity', { max: maxQuantity() }),
      })
    }

    notify(
      lineId ? t('notifications.updated') : t('notifications.added'),
      t('notifications.addedMessage', {
        quantity: ctx.format.number(quantity),
        name: localize(product.name),
      }),
      `cart-${product.id}`,
    )

    return { ok: true as const, line: result.line }
  }

  /** Adds products without required choices instantly, otherwise opens the product sheet. */
  const quickAdd = (product: Product) => {
    if (!canQuickAdd(product)) {
      sheet.open(product.id)
      return
    }
    addToCart({ product, selection: createDefaultSelection(product), quantity: 1 })
  }

  const removeLine = (lineId: string) => {
    const removed = cart.removeLine(lineId)
    if (!removed) {
      return
    }
    const product = ctx.data.productsById.value.get(removed.line.productId)
    const id = `removed-${lineId}`
    notifications.show({
      id,
      autoClose: 5000,
      message: h('span', [
        t('notifications.removed', { name: product ? localize(product.name) : '' }),
        ' · ',
        h(
          Anchor,
          {
            component: 'button',
            type: 'button',
            size: 'sm',
            fw: 600,
            onClick: () => {
              cart.restoreLine(removed)
              notifications.hide(id)
            },
          },
          () => t('app.undo'),
        ),
      ]),
    })
  }

  const setQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeLine(lineId)
      return
    }
    cart.setQuantity(lineId, quantity, maxQuantity())
  }

  const toggleFavorite = (product: Product) => {
    const added = ctx.customer.toggleFavorite(ctx.restaurantId.value, product.id)
    notifications.show({
      autoClose: 1800,
      color: added ? 'red' : 'gray',
      message: `${localize(product.name)} · ${added ? t('favorites.added') : t('favorites.removed')}`,
    })
    return added
  }

  return { addToCart, quickAdd, removeLine, setQuantity, toggleFavorite, maxQuantity }
}
