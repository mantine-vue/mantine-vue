export interface MdxNavItem {
  label: string
  link: string
}

export interface MdxNavGroup {
  title: string | null
  pages: MdxNavItem[]
}

export interface MdxNavCategory {
  category: string
  groups: MdxNavGroup[]
}

const LAYOUT_PAGES: MdxNavItem[] = [
  { label: 'AppShell', link: '/core/app-shell' },
  { label: 'AspectRatio', link: '/core/aspect-ratio' },
  { label: 'Center', link: '/core/center' },
  { label: 'Container', link: '/core/container' },
  { label: 'Flex', link: '/core/flex' },
  { label: 'Grid', link: '/core/grid' },
  { label: 'Group', link: '/core/group' },
  { label: 'SimpleGrid', link: '/core/simple-grid' },
  { label: 'Space', link: '/core/space' },
  { label: 'Splitter', link: '/core/splitter' },
  { label: 'Stack', link: '/core/stack' },
]

const INPUTS_PAGES: MdxNavItem[] = [
  { label: 'AlphaSlider', link: '/core/alpha-slider' },
  { label: 'AngleSlider', link: '/core/angle-slider' },
  { label: 'Checkbox', link: '/core/checkbox' },
  { label: 'Chip', link: '/core/chip' },
  { label: 'ColorInput', link: '/core/color-input' },
  { label: 'ColorPicker', link: '/core/color-picker' },
  { label: 'Fieldset', link: '/core/fieldset' },
  { label: 'FileInput', link: '/core/file-input' },
  { label: 'HueSlider', link: '/core/hue-slider' },
  { label: 'Input', link: '/core/input' },
  { label: 'JsonInput', link: '/core/json-input' },
  { label: 'MaskInput', link: '/core/mask-input' },
  { label: 'NativeSelect', link: '/core/native-select' },
  { label: 'NumberInput', link: '/core/number-input' },
  { label: 'PasswordInput', link: '/core/password-input' },
  { label: 'PinInput', link: '/core/pin-input' },
  { label: 'Radio', link: '/core/radio' },
  { label: 'RangeSlider', link: '/core/range-slider' },
  { label: 'Rating', link: '/core/rating' },
  { label: 'SegmentedControl', link: '/core/segmented-control' },
  { label: 'Slider', link: '/core/slider' },
  { label: 'Switch', link: '/core/switch' },
  { label: 'Textarea', link: '/core/textarea' },
  { label: 'TextInput', link: '/core/text-input' },
]

const COMBOBOX_PAGES: MdxNavItem[] = [
  { label: 'Autocomplete', link: '/core/autocomplete' },
  { label: 'Combobox', link: '/core/combobox' },
  { label: 'MultiSelect', link: '/core/multi-select' },
  { label: 'Pill', link: '/core/pill' },
  { label: 'PillsInput', link: '/core/pills-input' },
  { label: 'Select', link: '/core/select' },
  { label: 'TagsInput', link: '/core/tags-input' },
  { label: 'TreeSelect', link: '/core/tree-select' },
]

const BUTTONS_PAGES: MdxNavItem[] = [
  { label: 'ActionIcon', link: '/core/action-icon' },
  { label: 'Button', link: '/core/button' },
  { label: 'CloseButton', link: '/core/close-button' },
  { label: 'CopyButton', link: '/core/copy-button' },
  { label: 'FileButton', link: '/core/file-button' },
  { label: 'UnstyledButton', link: '/core/unstyled-button' },
]

const NAVIGATION_PAGES: MdxNavItem[] = [
  { label: 'Anchor', link: '/core/anchor' },
  { label: 'Breadcrumbs', link: '/core/breadcrumbs' },
  { label: 'Burger', link: '/core/burger' },
  { label: 'NavLink', link: '/core/nav-link' },
  { label: 'Pagination', link: '/core/pagination' },
  { label: 'Stepper', link: '/core/stepper' },
  { label: 'TableOfContents', link: '/core/table-of-contents' },
  { label: 'Tabs', link: '/core/tabs' },
  { label: 'Tree', link: '/core/tree' },
]

const FEEDBACK_PAGES: MdxNavItem[] = [
  { label: 'Alert', link: '/core/alert' },
  { label: 'Loader', link: '/core/loader' },
  { label: 'Notification', link: '/core/notification' },
  { label: 'Progress', link: '/core/progress' },
  { label: 'RingProgress', link: '/core/ring-progress' },
  { label: 'SemiCircleProgress', link: '/core/semi-circle-progress' },
  { label: 'Skeleton', link: '/core/skeleton' },
]

