import { reactive, readonly } from 'vue'
import type { KeyValueStorage } from '../../shared/persistence'
import type { AppearanceSettings } from '../theme/build-theme'
import type { ColorSchemePreference, LayoutPresetId } from '../theme/presets'

export type OpenStateOverride = 'auto' | 'open' | 'closed'

export interface Preferences {
  locale: string
  restaurantId: string
  colorScheme: ColorSchemePreference
  appearance: AppearanceSettings
  /** `null` uses the restaurant's default layout. */
  layoutPreset: LayoutPresetId | null
  demo: {
    openState: OpenStateOverride
    unreliableNetwork: boolean
  }
}

const STORAGE_KEY = 'preferences'

export function createDefaultAppearance(): AppearanceSettings {
  return {
    themePreset: null,
    brandColor: null,
    accentColor: null,
    font: null,
    radius: null,
    density: 'comfortable',
  }
}

export function createDefaultPreferences(
  defaults: Partial<Pick<Preferences, 'locale' | 'restaurantId'>> = {},
): Preferences {
  return {
    locale: defaults.locale ?? 'en',
    restaurantId: defaults.restaurantId ?? 'saffron-house',
    colorScheme: 'auto',
    appearance: createDefaultAppearance(),
    layoutPreset: null,
    demo: { openState: 'auto', unreliableNetwork: false },
  }
}

/** Customer and showcase preferences persisted across visits. */
export function createPreferencesStore(options: {
  storage: KeyValueStorage
  defaults?: Partial<Pick<Preferences, 'locale' | 'restaurantId'>>
}) {
  const defaults = createDefaultPreferences(options.defaults)
  const stored = options.storage.get<Partial<Preferences>>(STORAGE_KEY, {})
  const state = reactive<Preferences>({
    ...defaults,
    ...stored,
    appearance: { ...defaults.appearance, ...stored.appearance },
    demo: { ...defaults.demo, ...stored.demo },
  })

  const persist = () => options.storage.set(STORAGE_KEY, state)

  const update = (mutate: (draft: Preferences) => void) => {
    mutate(state)
    persist()
  }

  return {
    state: readonly(state),
    setLocale: (locale: string) => update((draft) => (draft.locale = locale)),
    setRestaurant: (restaurantId: string) => update((draft) => (draft.restaurantId = restaurantId)),
    setColorScheme: (scheme: ColorSchemePreference) =>
      update((draft) => (draft.colorScheme = scheme)),
    setLayout: (layout: LayoutPresetId | null) => update((draft) => (draft.layoutPreset = layout)),
    updateAppearance: (patch: Partial<AppearanceSettings>) =>
      update((draft) => Object.assign(draft.appearance, patch)),
    /** Selecting a theme preset resets the per-color overrides so the preset shows as designed. */
    setThemePreset: (themePreset: string | null) =>
      update((draft) =>
        Object.assign(draft.appearance, {
          themePreset,
          brandColor: null,
          accentColor: null,
          font: null,
          radius: null,
        }),
      ),
    setDemo: (patch: Partial<Preferences['demo']>) =>
      update((draft) => Object.assign(draft.demo, patch)),
    resetAppearance: () =>
      update((draft) => {
        draft.appearance = createDefaultAppearance()
        draft.layoutPreset = null
        draft.colorScheme = 'auto'
      }),
  }
}

export type PreferencesStore = ReturnType<typeof createPreferencesStore>
