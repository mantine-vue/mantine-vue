import { inject, provide } from 'vue'
import { QrMenuContextKey, type QrMenuContext } from './create-qr-menu-context'

export function provideQrMenu(context: QrMenuContext) {
  provide(QrMenuContextKey, context)
}

/** Access the showcase context from any component below `QrMenuProvider`. */
export function useQrMenu(): QrMenuContext {
  const context = inject(QrMenuContextKey, null)
  if (!context) {
    throw new Error('[restaurant-qr-menu] useQrMenu() must be used inside QrMenuProvider')
  }
  return context
}
