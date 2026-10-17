import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useQrMenu } from '../app/use-qr-menu'
import { createFormatters, createQrMenuI18n, localizeText, LOCALES } from '../i18n'
import { en } from '../i18n/locales/en'
import { flush, renderWithQrMenu } from './render-helpers'

/** Every key of the English source dictionary must exist in every other language. */
function collectKeys(tree: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' && value !== null && !('other' in value)
      ? collectKeys(value as Record<string, unknown>, path)
      : [path]
  })
}

describe('restaurant-qr-menu i18n', () => {
  it('provides a complete Arabic dictionary', async () => {
    const ar = (await import('../i18n/locales/ar')).default as unknown as Record<string, unknown>
    expect(collectKeys(ar).sort()).toEqual(collectKeys(en).sort())
  })

  it('switches language and direction at runtime', async () => {
    const i18n = createQrMenuI18n()
    expect(i18n.dir.value).toBe('ltr')
    expect(i18n.t('cart.title')).toBe('Your order')

    await i18n.setLocale('ar')
    expect(i18n.locale.value).toBe('ar')
    expect(i18n.dir.value).toBe('rtl')
    expect(i18n.t('cart.title')).toBe('طلبك')
  })

  it('selects CLDR plural forms and localizes numbers', async () => {
    const i18n = createQrMenuI18n()
    expect(i18n.t('cart.items', { count: 1 })).toBe('1 item')
    expect(i18n.t('cart.items', { count: 0 })).toBe('No items')
    expect(i18n.t('cart.items', { count: 1200 })).toBe('1,200 items')

    await i18n.setLocale('ar')
    const digits = new Intl.NumberFormat('ar')
    expect(i18n.t('cart.items', { count: 2 })).toBe('صنفان')
    expect(i18n.t('cart.items', { count: 3 })).toBe(`${digits.format(3)} أصناف`)
    expect(i18n.t('cart.items', { count: 11 })).toBe(`${digits.format(11)} صنفاً`)
  })

  it('formats prices with the right minor units for each locale', async () => {
    const i18n = createQrMenuI18n()
    const format = createFormatters(i18n)
    expect(format.price(3500, 'BHD')).toMatch(/3\.500/)
    expect(format.price(1999, 'USD')).toBe('$19.99')

    await i18n.setLocale('ar')
    expect(format.price(1999, 'USD')).toBe(
      new Intl.NumberFormat('ar', { style: 'currency', currency: 'USD' }).format(19.99),
    )
  })

  it('falls back to the restaurant default language for untranslated content', () => {
    expect(localizeText({ en: 'Hummus', ar: 'حمص' }, 'ar')).toBe('حمص')
    expect(localizeText({ en: 'Hummus' }, 'ar')).toBe('Hummus')
    expect(localizeText({ fr: 'Houmous' }, 'ar', 'en')).toBe('Houmous')
    expect(LOCALES.map((locale) => [locale.code, locale.dir])).toEqual([
      ['en', 'ltr'],
      ['ar', 'rtl'],
    ])
  })
})

describe('restaurant-qr-menu document direction', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('applies dir/lang to the document, persists the choice and restores the host page on unmount', async () => {
    document.documentElement.setAttribute('dir', 'ltr')
    document.documentElement.setAttribute('lang', 'en')

    const Probe = defineComponent({
      setup() {
        const { t } = useQrMenu()
        return () => h('p', { 'data-testid': 'probe' }, t('cart.title'))
      },
    })

    const { element, context, storage, unmount } = await renderWithQrMenu(Probe)
    const probe = () => element.querySelector('[data-testid="probe"]')?.textContent
    expect(probe()).toBe('Your order')

    await context.setLocale('ar')
    await flush()

    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    expect(document.documentElement.getAttribute('lang')).toBe('ar')
    expect(probe()).toBe('طلبك')
    expect(storage.get<{ locale: string }>('preferences', { locale: '' }).locale).toBe('ar')

    unmount()
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    expect(document.documentElement.getAttribute('lang')).toBe('en')
  })
})
