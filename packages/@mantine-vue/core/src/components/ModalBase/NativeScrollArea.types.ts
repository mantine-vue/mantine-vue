import type { VNodeChild } from 'vue'
export type NativeScrollAreaProps = Record<never, never>
export interface NativeScrollAreaSlots {
  /** Content rendered without a custom scrollbar. */ default?: () => VNodeChild
}
