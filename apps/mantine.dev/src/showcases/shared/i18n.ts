import { computed, ref, shallowReactive, type ComputedRef, type Ref } from 'vue'

/**
 * Minimal, dependency-free i18n engine shared by showcases.
 *
 * - Typed message keys (dot paths into the source-language dictionary)
 * - `{param}` interpolation and CLDR plural forms via `Intl.PluralRules`
 * - Lazily loaded locale dictionaries with a statically bundled fallback
 * - Text direction and `Intl` locale per language
 */

export type TextDirection = 'ltr' | 'rtl'

export interface LocaleDefinition {
  /** Content / message language code (`en`, `ar`). */
  code: string
  /** Name in the source language, used for accessibility labels. */
  label: string
  /** Name in its own language, shown in language pickers. */
  nativeLabel: string
  dir: TextDirection
  /** Locale passed to `Intl` formatters, may include extensions (`ar-u-nu-arab`). */
  intl: string
}

const PLURAL_KEYS = ['zero', 'one', 'two', 'few', 'many', 'other'] as const
export type PluralCategory = (typeof PLURAL_KEYS)[number]
export type PluralForms = Partial<Record<PluralCategory, string>> & { other: string }

export interface MessageTree {
  [key: string]: string | PluralForms | MessageTree
}

/** Declares a plural message. Use `{count}` in the forms. */
export function plural(forms: PluralForms): PluralForms {
  return forms
}

/** Dot-separated paths to every message in a dictionary. */
export type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string | PluralForms
    ? K
    : T[K] extends MessageTree
      ? `${K}.${MessageKey<T[K]>}`
      : never
}[keyof T & string]

/** Same shape as the source dictionary, with every leaf widened to string / plural forms. */
export type DictionaryShape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends PluralForms
      ? PluralForms
      : DictionaryShape<T[K]>
}

export type TranslateParams = Record<string, string | number>

type DictionaryLoader<T> = () => Promise<T | { default: T }>

export interface CreateI18nOptions<T extends MessageTree> {
  locales: LocaleDefinition[]
  /** Source dictionary, always available synchronously and used as fallback. */
  source: { code: string; messages: T }
  /** Lazy loaders for the other languages. */
  loaders: Record<string, DictionaryLoader<DictionaryShape<T>>>
  initialLocale?: string
}

export interface I18n<T extends MessageTree> {
  locale: Readonly<Ref<string>>
  definition: ComputedRef<LocaleDefinition>
  dir: ComputedRef<TextDirection>
  locales: LocaleDefinition[]
  /** `true` while a dictionary is being downloaded. */
  loading: Readonly<Ref<boolean>>
  setLocale: (code: string) => Promise<void>
  t: (key: MessageKey<T>, params?: TranslateParams) => string
  /** Returns `true` when the key exists in the active (or fallback) dictionary. */
  has: (key: string) => boolean
}

function isPluralForms(value: unknown): value is PluralForms {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as PluralForms).other === 'string' &&
    Object.keys(value).every((key) => (PLURAL_KEYS as readonly string[]).includes(key))
  )
}

function lookup(tree: unknown, key: string): string | PluralForms | undefined {
  let node: unknown = tree
  for (const segment of key.split('.')) {
    if (typeof node !== 'object' || node === null) {
      return undefined
    }
    node = (node as Record<string, unknown>)[segment]
  }
  return typeof node === 'string' || isPluralForms(node) ? node : undefined
}

/** Replaces `{name}` placeholders. Numbers are formatted with `formatNumber` (locale digits). */
export function interpolate(
  template: string,
  params: TranslateParams = {},
  formatNumber: (value: number) => string = String,
) {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    if (value === undefined) {
      return match
    }
    return typeof value === 'number' ? formatNumber(value) : value
  })
}

export function createI18n<T extends MessageTree>(options: CreateI18nOptions<T>): I18n<T> {
  const { locales, source, loaders } = options
  const findLocale = (code: string) => locales.find((item) => item.code === code)

  const dictionaries = shallowReactive(new Map<string, unknown>([[source.code, source.messages]]))
  const locale = ref(source.code)
  const loading = ref(false)
  const pluralRules = new Map<string, Intl.PluralRules>()

  const definition = computed(() => findLocale(locale.value) ?? locales[0])
  const dir = computed(() => definition.value.dir)

  const setLocale = async (code: string) => {
    if (!findLocale(code)) {
      return
    }

    if (!dictionaries.has(code)) {
      const loader = loaders[code]
      if (!loader) {
        return
      }
      loading.value = true
      try {
        const loaded = await loader()
        dictionaries.set(
          code,
          'default' in (loaded as object) ? (loaded as { default: T }).default : loaded,
        )
      } finally {
        loading.value = false
      }
    }

    locale.value = code
  }

  const getPluralRule = (intl: string) => {
    let rules = pluralRules.get(intl)
    if (!rules) {
      rules = new Intl.PluralRules(intl)
      pluralRules.set(intl, rules)
    }
    return rules
  }

  const resolve = (key: string) =>
    lookup(dictionaries.get(locale.value), key) ?? lookup(source.messages, key)

  const numberFormats = new Map<string, Intl.NumberFormat>()
  const formatNumber = (value: number) => {
    const intl = definition.value.intl
    let format = numberFormats.get(intl)
    if (!format) {
      format = new Intl.NumberFormat(intl)
      numberFormats.set(intl, format)
    }
    return format.format(value)
  }

  const t = (key: MessageKey<T>, params?: TranslateParams) => {
    const message = resolve(key)
    if (message === undefined) {
      return key
    }

    if (typeof message === 'string') {
      return interpolate(message, params, formatNumber)
    }

    const count = Number(params?.count ?? 0)
    const category = getPluralRule(definition.value.intl).select(count) as PluralCategory
    const form = (count === 0 ? message.zero : undefined) ?? message[category] ?? message.other
    return interpolate(form, params, formatNumber)
  }

  if (options.initialLocale && options.initialLocale !== source.code) {
    void setLocale(options.initialLocale)
  }

  return {
    locale,
    definition,
    dir,
    locales,
    loading,
    setLocale,
    t,
    has: (key) => resolve(key) !== undefined,
  }
}
