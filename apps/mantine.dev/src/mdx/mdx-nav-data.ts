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
    category: 'Dates',
    groups: [{ title: 'Dates', pages: DATES_PAGES }],
  },
  {
    category: 'Schedule',
    groups: [{ title: 'Schedule', pages: SCHEDULE_PAGES }],
  },
  {
    category: 'Extensions',
    groups: [{ title: 'Other extensions', pages: OTHER_EXTENSIONS_PAGES }],
  },
]

export const FLAT_MDX_NAV_DATA: MdxNavItem[] = MDX_NAV_DATA.flatMap((c) =>
  c.groups.flatMap((g) => g.pages),
)
