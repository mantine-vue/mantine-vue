import { afterEach, describe, expect, it } from 'vitest'
import ProductCard from '../components/menu/cards/ProductCard.vue'
import { buildMantineTheme, getGoogleFontsUrl, resolveAppearance } from '../theme/build-theme'
import { FONT_PRESETS, LAYOUT_PRESETS, THEME_PRESETS } from '../theme/presets'
import { createDefaultAppearance } from '../stores/preferences-store'
import { productFixture } from './fixtures'
import { flush, renderWithQrMenu } from './render-helpers'

describe('restaurant-qr-menu themes', () => {
  it.each(THEME_PRESETS.map((preset) => preset.id))(
    'builds a complete Mantine theme for "%s"',
    (id) => {
      const appearance = resolveAppearance({ ...createDefaultAppearance(), themePreset: id })
      const theme = buildMantineTheme(appearance)
      expect(theme.primaryColor).toBe('brand')
      expect(theme.colors?.brand).toHaveLength(10)
      expect(theme.colors?.accent).toHaveLength(10)
      expect(theme.defaultRadius).toBe(appearance.preset.radius)
      expect(theme.fontFamily).toContain(
        appearance.font.body[0].includes(' ')
          ? `'${appearance.font.body[0]}'`
          : appearance.font.body[0],
      )
    },
  )

  it('applies custom colors, fonts, radius and density on top of a preset', () => {
    const appearance = resolveAppearance({
      themePreset: 'ocean',
      brandColor: '#123456',
      accentColor: 'not-a-color',
      font: 'elegant',
      radius: 'xl',
      density: 'compact',
    })
    expect(appearance.brand).toBe('#123456')
    expect(appearance.accent).toBe(THEME_PRESETS.find((preset) => preset.id === 'ocean')!.accent)
    const compact = buildMantineTheme(appearance)
    const spacious = buildMantineTheme({ ...appearance, density: 'spacious' })
    expect(compact.defaultRadius).toBe('xl')
    expect(compact.headings?.fontFamily).toContain("'Playfair Display'")
    expect(compact.spacing?.md).toContain('0.7500rem')
    expect(spacious.spacing?.md).toContain('1.3000rem')
  })

  it('uses the restaurant branding preset when the guest has not chosen one', () => {
    expect(resolveAppearance(createDefaultAppearance(), 'midnight').preset.id).toBe('midnight')
    expect(
      resolveAppearance({ ...createDefaultAppearance(), themePreset: 'berry' }, 'midnight').preset
        .id,
    ).toBe('berry')
  })

  it('loads web fonts only for non-system presets', () => {
    for (const font of FONT_PRESETS) {
      const url = getGoogleFontsUrl(font)
      expect(url === null).toBe(font.id === 'system')
    }
  })
})

describe('restaurant-qr-menu layout presets', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders every layout with the same ordering behaviour', async () => {
    const soup = productFixture('sh-soup')
    const { element, context, unmount } = await renderWithQrMenu(ProductCard, { product: soup })
    for (const [index, layout] of LAYOUT_PRESETS.entries()) {
      context.preferences.setLayout(layout.id)
      // Theme, density and language changes must not affect ordering either.
      context.preferences.setThemePreset(THEME_PRESETS[index % THEME_PRESETS.length].id)
      context.preferences.updateAppearance({ density: index % 2 ? 'compact' : 'spacious' })
      await context.setLocale(index % 2 ? 'ar' : 'en')
      await flush()

      expect(context.layout.value.id).toBe(layout.id)
      expect(element.querySelector('article')).not.toBeNull()

      const label = context.t('product.quickAdd', { name: context.localize(soup.name) })
      const addButton = [...element.querySelectorAll('button')].find(
        (button) => button.getAttribute('aria-label') === label,
      )
      expect(addButton).toBeDefined()
      addButton!.click()
      await flush()

      expect(context.cart.itemCount.value).toBe(index + 1)
    }

    // All layouts produced the very same cart line.
    expect(context.cart.lines.value).toHaveLength(1)
    expect(context.cart.lines.value[0].productId).toBe(soup.id)
    expect(context.totals.value?.subtotal).toBe(soup.price * LAYOUT_PRESETS.length)
    unmount()
  })

  it('shows sold-out products as unavailable in every layout', async () => {
    const brownie = productFixture('sh-brownie')
    const { element, context, unmount } = await renderWithQrMenu(ProductCard, { product: brownie })
    for (const layout of LAYOUT_PRESETS) {
      context.preferences.setLayout(layout.id)
      await flush()
      expect(element.querySelector('article')?.getAttribute('data-sold-out')).toBe('true')
      const disabled = [...element.querySelectorAll('button')].filter((button) => button.disabled)
      expect(disabled.length).toBeGreaterThan(0)
    }
    unmount()
  })
})