const OVERLAYS_PAGES: MdxNavItem[] = [
  { label: 'Affix', link: '/core/affix' },
  { label: 'Dialog', link: '/core/dialog' },
  { label: 'Drawer', link: '/core/drawer' },
  { label: 'FloatingIndicator', link: '/core/floating-indicator' },
  { label: 'FloatingWindow', link: '/core/floating-window' },
  { label: 'HoverCard', link: '/core/hover-card' },
  { label: 'LoadingOverlay', link: '/core/loading-overlay' },
  { label: 'Menu', link: '/core/menu' },
  { label: 'Modal', link: '/core/modal' },
  { label: 'Overlay', link: '/core/overlay' },
  { label: 'Popover', link: '/core/popover' },
  { label: 'Tooltip', link: '/core/tooltip' },
]

const DATA_DISPLAY_PAGES: MdxNavItem[] = [
  { label: 'Accordion', link: '/core/accordion' },
  { label: 'Avatar', link: '/core/avatar' },
  { label: 'BackgroundImage', link: '/core/background-image' },
  { label: 'Badge', link: '/core/badge' },
  { label: 'Card', link: '/core/card' },
  { label: 'ColorSwatch', link: '/core/color-swatch' },
  { label: 'Image', link: '/core/image' },
  { label: 'Indicator', link: '/core/indicator' },
  { label: 'Kbd', link: '/core/kbd' },
  { label: 'NumberFormatter', link: '/core/number-formatter' },
  { label: 'OverflowList', link: '/core/overflow-list' },
  { label: 'RollingNumber', link: '/core/rolling-number' },
  { label: 'Spoiler', link: '/core/spoiler' },
  { label: 'ThemeIcon', link: '/core/theme-icon' },
  { label: 'Timeline', link: '/core/timeline' },
]

const TYPOGRAPHY_PAGES: MdxNavItem[] = [
  { label: 'Blockquote', link: '/core/blockquote' },
  { label: 'Code', link: '/core/code' },
  { label: 'Highlight', link: '/core/highlight' },
  { label: 'List', link: '/core/list' },
  { label: 'Mark', link: '/core/mark' },
  { label: 'Table', link: '/core/table' },
  { label: 'Text', link: '/core/text' },
  { label: 'Title', link: '/core/title' },
]

const MISCELLANEOUS_PAGES: MdxNavItem[] = [
  { label: 'Box', link: '/core/box' },
  { label: 'Collapse', link: '/core/collapse' },
  { label: 'Divider', link: '/core/divider' },
  { label: 'FocusTrap', link: '/core/focus-trap' },
  { label: 'Marquee', link: '/core/marquee' },
  { label: 'Paper', link: '/core/paper' },
  { label: 'Portal', link: '/core/portal' },
  { label: 'ScrollArea', link: '/core/scroll-area' },
  { label: 'Scroller', link: '/core/scroller' },
  { label: 'Transition', link: '/core/transition' },
  { label: 'VisuallyHidden', link: '/core/visually-hidden' },
]

const DATES_PAGES: MdxNavItem[] = [
  { label: 'Getting started', link: '/dates/getting-started' },
  { label: 'DatePicker', link: '/dates/date-picker' },
  { label: 'DatePickerInput', link: '/dates/date-picker-input' },
  { label: 'DateTimePicker', link: '/dates/date-time-picker' },
  { label: 'InlineDateTimePicker', link: '/dates/inline-date-time-picker' },
  { label: 'DateInput', link: '/dates/date-input' },
  { label: 'MonthPicker', link: '/dates/month-picker' },
  { label: 'MonthPickerInput', link: '/dates/month-picker-input' },
  { label: 'YearPicker', link: '/dates/year-picker' },
  { label: 'YearPickerInput', link: '/dates/year-picker-input' },
  { label: 'TimeInput', link: '/dates/time-input' },
  { label: 'TimePicker', link: '/dates/time-picker' },
  { label: 'TimeGrid', link: '/dates/time-grid' },
  { label: 'TimeValue', link: '/dates/time-value' },
  { label: 'MiniCalendar', link: '/dates/mini-calendar' },
  { label: 'Calendar', link: '/dates/calendar' },
]

const FORM_PAGES: MdxNavItem[] = [
  { label: 'Getting started', link: '/form/package' },
  { label: 'use-form', link: '/form/use-form' },
  { label: 'Values', link: '/form/values' },
  { label: 'getInputProps', link: '/form/get-input-props' },
  { label: 'Validation', link: '/form/validation' },
  { label: 'Errors', link: '/form/errors' },
  { label: 'Touched and dirty', link: '/form/status' },
  { label: 'Validators', link: '/form/validators' },
  { label: 'Schema validation', link: '/form/schema-validation' },
  { label: 'use-field', link: '/form/use-field' },
  { label: 'createFormContext', link: '/form/create-form-context' },
]

