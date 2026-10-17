import { useQrMenu } from '../app/use-qr-menu'
import type { PromoApplyResult } from '../app/create-qr-menu-context'

/** Maps promo validation failures to localized, actionable messages. */
export function usePromoMessages() {
  const { t, price, mode } = useQrMenu()

  return {
    error(result: Exclude<PromoApplyResult, { ok: true }>) {
      switch (result.reason) {
        case 'min-subtotal':
          return t('promo.errors.min-subtotal', { amount: price(result.minSubtotal ?? 0) })
        case 'mode':
          return t('promo.errors.mode', { mode: t(`modes.${mode.value}`) })
        case 'expired':
          return t('promo.errors.expired')
        case 'no-code':
          return t('promo.errors.no-code')
        case 'not-found':
          return t('promo.errors.not-found')
        default:
          return t('errors.network')
      }
    },
  }
}
