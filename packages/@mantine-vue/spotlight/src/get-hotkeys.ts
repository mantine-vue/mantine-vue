import type { HotkeyItem } from '@mantine-vue/hooks'
import type { SpotlightStore } from './spotlight.store'
import { spotlightActions } from './spotlight.store'

export function getHotkeys(
  hotkeys: string | string[] | null | undefined,
  store: SpotlightStore,
): HotkeyItem[] {
  if (!hotkeys) {
    return []
  }

  const open = () => spotlightActions.open(store)

  if (Array.isArray(hotkeys)) {
    return hotkeys.map((hotkey) => [hotkey, open])
  }

  return [[hotkeys, open]]
}