const OTHER_EXTENSIONS_PAGES: MdxNavItem[] = [
  { label: 'CodeHighlight', link: '/x/code-highlight' },
  { label: 'Notifications system', link: '/x/notifications' },
  { label: 'Spotlight', link: '/x/spotlight' },
  { label: 'Carousel', link: '/x/carousel' },
  { label: 'Dropzone', link: '/x/dropzone' },
  { label: 'NavigationProgress', link: '/x/nprogress' },
  { label: 'Modals manager', link: '/x/modals' },
  { label: 'Rich text editor', link: '/x/tiptap' },
]

const HOOKS_UI_AND_DOM_PAGES: MdxNavItem[] = [
  { label: 'use-click-outside', link: '/hooks/use-click-outside' },
  { label: 'use-collapse', link: '/hooks/use-collapse' },
  { label: 'use-color-scheme', link: '/hooks/use-color-scheme' },
  { label: 'use-element-size', link: '/hooks/use-element-size' },
  { label: 'use-event-listener', link: '/hooks/use-event-listener' },
  { label: 'use-focus-return', link: '/hooks/use-focus-return' },
  { label: 'use-focus-trap', link: '/hooks/use-focus-trap' },
  { label: 'use-focus-within', link: '/hooks/use-focus-within' },
  { label: 'use-fullscreen', link: '/hooks/use-fullscreen' },
  { label: 'use-hotkeys', link: '/hooks/use-hotkeys' },
  { label: 'use-hover', link: '/hooks/use-hover' },
  { label: 'use-intersection', link: '/hooks/use-intersection' },
  { label: 'use-media-query', link: '/hooks/use-media-query' },
  { label: 'use-mouse', link: '/hooks/use-mouse' },
  { label: 'use-move', link: '/hooks/use-move' },
  { label: 'use-radial-move', link: '/hooks/use-radial-move' },
  { label: 'use-floating-window', link: '/hooks/use-floating-window' },
  { label: 'use-scroller', link: '/hooks/use-scroller' },
  { label: 'use-reduced-motion', link: '/hooks/use-reduced-motion' },
  { label: 'use-resize-observer', link: '/hooks/use-resize-observer' },
  { label: 'use-mutation-observer', link: '/hooks/use-mutation-observer' },
  { label: 'use-scroll-into-view', link: '/hooks/use-scroll-into-view' },
  { label: 'use-scroll-spy', link: '/hooks/use-scroll-spy' },
  { label: 'use-viewport-size', link: '/hooks/use-viewport-size' },
  { label: 'use-window-event', link: '/hooks/use-window-event' },
  { label: 'use-window-scroll', link: '/hooks/use-window-scroll' },
  { label: 'use-in-viewport', link: '/hooks/use-in-viewport' },
  { label: 'use-orientation', link: '/hooks/use-orientation' },
  { label: 'use-file-dialog', link: '/hooks/use-file-dialog' },
  { label: 'use-long-press', link: '/hooks/use-long-press' },
  { label: 'use-drag', link: '/hooks/use-drag' },
  { label: 'use-splitter', link: '/hooks/use-splitter' },
  { label: 'use-mask', link: '/hooks/use-mask' },
  { label: 'use-roving-index', link: '/hooks/use-roving-index' },
  { label: 'use-horizontal-collapse', link: '/hooks/use-horizontal-collapse' },
]

const HOOKS_STATE_MANAGEMENT_PAGES: MdxNavItem[] = [
  { label: 'use-counter', link: '/hooks/use-counter' },
  { label: 'use-debounced-state', link: '/hooks/use-debounced-state' },
  { label: 'use-debounced-value', link: '/hooks/use-debounced-value' },
  { label: 'use-debounced-callback', link: '/hooks/use-debounced-callback' },
  { label: 'use-throttled-state', link: '/hooks/use-throttled-state' },
  { label: 'use-throttled-value', link: '/hooks/use-throttled-value' },
  { label: 'use-throttled-callback', link: '/hooks/use-throttled-callback' },
  { label: 'use-disclosure', link: '/hooks/use-disclosure' },
  { label: 'use-id', link: '/hooks/use-id' },
  { label: 'use-input-state', link: '/hooks/use-input-state' },
  { label: 'use-list-state', link: '/hooks/use-list-state' },
  { label: 'use-local-storage', link: '/hooks/use-local-storage' },
  { label: 'use-session-storage', link: '/hooks/use-session-storage' },
  { label: 'use-previous', link: '/hooks/use-previous' },
  { label: 'use-queue', link: '/hooks/use-queue' },
  { label: 'use-set-state', link: '/hooks/use-set-state' },
  { label: 'use-toggle', link: '/hooks/use-toggle' },
  { label: 'use-uncontrolled', link: '/hooks/use-uncontrolled' },
  { label: 'use-validated-state', link: '/hooks/use-validated-state' },
  { label: 'use-pagination', link: '/hooks/use-pagination' },
  { label: 'use-state-history', link: '/hooks/use-state-history' },
  { label: 'use-map', link: '/hooks/use-map' },
  { label: 'use-set', link: '/hooks/use-set' },
  { label: 'use-selection', link: '/hooks/use-selection' },
]

