import { inject, readonly, ref, type InjectionKey, type Ref } from 'vue'
import type { ContextMenuContextValue, ContextMenuSettings } from './types'

export interface ResolvedContextMenuSettings {
  shadow: NonNullable<ContextMenuSettings['shadow']>
  borderRadius: NonNullable<ContextMenuSettings['borderRadius']>
  submenuDelay: number
  repositionOnRepeat: boolean
}

export const ContextMenuSettingsKey = Symbol('ContextMenuSettings') as InjectionKey<
  Ref<ResolvedContextMenuSettings>
>

export const ContextMenuKey = Symbol('ContextMenu') as InjectionKey<ContextMenuContextValue>

const hidden = readonly(ref(false))
const fallback: ContextMenuContextValue = {
  showContextMenu: () => () => undefined,
  hideContextMenu: () => undefined,
  isContextMenuVisible: hidden,
}

export function useContextMenu() {
  return inject(ContextMenuKey, fallback)
}

export function useContextMenuSettings() {
  return inject(ContextMenuSettingsKey, {
    value: {
      shadow: 'sm',
      borderRadius: 'xs',
      submenuDelay: 500,
      repositionOnRepeat: false,
    },
  } as Ref<ResolvedContextMenuSettings>)
}
