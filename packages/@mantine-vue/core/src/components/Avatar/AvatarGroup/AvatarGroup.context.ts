import { inject, type InjectionKey } from 'vue'
import type { AvatarGroupContextValue } from './AvatarGroup.types'
export const AvatarGroupContextKey: InjectionKey<AvatarGroupContextValue> =
  Symbol('AvatarGroupContext')
export function useAvatarGroupContext() {
  return inject(AvatarGroupContextKey, { withinGroup: false })
}
