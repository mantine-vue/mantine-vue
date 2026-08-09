import { getPath, getPaths } from '../utils/get-path'

/**
 * Packages that expose documented components. Every `*Props` interface declared
 * inside these roots becomes an entry in `docgen.json`.
 */
export const DOCGEN_SOURCE_PATHS = getPaths([
  'packages/@mantine-vue/core/src',
  'packages/@mantine-vue/dates/src',
  'packages/@mantine-vue/charts/src',
  'packages/@mantine-vue/schedule/src',
  'packages/@mantine-vue/carousel/src',
  'packages/@mantine-vue/code-highlight/src',
  'packages/@mantine-vue/contextmenu/src',
  'packages/@mantine-vue/dropzone/src',
  'packages/@mantine-vue/modals/src',
  'packages/@mantine-vue/notifications/src',
  'packages/@mantine-vue/nprogress/src',
  'packages/@mantine-vue/spotlight/src',
  'packages/@mantine-vue/table/src',
  'packages/@mantine-vue/tiptap/src',
])

/**
 * Only props declared within these roots are documented. Props inherited from
 * Vue itself or from third party packages are skipped so tables stay focused on
 * the Mantine API.
 */
export const DOCGEN_INCLUDE_PATHS = [getPath('packages/@mantine-vue')]

/** Margin/padding logical-property aliases – noise in every style props table. */
export const DOCGEN_EXCLUDE_PROPS = ['mie', 'mis', 'pie', 'pis']

/**
 * Internal helper interfaces that end with `Props` but are not components.
 */
export const DOCGEN_EXCLUDE_COMPONENTS = [
  'WithBoxProps',
  'StylesApiProps',
  'ElementProps',
  // Shared style props interface – it is the source of the inherited style
  // props, not a component. It used to appear as a `MantineStyle` entry.
  'MantineStyleProps',
  // Internal helper type of `core/factory`.
  'FactoryBoxProps',
  // Shared dates building blocks that are public types, not components.
  'DatesStyleProps',
  'PickerBaseProps',
  'CalendarBaseProps',
  'DateInputSharedProps',
  'ControlProps',
]

/**
 * Files that re-declare a public props type as a local stub. They score higher
 * than the real declaration (which often lives in a package `index.ts`) and
 * would shadow it, producing a component whose props are only `BoxProps`.
 */
export const DOCGEN_EXCLUDE_FILES = ['packages/@mantine-vue/table/src/mantine.types.ts']

/**
 * Serialized types that are unreadable when printed by the compiler. Keys are
 * matched against the type string after the trailing `| undefined` is removed.
 */
export const DOCGEN_TYPES_REPLACEMENT: Record<string, string> = {
  'MantineSize | (string & {})': 'MantineSize',
  'number | MantineSize | (string & {})': 'MantineSize | number',
  'MantineRadius | (string & {})': 'MantineRadius',
  'MantineColor | (string & {})': 'MantineColor',
  'MantineSpacing | (string & {})': 'MantineSpacing',
  ColorFormat: "'hex' | 'hexa' | 'rgba' | 'rgb' | 'hsl' | 'hsla'",
  ArrowPosition: "'center' | 'side'",
  PopoverWidth: "'target' | CSSProperties['width'] | null",
  AccordionHeadingOrder: '2 | 3 | 4 | 5 | 6',
  AccordionChevronPosition: "'left' | 'right'",
}