const HOOKS_UTILITIES_PAGES: MdxNavItem[] = [
  { label: 'use-clipboard', link: '/hooks/use-clipboard' },
  { label: 'use-document-title', link: '/hooks/use-document-title' },
  { label: 'use-document-visibility', link: '/hooks/use-document-visibility' },
  { label: 'use-eye-dropper', link: '/hooks/use-eye-dropper' },
  { label: 'use-favicon', link: '/hooks/use-favicon' },
  { label: 'use-hash', link: '/hooks/use-hash' },
  { label: 'use-headroom', link: '/hooks/use-headroom' },
  { label: 'use-scroll-direction', link: '/hooks/use-scroll-direction' },
  { label: 'use-idle', link: '/hooks/use-idle' },
  { label: 'use-interval', link: '/hooks/use-interval' },
  { label: 'use-merged-ref', link: '/hooks/use-merged-ref' },
  { label: 'use-network', link: '/hooks/use-network' },
  { label: 'use-os', link: '/hooks/use-os' },
  { label: 'use-page-leave', link: '/hooks/use-page-leave' },
  { label: 'use-text-selection', link: '/hooks/use-text-selection' },
  { label: 'use-timeout', link: '/hooks/use-timeout' },
  { label: 'use-fetch', link: '/hooks/use-fetch' },
]

const HOOKS_LIFECYCLE_PAGES: MdxNavItem[] = [
  { label: 'use-did-update', link: '/hooks/use-did-update' },
  { label: 'use-force-update', link: '/hooks/use-force-update' },
  { label: 'use-isomorphic-effect', link: '/hooks/use-isomorphic-effect' },
  { label: 'use-logger', link: '/hooks/use-logger' },
  { label: 'use-shallow-effect', link: '/hooks/use-shallow-effect' },
  { label: 'use-mounted', link: '/hooks/use-mounted' },
  { label: 'use-is-first-render', link: '/hooks/use-is-first-render' },
]

export const MDX_NAV_DATA: MdxNavCategory[] = [
  {
    category: 'Getting started',
    groups: [
      {
        title: null,
        pages: [
          { label: 'Getting started', link: '/getting-started' },
          { label: 'Usage with Vite', link: '/guides/vite' },
          { label: 'Usage with Nuxt', link: '/guides/nuxt' },
          { label: 'Usage with Vue Router', link: '/guides/vue-router' },
          { label: 'Without framework', link: '/guides/without-framework' },
        ],
      },
    ],
  },

  {
    category: 'Components',
    groups: [
      { title: 'Layout', pages: LAYOUT_PAGES },
      { title: 'Inputs', pages: INPUTS_PAGES },
      { title: 'Combobox', pages: COMBOBOX_PAGES },
      { title: 'Buttons', pages: BUTTONS_PAGES },
      { title: 'Navigation', pages: NAVIGATION_PAGES },
      { title: 'Feedback', pages: FEEDBACK_PAGES },
      { title: 'Overlays', pages: OVERLAYS_PAGES },
      { title: 'Data display', pages: DATA_DISPLAY_PAGES },
      { title: 'Typography', pages: TYPOGRAPHY_PAGES },
      { title: 'Miscellaneous', pages: MISCELLANEOUS_PAGES },
    ],
  },
  {
    category: 'Hooks',
    groups: [
      { title: 'UI and Dom', pages: HOOKS_UI_AND_DOM_PAGES },
      { title: 'State management', pages: HOOKS_STATE_MANAGEMENT_PAGES },
      { title: 'Utilities', pages: HOOKS_UTILITIES_PAGES },
      { title: 'Lifecycle', pages: HOOKS_LIFECYCLE_PAGES },
    ],
  },
  {
    category: 'Dates',
    groups: [{ title: 'Dates', pages: DATES_PAGES }],
  },
  {
    category: 'Form',
    groups: [{ title: 'Form', pages: FORM_PAGES }],
  },
  {
    category: 'Extensions',
    groups: [{ title: 'Other extensions', pages: OTHER_EXTENSIONS_PAGES }],
  },
]

export const FLAT_MDX_NAV_DATA: MdxNavItem[] = MDX_NAV_DATA.flatMap((c) =>
  c.groups.flatMap((g) => g.pages),
)
