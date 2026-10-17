/**
 * Visual presets. They only describe presentation, no business logic reads them
 * so themes, fonts and layouts can be swapped at runtime without side effects.
 */

export type RadiusKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Density = 'compact' | 'comfortable' | 'spacious'
export type ColorSchemePreference = 'light' | 'dark' | 'auto'

export interface FontPreset {
  id: 'modern' | 'rounded' | 'elegant' | 'system'
  /** Body font stack. Latin family first, Arabic family second, then system fallbacks. */
  body: string[]
  heading: string[]
  headingWeight: string
  /** Google Fonts families to load (`Family:wght@400;700`). Empty for system fonts. */
  googleFonts: string[]
}

export interface ThemePreset {
  id: 'saffron' | 'olive' | 'midnight' | 'berry' | 'ocean' | 'mono'
  brand: string
  accent: string
  radius: RadiusKey
  font: FontPreset['id']
  /** Suggested scheme, applied when the user keeps the "System" color scheme. */
  preferredScheme?: 'light' | 'dark'
}

export type LayoutPresetId = 'classic' | 'modern' | 'elegant' | 'compact'

export interface LayoutPreset {
  id: LayoutPresetId
  /** Product card variant rendered by `ProductCard`. */
  card: 'row' | 'card' | 'feature' | 'dense'
  columns: { base: number; xs?: number; sm: number; md: number; lg: number }
  hero: 'cover' | 'banner' | 'centered' | 'minimal'
  categoryNav: 'pills' | 'underline' | 'text'
  sectionTitle: 'plain' | 'ornament' | 'compact'
  /** Lines of description shown on cards (0 hides it). */
  descriptionLines: number
  /** Image aspect ratio for card images. */
  imageRatio: number
  showFeatured: boolean
  showSectionImages: boolean
  /** Grid gap: a theme spacing key or a number of pixels. */
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
}

const SYSTEM_STACK = [
  'system-ui',
  '-apple-system',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans Arabic',
  'sans-serif',
]

const SERIF_STACK = ['Georgia', 'Times New Roman', 'serif']

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'modern',
    body: ['Inter', 'IBM Plex Sans Arabic', ...SYSTEM_STACK],
    heading: ['Outfit', 'Cairo', ...SYSTEM_STACK],
    headingWeight: '700',
    googleFonts: [
      'Inter:wght@400;500;600;700',
      'Outfit:wght@500;600;700',
      'IBM Plex Sans Arabic:wght@400;500;600;700',
      'Cairo:wght@500;600;700',
    ],
  },
  {
    id: 'rounded',
    body: ['Nunito', 'Tajawal', ...SYSTEM_STACK],
    heading: ['Nunito', 'Tajawal', ...SYSTEM_STACK],
    headingWeight: '800',
    googleFonts: ['Nunito:wght@400;600;700;800', 'Tajawal:wght@400;500;700;800'],
  },
  {
    id: 'elegant',
    body: ['Lato', 'Noto Naskh Arabic', ...SYSTEM_STACK],
    heading: ['Playfair Display', 'Amiri', ...SERIF_STACK],
    headingWeight: '600',
    googleFonts: [
      'Lato:wght@400;700',
      'Playfair Display:wght@500;600;700',
      'Noto Naskh Arabic:wght@400;600;700',
      'Amiri:wght@400;700',
    ],
  },
  {
    id: 'system',
    body: SYSTEM_STACK,
    heading: SYSTEM_STACK,
    headingWeight: '700',
    googleFonts: [],
  },
]

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'saffron', brand: '#d9480f', accent: '#0c8599', radius: 'md', font: 'modern' },
  { id: 'olive', brand: '#5c7f2a', accent: '#c2410c', radius: 'lg', font: 'rounded' },
  {
    id: 'midnight',
    brand: '#c99a2e',
    accent: '#a61e4d',
    radius: 'sm',
    font: 'elegant',
    preferredScheme: 'dark',
  },
  { id: 'berry', brand: '#c2255c', accent: '#7048e8', radius: 'xl', font: 'rounded' },
  { id: 'ocean', brand: '#1971c2', accent: '#0ca678', radius: 'md', font: 'modern' },
  { id: 'mono', brand: '#343a40', accent: '#e03131', radius: 'xs', font: 'system' },
]

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'classic',
    card: 'row',
    columns: { base: 1, sm: 1, md: 2, lg: 2 },
    hero: 'banner',
    categoryNav: 'underline',
    sectionTitle: 'plain',
    descriptionLines: 2,
    imageRatio: 1,
    showFeatured: true,
    showSectionImages: false,
    gap: 'xs',
  },
  {
    id: 'modern',
    card: 'card',
    columns: { base: 2, sm: 3, md: 3, lg: 4 },
    hero: 'cover',
    categoryNav: 'pills',
    sectionTitle: 'plain',
    descriptionLines: 2,
    imageRatio: 4 / 3,
    showFeatured: true,
    showSectionImages: false,
    gap: 'md',
  },
  {
    id: 'elegant',
    card: 'feature',
    columns: { base: 1, sm: 2, md: 2, lg: 3 },
    hero: 'centered',
    categoryNav: 'text',
    sectionTitle: 'ornament',
    descriptionLines: 3,
    imageRatio: 3 / 2,
    showFeatured: true,
    showSectionImages: true,
    gap: 'xl',
  },
  {
    id: 'compact',
    card: 'dense',
    columns: { base: 1, sm: 2, md: 2, lg: 3 },
    hero: 'minimal',
    categoryNav: 'pills',
    sectionTitle: 'compact',
    descriptionLines: 1,
    imageRatio: 1,
    showFeatured: false,
    showSectionImages: false,
    gap: 0,
  },
]

export const RADIUS_KEYS: RadiusKey[] = ['xs', 'sm', 'md', 'lg', 'xl']
export const DENSITIES: Density[] = ['compact', 'comfortable', 'spacious']

export function getThemePreset(id: string | null | undefined) {
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0]
}

export function getFontPreset(id: string | null | undefined) {
  return FONT_PRESETS.find((preset) => preset.id === id) ?? FONT_PRESETS[0]
}

export function getLayoutPreset(id: string | null | undefined) {
  return LAYOUT_PRESETS.find((preset) => preset.id === id) ?? LAYOUT_PRESETS[1]
}
