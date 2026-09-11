import type { StylesApiData } from '../types'

export const ActionBarStylesApi: StylesApiData<'closeButton' | 'divider' | 'root'> = {
  selectors: {
    root: 'Root element',
    divider: '`ActionBar.Divider` root element',
    closeButton: '`ActionBar.CloseButton` root element',
  },
  vars: {},
}

export const GaugeChartStylesApi: StylesApiData<'label' | 'needle' | 'root' | 'section' | 'track'> =
  {
    selectors: {
      root: 'Root element',
      track: 'Gauge track',
      section: 'Gauge value section',
      needle: 'Target indicator',
      label: 'Gauge label',
    },
    vars: {},
  }

export const WaffleChartStylesApi: StylesApiData<
  'cell' | 'grid' | 'legend' | 'legendItem' | 'legendLabel' | 'legendSwatch' | 'root'
> = {
  selectors: {
    root: 'Root element',
    grid: 'Cells grid',
    cell: 'Individual cell',
    legend: 'Legend root element',
    legendItem: 'Legend item',
    legendSwatch: 'Legend item color swatch',
    legendLabel: 'Legend item label',
  },
  vars: {},
}

export const MatrixChartStylesApi: StylesApiData<
  'cell' | 'legend' | 'legendLabel' | 'legendRect' | 'root' | 'xLabel' | 'yLabel'
> = {
  selectors: {
    root: 'Root SVG element',
    cell: 'Individual matrix cell',
    xLabel: 'X-axis label',
    yLabel: 'Y-axis label',
    legend: 'Legend root element',
    legendLabel: 'Legend label',
    legendRect: 'Legend color rectangle',
  },
  vars: {},
}

export const CandlestickChartStylesApi: StylesApiData<
  | 'axis'
  | 'axisLabel'
  | 'candle'
  | 'container'
  | 'grid'
  | 'referenceArea'
  | 'referenceDot'
  | 'referenceLine'
  | 'root'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemData'
  | 'tooltipItemName'
  | 'tooltipLabel'
> = {
  selectors: {
    root: 'Root element',
    container: 'Chart container',
    axis: 'Chart axis',
    axisLabel: 'Chart axis label',
    grid: 'Chart grid',
    candle: 'Candlestick element',
    referenceLine: 'Reference line',
    referenceArea: 'Reference area',
    referenceDot: 'Reference dot',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip body',
    tooltipItem: 'Tooltip series item',
    tooltipItemBody: 'Tooltip series item body',
    tooltipItemColor: 'Tooltip series color swatch',
    tooltipItemData: 'Tooltip series value',
    tooltipItemName: 'Tooltip series name',
    tooltipLabel: 'Tooltip label',
  },
  vars: {},
}

export const QRCodeStylesApi: StylesApiData<
  | 'background'
  | 'finderInner'
  | 'finderOuter'
  | 'finderPattern'
  | 'image'
  | 'modules'
  | 'root'
  | 'svg'
> = {
  selectors: {
    root: 'Root element',
    svg: 'SVG element',
    background: 'Background rectangle',
    modules: 'Combined path of all data modules',
    finderPattern: 'Group for each finder pattern',
    finderOuter: 'Outer ring of each finder pattern',
    finderInner: 'Inner shape of each finder pattern',
    image: 'Center image overlay',
  },
  vars: {
    root: {
      '--qr-code-size': 'Controls QR code width and height',
      '--qr-code-radius': 'Controls root border radius',
      '--qr-code-color': 'Controls module and finder pattern color',
      '--qr-code-background': 'Controls background color',
    },
  },
}

export const LightboxStylesApi: StylesApiData<
  | 'caption'
  | 'closeButton'
  | 'content'
  | 'counter'
  | 'navigation'
  | 'navigationButton'
  | 'overlay'
  | 'root'
  | 'slide'
  | 'slideImage'
  | 'slideVideo'
  | 'slides'
  | 'slidesContainer'
  | 'slidesViewport'
  | 'thumbnail'
  | 'thumbnailImage'
  | 'thumbnails'
  | 'thumbnailsContainer'
  | 'thumbnailsViewport'
  | 'toolbar'
  | 'toolbarButton'
  | 'toolbarGroup'
> = {
  selectors: {
    root: 'Root element',
    overlay: 'Fixed overlay',
    content: 'Dialog content',
    toolbar: 'Toolbar root element',
    toolbarGroup: 'Toolbar item group',
    toolbarButton: 'Toolbar button',
    counter: 'Current slide counter',
    slides: 'Slides root element',
    slidesViewport: 'Slides viewport',
    slidesContainer: 'Slides container',
    slide: 'Individual slide',
    slideImage: 'Image slide element',
    slideVideo: 'Video slide element',
    thumbnails: 'Thumbnails root element',
    thumbnailsViewport: 'Thumbnails viewport',
    thumbnailsContainer: 'Thumbnails container',
    thumbnail: 'Individual thumbnail button',
    thumbnailImage: 'Thumbnail image',
    navigation: 'Navigation controls root element',
    navigationButton: 'Previous or next navigation button',
    caption: 'Current slide caption',
    closeButton: 'Close button',
  },
  vars: {
    root: {
      '--lightbox-transition-duration': 'Controls transition duration',
      '--lightbox-overlay-color': 'Controls overlay background color',
      '--lightbox-z-index': 'Controls overlay and content z-index',
      '--lightbox-toolbar-height': 'Controls toolbar height',
      '--lightbox-thumbnails-height': 'Controls thumbnails strip height',
    },
  },
}

export const AccordionStylesApi: StylesApiData<
  'chevron' | 'content' | 'control' | 'icon' | 'item' | 'itemTitle' | 'label' | 'panel' | 'root'
> = {
  selectors: {
    chevron: '`Accordion.Control` chevron container element',
    content: 'Wrapper element of `Accordion.Panel` `children`',
    control: '`Accordion.Control` root element',
    icon: '`Accordion.Control` icon',
    item: '`Accordion.Item` root element',
    itemTitle: '`Accordion.Control` title (h2-h6) tag',
    label: '`Accordion.Control` label',
    panel: '`Accordion.Panel` root element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--accordion-chevron-size': 'Controls chevron container element `width` and `min-width`',
      '--accordion-radius': 'Controls `border-radius` in various elements, depending on variant',
      '--accordion-transition-duration': 'Controls all animations `transition-duration`',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: ['item', 'control'],
      condition: 'Item is active (opened)',
    },
    {
      modifier: 'data-chevron-position',
      selector: 'control',
      value: 'Value of `chevronPosition` prop on `Accordion`',
    },
  ],
}

export const ActionIconStylesApi: StylesApiData<'icon' | 'loader' | 'root'> = {
  selectors: {
    icon: 'Inner icon wrapper',
    loader: '`Loader` component, rendered inside root element when `loading` prop is set',
    root: 'Root element',
  },
  vars: {
    root: {
      '--ai-bd': 'Controls `border`',
      '--ai-bg': 'Controls `background`',
      '--ai-color': 'Controls icon `color`',
      '--ai-hover': 'Controls `background` when hovered',
      '--ai-hover-color': 'Controls icon `color` when hovered',
      '--ai-radius': 'Controls `border-radius`',
      '--ai-size': 'Controls `width`, `height`, `min-width` and `min-height` styles',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-loading',
      selector: ['root', 'icon'],
      condition: '`loading` prop is set',
    },
  ],
}

export const ActionIconGroupStylesApi: StylesApiData<'group'> = {
  selectors: {
    group: 'Root element',
  },
  vars: {
    group: {
      '--ai-border-width':
        'Controls `border-width` of child ActionIcon components that are placed beside one another',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'group',
      value: 'Value of `orientation` prop',
    },
  ],
}

export const ActionIconGroupSectionStylesApi: StylesApiData<'groupSection'> = {
  selectors: {
    groupSection: 'group section element',
  },
  vars: {
    groupSection: {
      '--section-bd': 'Controls the bd',
      '--section-bg': 'Controls the bg',
      '--section-color': 'Controls the color',
      '--section-fz': 'Controls the fz',
      '--section-height': 'Controls the height',
      '--section-padding-x': 'Controls the padding x',
      '--section-radius': 'Controls the radius',
    },
  },
}

export const AffixStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--affix-bottom': 'Controls `bottom` property',
      '--affix-left': 'Controls `left` property',
      '--affix-right': 'Controls `right` property',
      '--affix-top': 'Controls `top` property',
      '--affix-z-index': 'Controls `z-index` property',
    },
  },
}

export const AlertStylesApi: StylesApiData<
  'body' | 'closeButton' | 'icon' | 'label' | 'message' | 'root' | 'title' | 'wrapper'
> = {
  selectors: {
    body: 'Body element, contains `title` and `message`',
    closeButton: 'Close button',
    icon: 'Icon element',
    label: 'Title label',
    message: 'Alert message',
    root: 'Root element',
    title: 'Title element, contains `label` and `icon`',
    wrapper: 'Wrapper around `body` and `icon`',
  },
  vars: {
    root: {
      '--alert-bd': 'Controls `border`',
      '--alert-bg': 'Controls `background`',
      '--alert-color': 'Controls `color`',
      '--alert-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-close-button',
      selector: 'title',
      condition: '`withCloseButton` prop is set',
    },
  ],
}

export const AlphaSliderStylesApi: StylesApiData<'slider' | 'sliderOverlay' | 'thumb'> = {
  selectors: {
    slider: 'Root element',
    sliderOverlay: 'Element used to display various overlays over hue slider',
    thumb: 'Thumb of the hue slider',
  },
  vars: {},
}

export const AnchorStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--text-fz': 'Controls `font-size` property',
      '--text-lh': 'Controls `line-height` property',
      '--text-gradient': 'Text fill gradient',
      '--text-line-clamp': 'Number of lines that should be visible',
      '--text-text-wrap': 'Controls `text-wrap` property',
    },
  },
  modifiers: [
    {
      modifier: 'data-truncate',
      selector: 'root',
      value: 'Value of `truncate` prop',
      condition: '`truncate` prop is set',
    },
    {
      modifier: 'data-line-clamp',
      selector: 'root',
      condition: '`lineClamp` prop is a number',
    },
    {
      modifier: 'data-inline',
      selector: 'root',
      condition: '`inline` prop is set',
    },
    {
      modifier: 'data-inherit',
      selector: 'root',
      condition: '`inherit` prop is set',
    },
    {
      modifier: 'data-underline',
      selector: 'root',
      value: 'Value of `underline` prop',
    },
  ],
}

export const AngleSliderStylesApi: StylesApiData<'label' | 'mark' | 'marks' | 'root' | 'thumb'> = {
  selectors: {
    label: 'Label inside the slider',
    mark: 'Mark element',
    marks: 'Wrapper for all marks',
    root: 'Root element',
    thumb: 'Slider thumb',
  },
  vars: {
    root: {
      '--angle': 'Controls the   angle',
      '--slider-size': 'Controls slider width and height',
      '--thumb-size': 'Controls thumb size',
    },
  },
  modifiers: [
    {
      modifier: 'disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
  ],
}

export const AppShellStylesApi: StylesApiData<
  'aside' | 'footer' | 'header' | 'main' | 'navbar' | 'root' | 'section'
> = {
  selectors: {
    aside: '`AppShell.Aside` root element',
    footer: '`AppShell.Footer` root element',
    header: '`AppShell.Header` root element',
    main: '`AppShell.Main` root element',
    navbar: '`AppShell.Navbar` root element',
    root: 'Root element (`AppShell` component)',
    section: '`AppShell.Section` root element',
  },
  vars: {
    root: {
      '--app-shell-transition-duration': 'Controls transition duration of all children',
      '--app-shell-transition-timing-function':
        'Controls transition timing function of all children',
    },
  },
  modifiers: [
    {
      modifier: 'data-resizing',
      selector: 'root',
      condition: 'User is resizing the window',
    },
    {
      modifier: 'data-layout',
      selector: 'root',
      value: 'Value of the `layout` prop',
    },
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-with-border',
      selector: ['navbar', 'header', 'aside', 'footer'],
      condition: '`withBorder` prop is set either on the `AppShell` or on the associated component',
    },
    {
      modifier: 'data-grow',
      selector: 'section',
      condition: '`grow` prop is set on the `AppShell.Section`',
    },
  ],
}

export const AreaChartStylesApi: StylesApiData<
  | 'root'
  | 'area'
  | 'axis'
  | 'container'
  | 'grid'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'referenceLine'
  | 'axisLabel'
  | 'brush'
> = {
  selectors: {
    root: 'Root element',
    area: 'Area of the chart',
    axis: 'X and Y axis of the chart',
    container: 'Recharts ResponsiveContainer component',
    grid: 'Recharts CartesianGrid component',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    referenceLine: 'Reference line',
    axisLabel: 'X and Y axis labels',
    brush: 'Brush (range selector) root element',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
    },
  },
}

export const AspectRatioStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--ar-ratio': 'Aspect ratio',
    },
  },
}

export const AutocompleteStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'empty'
  | 'group'
  | 'groupLabel'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    dropdown: 'Dropdown root element',
    options: 'Options wrapper',
    option: 'Option',
    empty: 'Nothing found message',
    group: 'Options group wrapper',
    groupLabel: 'Options group label',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: 'Options was activated by keyboard',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: 'Option is disabled',
    },
  ],
}

export const AvatarStylesApi: StylesApiData<'image' | 'placeholder' | 'root'> = {
  selectors: {
    image: '`img` element',
    placeholder: 'Avatar placeholder, displayed when the image cannot be loaded',
    root: 'Root element',
  },
  vars: {
    root: {
      '--avatar-bd': 'Controls placeholder `border`',
      '--avatar-bg': 'Controls placeholder `background`',
      '--avatar-color': 'Controls placeholder text `color`',
      '--avatar-radius': 'Controls `border-radius`',
      '--avatar-size': 'Controls `width`, `min-width` and `height`',
    },
  },
}

export const AvatarGroupStylesApi: StylesApiData<'group'> = {
  selectors: {
    group: 'Root element',
  },
  vars: {
    group: {
      '--ag-spacing': 'Controls negative spacing between avatars',
    },
  },
}

export const BackgroundImageStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--bi-radius': 'Controls `border-radius`',
    },
  },
}

export const BadgeStylesApi: StylesApiData<'label' | 'root' | 'section'> = {
  selectors: {
    label: 'Badge children',
    root: 'Root element',
    section: 'Left and right sections',
  },
  vars: {
    root: {
      '--badge-bd': 'Controls `border`',
      '--badge-bg': 'Controls `background`',
      '--badge-color': 'Controls text `color`',
      '--badge-dot-color': 'Controls dot `color`, only applicable when `variant="dot"`',
      '--badge-fz': 'Controls `font-size`',
      '--badge-height': 'Controls `height`',
      '--badge-padding-x': 'Controls horizontal `padding`',
      '--badge-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-block',
      selector: 'root',
      condition: '`fullWidth` prop is set',
    },
    {
      modifier: 'data-position',
      selector: 'section',
      value: 'Section position: left or right',
    },
  ],
}

export const BarChartStylesApi: StylesApiData<
  | 'root'
  | 'bar'
  | 'axis'
  | 'container'
  | 'grid'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'referenceLine'
  | 'axisLabel'
  | 'brush'
> = {
  selectors: {
    root: 'Root element',
    bar: 'Bar of the chart',
    axis: 'X and Y axis of the chart',
    container: 'Recharts ResponsiveContainer component',
    grid: 'Recharts CartesianGrid component',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    referenceLine: 'Reference line',
    axisLabel: 'X and Y axis labels',
    brush: 'Brush (range selector) root element',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
      '--chart-cursor-fill': 'Controls fill color of the cursor line',
      '--chart-bar-label-color': 'Controls color of the bar labels',
    },
  },
}

export const BarsListStylesApi: StylesApiData<
  'bar' | 'barLabel' | 'barValue' | 'labelsRow' | 'root'
> = {
  selectors: {
    bar: 'Bar container element',
    barLabel: 'Bar label element with name inside',
    barValue: 'Bar value element',
    labelsRow: 'Container for labels row',
    root: 'Root element',
  },
  vars: {
    root: {
      '--bars-list-gap': 'Controls gap between bars',
      '--bars-list-min-bar-size': 'Controls minimum bar width',
      '--bars-list-bar-height': 'Controls bar height',
    },
  },
}

export const BlockquoteStylesApi: StylesApiData<'cite' | 'icon' | 'root'> = {
  selectors: {
    cite: 'Cite element',
    icon: 'Icon element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--bq-bd': 'Controls `border`',
      '--bq-bg-dark': 'Controls `background-color` in dark color scheme',
      '--bq-bg-light': 'Controls `background-color` in light color scheme',
      '--bq-icon-size': 'Controls `width` and `height` of the icon',
      '--bq-radius': 'Controls `border-radius`',
      '--bq-text-wrap': 'Controls `text-wrap` property',
    },
  },
}

export const BreadcrumbsStylesApi: StylesApiData<'breadcrumb' | 'root' | 'separator'> = {
  selectors: {
    breadcrumb: 'Breadcrumb item',
    root: 'Root element',
    separator: 'Separator between children',
  },
  vars: {
    root: {
      '--bc-separator-margin': 'Control left and right `margin` of separator',
    },
  },
}

export const BubbleChartStylesApi: StylesApiData<'root' | 'axis' | 'tooltip'> = {
  selectors: {
    root: 'Root element',
    axis: 'X and Y axis of the chart',
    tooltip: 'Tooltip root element',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
    },
  },
}

export const BurgerStylesApi: StylesApiData<'burger' | 'root'> = {
  selectors: {
    burger: 'Inner element that contains burger lines',
    root: 'Root element (button)',
  },
  vars: {
    root: {
      '--burger-color': 'Controls background-color of lines',
      '--burger-line-size': 'Controls height of lines',
      '--burger-size': 'Controls width and height of the button',
      '--burger-transition-duration': 'Controls transition-duration of lines',
      '--burger-transition-timing-function': 'Controls transition-timing-function of lines',
    },
  },
  modifiers: [
    {
      modifier: 'data-opened',
      selector: 'burger',
      condition: 'opened prop is set',
    },
  ],
}

export const ButtonStylesApi: StylesApiData<'inner' | 'label' | 'loader' | 'root' | 'section'> = {
  selectors: {
    inner: 'Contains all other elements, child of the `root` element',
    label: 'Button children',
    loader: 'Loader component, displayed only when `loading` prop is set',
    root: 'Root element',
    section: 'Left and right sections of the button',
  },
  vars: {
    root: {
      '--button-bd': 'Control `border`',
      '--button-bg': 'Controls `background`',
      '--button-color': 'Control text `color`',
      '--button-fz': 'Controls `font-size` of the button',
      '--button-height': 'Controls `height` of the button',
      '--button-hover': 'Controls `background` when hovered',
      '--button-hover-color': 'Control text `color` when hovered',
      '--button-justify': 'Controls `justify-content` of `inner` element',
      '--button-padding-x': 'Controls horizontal `padding` of the button',
      '--button-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-loading',
      selector: ['root', 'label'],
      condition: '`loading` prop is set',
    },
    {
      modifier: 'data-block',
      selector: 'root',
      condition: '`fullWidth` prop is set',
    },
    {
      modifier: 'data-with-left-section',
      selector: 'root',
      condition: '`leftSection` is set',
    },
    {
      modifier: 'data-with-right-section',
      selector: 'root',
      condition: '`rightSection` is set',
    },
    {
      modifier: 'data-position',
      selector: 'section',
      value: 'Section position: left or right',
    },
  ],
}

export const ButtonGroupStylesApi: StylesApiData<'group'> = {
  selectors: {
    group: 'Root element',
  },
  vars: {
    group: {
      '--button-border-width': '`border-width` of child `Button` components',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'group',
      value: 'Value of `orientation` prop',
    },
  ],
}

export const ButtonGroupSectionStylesApi: StylesApiData<'groupSection'> = {
  selectors: {
    groupSection: 'Root element',
  },
  vars: {
    groupSection: {
      '--section-bd': 'Control `border`',
      '--section-bg': 'Controls `background`',
      '--section-color': 'Control text `color`',
      '--section-fz': 'Controls `font-size` of the section',
      '--section-height': 'Controls `height` of the section',
      '--section-padding-x': 'Controls horizontal `padding` of the section',
      '--section-radius': 'Controls `border-radius`',
    },
  },
}

export const CalendarStylesApi: StylesApiData<
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthThead'
  | 'monthRow'
  | 'monthTbody'
  | 'monthCell'
  | 'month'
  | 'weekdaysRow'
  | 'weekday'
  | 'day'
  | 'weekNumber'
  | 'calendar'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'pickerControl'
  | 'placeholder'
  | 'presetButton'
  | 'presetsList'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
> = {
  selectors: {
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of months levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthThead: 'thead element of month table',
    monthRow: 'tr element of month table',
    monthTbody: 'tbody element of month table',
    monthCell: 'td element of month table',
    month: 'Month table element',
    weekdaysRow: 'Weekdays tr element',
    weekday: 'Weekday th element',
    day: 'Month day control',
    weekNumber: 'Week number td element',
    calendar: 'calendar element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    presetButton: 'preset button element',
    presetsList: 'presets list element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
    {
      modifier: 'data-with-spacing',
      selector: 'monthCell',
      condition: '`withCellSpacing` prop is set',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Date is the same as new Date()',
    },
    {
      modifier: 'data-hidden',
      selector: 'day',
      condition: 'Day is outside of current month and `hideOutsideDates` is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'day',
      condition: 'Day disabled by one of the props (`excludeDate`, `getDayProps`, etc.)',
    },
    {
      modifier: 'data-weekend',
      selector: 'day',
      condition: 'Day is weekend',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Day is outside of the current month',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Day is selected',
    },
    {
      modifier: 'data-in-range',
      selector: 'day',
      condition: 'Day is in range selection',
    },
    {
      modifier: 'data-first-in-range',
      selector: 'day',
      condition: 'Day is first in range selection',
    },
    {
      modifier: 'data-last-in-range',
      selector: 'day',
      condition: 'Day is last in range selection',
    },
    {
      modifier: 'data-full-width',
      selector: 'calendar',
    },
  ],
}

export const CardStylesApi: StylesApiData<'root' | 'section'> = {
  selectors: {
    root: 'Root element',
    section: '`Card.Section` root element',
  },
  vars: {
    root: {
      '--card-padding':
        'Controls `padding` of the card, also used to control `Card.Section` spacing',
    },
  },
  modifiers: [
    {
      modifier: 'data-first-section',
      selector: 'section',
      condition: '`Card.Section` is the child of the `Card`',
    },
    {
      modifier: 'data-last-section',
      selector: 'section',
      condition: '`Card.Section` is the last child of the `Card`',
    },
    {
      modifier: 'data-with-border',
      selector: 'root',
      condition: '`withBorder` prop is set on `Card` component',
    },
    {
      modifier: 'data-with-border',
      selector: 'section',
      condition: '`withBorder` prop is set on `Card.Section` component',
    },
    {
      modifier: 'data-inherit-padding',
      selector: 'section',
      condition: '`inheritPadding` prop is set on `Card.Section` component',
    },
    {
      modifier: 'data-orientation',
      selector: 'root',
    },
  ],
}

export const CardSectionStylesApi: StylesApiData<'section'> = {
  selectors: {
    section: 'section element',
  },
  vars: {},
}

export const CarouselStylesApi: StylesApiData<
  'container' | 'control' | 'controls' | 'indicator' | 'indicators' | 'root' | 'slide' | 'viewport'
> = {
  selectors: {
    container: 'Slides container',
    control: 'Next/previous control',
    controls: 'Next/previous controls container',
    indicator: 'Indicator button',
    indicators: 'Indicators container',
    root: 'Root element',
    slide: '`Carousel.Slide` root element',
    viewport: 'Main element, contains slides container and all controls',
  },
  vars: {
    root: {
      '--carousel-control-size': 'Controls `width` and `height` of the next/previous buttons',
      '--carousel-controls-offset': 'Controls offsets of the next/previous buttons',
      '--carousel-height': 'Controls height of the carousel',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-include-gap-in-size',
      selector: 'root',
      condition: '`includeGapInSize` prop is set',
    },
    {
      modifier: 'data-inactive',
      selector: 'control',
      condition: 'No previous/next slides are available',
    },
    {
      modifier: 'data-active',
      selector: 'indicator',
      condition: 'Associated slide is active',
    },
  ],
}

export const CenterStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {},
}

export const CheckboxStylesApi: StylesApiData<
  'body' | 'description' | 'error' | 'icon' | 'inner' | 'input' | 'label' | 'labelWrapper' | 'root'
> = {
  selectors: {
    body: 'Input body, contains all other elements',
    description: 'Description displayed below the label',
    error: 'Error message displayed below the label',
    icon: 'Checkbox icon, used to display checkmark and indeterminate state icon',
    inner: 'Wrapper for `icon` and `input`',
    input: 'Input element (`input[type="checkbox"]`)',
    label: 'Label element',
    labelWrapper: 'Contains `label`, `description` and `error`',
    root: 'Root element',
  },
  vars: {
    root: {
      '--checkbox-color': 'Controls checked checkbox `background-color`',
      '--checkbox-icon-color': 'Controls checkbox icon `color`',
      '--checkbox-radius': 'Controls checkbox `border-radius`',
      '--checkbox-size': 'Controls checkbox `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'root',
      condition: '`checked` prop is set',
    },
    {
      modifier: 'data-error',
      selector: 'input',
      condition: '`error` prop is set',
    },
    {
      modifier: 'data-indeterminate',
      selector: 'input',
      condition: '`indeterminate` prop is set',
    },
    {
      modifier: 'data-label-position',
      selector: 'inner',
      value: 'Value of `labelPosition` prop',
    },
  ],
}

export const CheckboxCardStylesApi: StylesApiData<'card'> = {
  selectors: {
    card: 'Root element',
  },
  vars: {
    card: {
      '--card-radius': 'Controls card `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'card',
      condition: '`checked` prop is set',
    },
    {
      modifier: 'data-with-border',
      selector: 'card',
      condition: '`withBorder` prop is set',
    },
  ],
}

export const CheckboxGroupStylesApi: StylesApiData<
  'root' | 'label' | 'required' | 'description' | 'error' | 'success'
> = {
  selectors: {
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const CheckboxIndicatorStylesApi: StylesApiData<'icon' | 'indicator'> = {
  selectors: {
    icon: 'Checkbox icon',
    indicator: 'Root element',
  },
  vars: {
    indicator: {
      '--checkbox-color': 'Controls checked checkbox `background-color`',
      '--checkbox-icon-color': 'Controls checkbox icon `color`',
      '--checkbox-radius': 'Controls checkbox `border-radius`',
      '--checkbox-size': 'Controls checkbox `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'indicator',
      condition: '`checked` prop is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'indicator',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-variant',
      selector: 'indicator',
    },
  ],
}

export const ChipStylesApi: StylesApiData<
  'checkIcon' | 'iconWrapper' | 'input' | 'label' | 'root'
> = {
  selectors: {
    checkIcon: 'Check icon, visible when checked prop is true',
    iconWrapper: 'Wraps `checkIcon` for alignment',
    input: 'Input element, hidden by default',
    label: 'Input label, used as a chip body',
    root: 'Root element',
  },
  vars: {
    root: {
      '--chip-bd': 'Controls border when chip is checked',
      '--chip-bg': 'Controls `background-color` when chip is checked',
      '--chip-checked-padding': 'Controls horizontal padding when chip is checked',
      '--chip-color': 'Controls `color` when chip is checked',
      '--chip-fz': 'Controls `font-size`',
      '--chip-hover': 'Controls `background-color` when chip is checked and hovered',
      '--chip-icon-size': 'Controls width and height of the icon',
      '--chip-padding': 'Controls horizontal padding when chip is not checked',
      '--chip-radius': 'Controls `border-radius`',
      '--chip-size': 'Controls `height`',
      '--chip-spacing': 'Controls spacing between check icon and label',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'label',
      condition: 'Chip is checked',
    },
    {
      modifier: 'data-disabled',
      selector: 'label',
      condition: '`disabled` prop is set',
    },
  ],
}

export const CloseButtonStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--cb-icon-size': 'Controls `width` of the `X` icon',
      '--cb-radius': 'Controls `border-radius` of the button',
      '--cb-size': 'Controls `width` and `height` of the button',
    },
  },
}

export const CodeStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--code-bg': 'Controls `background-color`',
    },
  },
  modifiers: [
    {
      modifier: 'data-block',
      selector: 'root',
      condition: '`block` prop is set',
    },
  ],
}

export const CodeHighlightStylesApi: StylesApiData<
  | 'code'
  | 'codeHighlight'
  | 'codeWrapper'
  | 'control'
  | 'controls'
  | 'controlTooltip'
  | 'lineNumbers'
  | 'pre'
  | 'scrollarea'
  | 'showCodeButton'
> = {
  selectors: {
    code: 'Code element',
    codeHighlight: 'Root element',
    codeWrapper: 'Wrapper element around line numbers and scroll area',
    control: 'Control button, copy/collapse, custom controls',
    controls: 'A wrapper around controls',
    controlTooltip: 'Root element of control tooltip',
    lineNumbers: 'Line numbers column',
    pre: 'Pre element, contains code element',
    scrollarea: 'Scroll area, contains code',
    showCodeButton: 'Button that reveals full code when it is collapsed',
  },
  vars: {
    codeHighlight: {
      '--ch-background': 'Background color',
      '--ch-max-height': 'Max height of code block in collapsed state',
      '--ch-radius': 'Border radius',
    },
  },
}

export const CodeHighlightTabsStylesApi: StylesApiData<
  | 'codeHighlight'
  | 'showCodeButton'
  | 'pre'
  | 'code'
  | 'control'
  | 'controlTooltip'
  | 'controls'
  | 'scrollarea'
  | 'lineNumbers'
  | 'codeWrapper'
  | 'root'
  | 'filesScrollarea'
  | 'files'
  | 'file'
  | 'fileIcon'
  | 'inlineCodeHighlight'
> = {
  selectors: {
    codeHighlight: 'Root element of inner CodeHighlight component',
    showCodeButton: 'Button that reveals full code when it is collapsed',
    pre: 'Pre element, contains code element',
    code: 'Code element',
    control: 'Control button, copy/collapse, custom controls',
    controlTooltip: 'Root element of control tooltip',
    controls: 'A wrapper around controls',
    scrollarea: 'Scroll area, contains code',
    lineNumbers: 'Line numbers column',
    codeWrapper: 'Wrapper element around line numbers and scroll area',
    root: 'Root element',
    filesScrollarea: 'Scrollarea with files list',
    files: 'Files names list',
    file: 'File name',
    fileIcon: 'File icon',
    inlineCodeHighlight: 'inline code highlight element',
  },
  vars: {},
}

export const ColorInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'preview'
  | 'body'
  | 'slider'
  | 'sliderOverlay'
  | 'saturation'
  | 'saturationOverlay'
  | 'sliders'
  | 'thumb'
  | 'swatch'
  | 'swatches'
  | 'dropdown'
  | 'colorPreview'
  | 'eyeDropperButton'
  | 'eyeDropperIcon'
> = {
  selectors: {
    wrapper: 'Root element',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    preview: 'Color preview, displayed only when `format` supports alpha channel',
    body: 'Contains alpha/hue sliders and color preview',
    slider: 'Alpha and hue sliders root',
    sliderOverlay: 'Element used to display various overlays over hue and alpha sliders',
    saturation: 'Saturation picker',
    saturationOverlay: 'Element used to display various overlays over saturation picker',
    sliders: 'Contains alpha and hue sliders',
    thumb: 'Thumb of all sliders',
    swatch: 'Color swatch',
    swatches: 'Color swatches list',
    dropdown: 'Popover dropdown',
    colorPreview: 'Color swatch preview in input left section',
    eyeDropperButton: 'Eye dropper button',
    eyeDropperIcon: 'Default eye dropper icon',
  },
  vars: {
    colorPreview: {
      '--ci-preview-size': 'Controls `width` and `height` of color preview',
    },
    eyeDropperButton: {
      '--ci-button-size': 'Controls `width` and `height` of the eye dropper button',
    },
    eyeDropperIcon: {
      '--ci-eye-dropper-icon-size': 'Controls width and height of the eye dropper icon',
    },
  },
}

export const ColorPickerStylesApi: StylesApiData<
  | 'body'
  | 'preview'
  | 'saturation'
  | 'saturationOverlay'
  | 'slider'
  | 'sliderOverlay'
  | 'sliders'
  | 'swatch'
  | 'swatches'
  | 'thumb'
  | 'wrapper'
> = {
  selectors: {
    body: 'Contains alpha/hue sliders and color preview',
    preview: 'Color preview, displayed only when `format` supports alpha channel',
    saturation: 'Saturation picker',
    saturationOverlay: 'Element used to display various overlays over saturation picker',
    slider: 'Alpha and hue sliders root',
    sliderOverlay: 'Element used to display various overlays over hue and alpha sliders',
    sliders: 'Contains alpha and hue sliders',
    swatch: 'Color swatch',
    swatches: 'Color swatches list',
    thumb: 'Thumb of all sliders',
    wrapper: 'Root element',
  },
  vars: {
    wrapper: {
      '--cp-body-spacing': 'Controls spacing between sliders and saturation',
      '--cp-preview-size': 'Controls size of the preview swatch',
      '--cp-saturation-height': 'Controls `height` of the saturation picker',
      '--cp-swatch-size': 'Controls swatch `width` and `height`',
      '--cp-thumb-size': 'Controls thumb `width` and `height` in all sliders and saturation picker',
      '--cp-width': 'Controls `width` of the root element',
    },
  },
}

export const ColorSwatchStylesApi: StylesApiData<
  'alphaOverlay' | 'childrenOverlay' | 'colorOverlay' | 'root' | 'shadowOverlay'
> = {
  selectors: {
    alphaOverlay: 'Overlay with checkerboard pattern',
    childrenOverlay: 'Overlay with `children` inside',
    colorOverlay: 'Overlay with given color background',
    root: 'Root element',
    shadowOverlay: 'Overlay with inner box-shadow',
  },
  vars: {
    root: {
      '--cs-radius': 'Controls `border-radius` of all overlays and `root` element',
      '--cs-size': 'Controls `width`, `height`, `min-width` and `min-height` of the `root` element',
    },
  },
}

export const ComboboxStylesApi: StylesApiData<
  | 'dropdown'
  | 'empty'
  | 'footer'
  | 'group'
  | 'groupLabel'
  | 'header'
  | 'option'
  | 'options'
  | 'search'
> = {
  selectors: {
    dropdown: '`Combobox.Dropdown` component',
    empty: '`Combobox.Empty` component',
    footer: '`Combobox.Footer` component',
    group: '`Combobox.Group` component',
    groupLabel: 'Label of `Combobox.Group` component',
    header: '`Combobox.Header` component',
    option: '`Combobox.Option` component',
    options: '`Combobox.Options` component',
    search: '`Combobox.Search` input',
  },
  vars: {
    dropdown: {
      '--combobox-option-fz': 'Controls option `font-size`',
      '--combobox-option-padding': 'Controls option `padding`',
      '--combobox-padding': 'Controls dropdown `padding`',
    },
  },
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: '`active` prop is set',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-hidden',
      selector: 'dropdown',
      condition: '`hidden` prop is set',
    },
  ],
}

export const ComboboxPopoverStylesApi: StylesApiData<
  | 'options'
  | 'dropdown'
  | 'option'
  | 'search'
  | 'empty'
  | 'header'
  | 'footer'
  | 'group'
  | 'groupLabel'
> = {
  selectors: {
    options: '`Combobox.Options` component',
    dropdown: '`Combobox.Dropdown` component',
    option: '`Combobox.Option` component',
    search: '`Combobox.Search` input',
    empty: '`Combobox.Empty` component',
    header: '`Combobox.Header` component',
    footer: '`Combobox.Footer` component',
    group: '`Combobox.Group` component',
    groupLabel: 'Label of `Combobox.Group` component',
  },
  vars: {
    dropdown: {
      '--combobox-option-fz': 'Controls option `font-size`',
      '--combobox-option-padding': 'Controls option `padding`',
      '--combobox-padding': 'Controls dropdown `padding`',
    },
  },
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: '`active` prop is set',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-hidden',
      selector: 'dropdown',
      condition: '`hidden` prop is set',
    },
  ],
}

export const CompositeChartStylesApi: StylesApiData<
  | 'root'
  | 'area'
  | 'line'
  | 'bar'
  | 'axis'
  | 'container'
  | 'grid'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'referenceLine'
  | 'axisLabel'
  | 'brush'
> = {
  selectors: {
    root: 'Root element',
    area: 'Area of the chart',
    line: 'Line of the chart',
    bar: 'Bar of the chart',
    axis: 'X and Y axis of the chart',
    container: 'Recharts ResponsiveContainer component',
    grid: 'Recharts CartesianGrid component',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    referenceLine: 'Reference line',
    axisLabel: 'X and Y axis labels',
    brush: 'Brush (range selector) root element',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
    },
  },
}

export const ContainerStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--container-size': 'Controls container `max-width`',
    },
  },
}

export const ContextMenuStylesApi: StylesApiData<'root' | 'item' | 'divider'> = {
  selectors: {
    root: 'Root menu element',
    item: 'Menu item',
    divider: 'Divider between menu items',
  },
  vars: {},
}

export const DataListStylesApi: StylesApiData<'item' | 'itemLabel' | 'itemValue' | 'root'> = {
  selectors: {
    item: 'DataList.Item root element',
    itemLabel: 'DataList.ItemLabel `dt` element',
    itemValue: 'DataList.ItemValue `dd` element',
    root: 'Root `dl` element',
  },
  vars: {
    root: {
      '--data-list-fz': 'Controls `font-size`',
      '--data-list-gap': 'Controls gap between items',
      '--data-list-label-width': 'Controls `min-width` of `DataList.ItemLabel`',
      '--data-list-lh': 'Controls `line-height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-with-divider',
      selector: 'root',
      condition: '`withDivider` prop is set',
    },
  ],
}

export const DateInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthThead'
  | 'monthRow'
  | 'monthTbody'
  | 'monthCell'
  | 'month'
  | 'weekdaysRow'
  | 'weekday'
  | 'day'
  | 'weekNumber'
  | 'presetsRoot'
  | 'presetsList'
  | 'presetButton'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of months levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthThead: 'thead element of month table',
    monthRow: 'tr element of month table',
    monthTbody: 'tbody element of month table',
    monthCell: 'td element of month table',
    month: 'Month table element',
    weekdaysRow: 'Weekdays tr element',
    weekday: 'Weekday th element',
    day: 'Month day control',
    weekNumber: 'Week number td element',
    presetsRoot: 'Root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
    {
      modifier: 'data-with-spacing',
      selector: 'monthCell',
      condition: '`withCellSpacing` prop is set',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Date is the same as new Date()',
    },
    {
      modifier: 'data-hidden',
      selector: 'day',
      condition: 'Day is outside of current month and `hideOutsideDates` is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'day',
      condition: 'Day disabled by one of the props (`excludeDate`, `getDayProps`, etc.)',
    },
    {
      modifier: 'data-weekend',
      selector: 'day',
      condition: 'Day is weekend',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Day is outside of the current month',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Day is selected',
    },
    {
      modifier: 'data-in-range',
      selector: 'day',
      condition: 'Day is in range selection',
    },
    {
      modifier: 'data-first-in-range',
      selector: 'day',
      condition: 'Day is first in range selection',
    },
    {
      modifier: 'data-last-in-range',
      selector: 'day',
      condition: 'Day is last in range selection',
    },
  ],
}

export const DatePickerStylesApi: StylesApiData<
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthThead'
  | 'monthRow'
  | 'monthTbody'
  | 'monthCell'
  | 'month'
  | 'weekdaysRow'
  | 'weekday'
  | 'day'
  | 'weekNumber'
  | 'datePickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'calendar'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'dateTimePicker'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'pickerControl'
  | 'placeholder'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
> = {
  selectors: {
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of months levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthThead: 'thead element of month table',
    monthRow: 'tr element of month table',
    monthTbody: 'tbody element of month table',
    monthCell: 'td element of month table',
    month: 'Month table element',
    weekdaysRow: 'Weekdays tr element',
    weekday: 'Weekday th element',
    day: 'Month day control',
    weekNumber: 'Week number td element',
    datePickerRoot: 'Date picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    calendar: 'calendar element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    dateTimePicker: 'date time picker element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
  },
  vars: {
    datePickerRoot: {
      '--preset-font-size': 'Controls font size of preset buttons',
    },
  },
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
    {
      modifier: 'data-with-spacing',
      selector: 'monthCell',
      condition: '`withCellSpacing` prop is set',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Date is the same as new Date()',
    },
    {
      modifier: 'data-hidden',
      selector: 'day',
      condition: 'Day is outside of current month and `hideOutsideDates` is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'day',
      condition: 'Day disabled by one of the props (`excludeDate`, `getDayProps`, etc.)',
    },
    {
      modifier: 'data-weekend',
      selector: 'day',
      condition: 'Day is weekend',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Day is outside of the current month',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Day is selected',
    },
    {
      modifier: 'data-in-range',
      selector: 'day',
      condition: 'Day is in range selection',
    },
    {
      modifier: 'data-first-in-range',
      selector: 'day',
      condition: 'Day is first in range selection',
    },
    {
      modifier: 'data-last-in-range',
      selector: 'day',
      condition: 'Day is last in range selection',
    },
  ],
}

export const DatePickerInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthThead'
  | 'monthRow'
  | 'monthTbody'
  | 'monthCell'
  | 'month'
  | 'weekdaysRow'
  | 'weekday'
  | 'day'
  | 'weekNumber'
  | 'datePickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'placeholder'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of months levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthThead: 'thead element of month table',
    monthRow: 'tr element of month table',
    monthTbody: 'tbody element of month table',
    monthCell: 'td element of month table',
    month: 'Month table element',
    weekdaysRow: 'Weekdays tr element',
    weekday: 'Weekday th element',
    day: 'Month day control',
    weekNumber: 'Week number td element',
    datePickerRoot: 'Date picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    placeholder: 'Placeholder element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
    {
      modifier: 'data-with-spacing',
      selector: 'monthCell',
      condition: '`withCellSpacing` prop is set',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Date is the same as new Date()',
    },
    {
      modifier: 'data-hidden',
      selector: 'day',
      condition: 'Day is outside of current month and `hideOutsideDates` is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'day',
      condition: 'Day disabled by one of the props (`excludeDate`, `getDayProps`, etc.)',
    },
    {
      modifier: 'data-weekend',
      selector: 'day',
      condition: 'Day is weekend',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Day is outside of the current month',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Day is selected',
    },
    {
      modifier: 'data-in-range',
      selector: 'day',
      condition: 'Day is in range selection',
    },
    {
      modifier: 'data-first-in-range',
      selector: 'day',
      condition: 'Day is first in range selection',
    },
    {
      modifier: 'data-last-in-range',
      selector: 'day',
      condition: 'Day is last in range selection',
    },
  ],
}

export const DateTimePickerStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthThead'
  | 'monthRow'
  | 'monthTbody'
  | 'monthCell'
  | 'month'
  | 'weekdaysRow'
  | 'weekday'
  | 'day'
  | 'weekNumber'
  | 'datePickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'placeholder'
  | 'timeWrapper'
  | 'timeInput'
  | 'submitButton'
  | 'rangeTimeWrapper'
  | 'rangeTimeInput'
  | 'rangeInfo'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of months levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthThead: 'thead element of month table',
    monthRow: 'tr element of month table',
    monthTbody: 'tbody element of month table',
    monthCell: 'td element of month table',
    month: 'Month table element',
    weekdaysRow: 'Weekdays tr element',
    weekday: 'Weekday th element',
    day: 'Month day control',
    weekNumber: 'Week number td element',
    datePickerRoot: 'Date picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    placeholder: 'Placeholder element',
    timeWrapper: 'Wrapper around time input and submit button',
    timeInput: 'TimeInput',
    submitButton: 'Submit button',
    rangeTimeWrapper: 'Wrapper around two time inputs in range mode',
    rangeTimeInput: 'Time input in range mode',
    rangeInfo: 'Range dates preview in range mode',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
    {
      modifier: 'data-with-spacing',
      selector: 'monthCell',
      condition: '`withCellSpacing` prop is set',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Date is the same as new Date()',
    },
    {
      modifier: 'data-hidden',
      selector: 'day',
      condition: 'Day is outside of current month and `hideOutsideDates` is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'day',
      condition: 'Day disabled by one of the props (`excludeDate`, `getDayProps`, etc.)',
    },
    {
      modifier: 'data-weekend',
      selector: 'day',
      condition: 'Day is weekend',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Day is outside of the current month',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Day is selected',
    },
    {
      modifier: 'data-in-range',
      selector: 'day',
      condition: 'Day is in range selection',
    },
    {
      modifier: 'data-first-in-range',
      selector: 'day',
      condition: 'Day is first in range selection',
    },
    {
      modifier: 'data-last-in-range',
      selector: 'day',
      condition: 'Day is last in range selection',
    },
  ],
}

export const DayViewStylesApi: StylesApiData<
  | 'dayView'
  | 'dayViewAllDay'
  | 'dayViewAllDayEvents'
  | 'dayViewBackgroundEvent'
  | 'dayViewInner'
  | 'dayViewScrollArea'
  | 'dayViewSlot'
  | 'dayViewSlotLabel'
  | 'dayViewSlotLabels'
  | 'dayViewSlots'
  | 'dayViewTimeSlots'
> = {
  selectors: {
    dayView: 'Root element',
    dayViewAllDay: 'All-day events container',
    dayViewAllDayEvents: 'All-day events wrapper',
    dayViewBackgroundEvent: 'Background event element',
    dayViewInner: 'Inner container wrapping slot labels and slots',
    dayViewScrollArea: 'Scroll area component',
    dayViewSlot: 'Individual time slot element',
    dayViewSlotLabel: 'Time slot label element',
    dayViewSlotLabels: 'Container for all slot labels',
    dayViewSlots: 'Container for all slots',
    dayViewTimeSlots: 'Container for time slots (excludes all-day)',
  },
  vars: {
    dayView: {
      '--day-view-radius': 'Controls `border-radius` of the day view',
      '--day-view-slot-height': 'Controls `height` of 1-hour time slots',
      '--day-view-all-day-slot-height': 'Controls `height` of the all-day slot',
      '--slot-size': 'Controls the size',
    },
  },
  modifiers: [
    {
      modifier: 'data-hour-start',
      selector: 'dayViewSlot',
      condition: 'Slot is at the start of an hour',
    },
    {
      modifier: 'data-business-hours',
      selector: 'dayViewSlot',
      condition: '`highlightBusinessHours` is true and slot is within business hours',
    },
    {
      modifier: 'data-non-business-hours',
      selector: 'dayViewSlot',
      condition: '`highlightBusinessHours` is true and slot is outside business hours',
    },
    {
      modifier: 'data-drop-target',
      selector: 'dayViewSlot',
      condition: 'Slot is the current drag drop target',
    },
    {
      modifier: 'data-static',
      selector: 'dayView',
      condition: '`mode="static"` is set',
    },
    {
      modifier: 'data-all-day',
      selector: 'dayViewSlotLabel',
      condition: 'Label is for all-day slot',
    },
  ],
}

export const DialogStylesApi: StylesApiData<'closeButton' | 'root'> = {
  selectors: {
    closeButton: 'Close button',
    root: 'Root element',
  },
  vars: {
    root: {
      '--dialog-size': 'Controls `width` of the dialog',
    },
  },
}

export const DividerStylesApi: StylesApiData<'label' | 'root'> = {
  selectors: {
    label: 'Label element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--divider-border-style': 'Controls `border-style`',
      '--divider-color': 'Controls `border-color`',
      '--divider-size': 'Controls `border-width`',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-label',
      selector: 'root',
      condition: '`label` prop is truthy',
    },
    {
      modifier: 'data-orientation',
      selector: 'root',
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-position',
      selector: 'label',
      value: 'Value of `labelPosition` prop',
    },
  ],
}

export const DonutChartStylesApi: StylesApiData<
  | 'root'
  | 'label'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
> = {
  selectors: {
    root: 'Root element',
    label: 'Chart label, controlled by `chartLabel` prop',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
  },
  vars: {
    root: {
      '--chart-labels-color': 'Controls color of the chart labels',
      '--chart-size': 'Controls size of the chart',
      '--chart-stroke-color': 'Controls color of the chart stroke',
    },
  },
}

export const DrawerStylesApi: StylesApiData<
  'body' | 'close' | 'content' | 'header' | 'inner' | 'overlay' | 'root' | 'title'
> = {
  selectors: {
    body: 'Drawer body, displayed after header',
    close: 'Close button',
    content: '`Drawer.Content` root element',
    header: 'Contains title and close button',
    inner: 'Element used to center modal, has fixed position, takes entire screen',
    overlay: 'Overlay displayed under the `Drawer.Content`',
    root: 'Root element',
    title: 'Drawer title (h2 tag), displayed in the header',
  },
  vars: {
    root: {
      '--drawer-offset': 'Controls `margin` of `Drawer.Content`',
      '--drawer-size': 'Controls `width` of `Drawer.Content`',
      '--drawer-flex': 'Controls `flex` property of `Drawer.Content`',
      '--drawer-align': 'Controls `align-items` property of `Drawer.Content`',
      '--drawer-justify': 'Controls `justify-content` property of `Drawer.Content`',
      '--drawer-height': 'Controls `height` property of `Drawer.Content`',
    },
  },
}

export const DropzoneStylesApi: StylesApiData<'inner' | 'root'> = {
  selectors: {
    inner: 'Dropzone inner element (wraps children)',
    root: 'Dropzone root element',
  },
  vars: {
    root: {
      '--dropzone-accept-bg': 'Controls `background-color` when file is accepted',
      '--dropzone-accept-color': 'Controls `color` when file is accepted',
      '--dropzone-radius': 'Controls `border-radius`',
      '--dropzone-reject-bg': 'Controls `background-color` when file is rejected',
      '--dropzone-reject-color': 'Controls `color` when file is rejected',
    },
  },
  modifiers: [
    {
      modifier: 'data-accept',
      selector: 'root',
      condition: 'Files that are dragged over the dropzone are accepted',
    },
    {
      modifier: 'data-reject',
      selector: 'root',
      condition: 'Files that are dragged over the dropzone are rejected',
    },
    {
      modifier: 'data-idle',
      selector: 'root',
      condition: 'Dropzone is idle',
    },
    {
      modifier: 'data-loading',
      selector: 'root',
      condition: '`loading` prop is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-activate-on-click',
      selector: 'root',
      condition: '`activateOnClick` prop is `true`',
    },
  ],
}

export const DropzoneFullScreenStylesApi: StylesApiData<'fullScreen' | 'root' | 'inner'> = {
  selectors: {
    fullScreen: 'Dropzone.Fullscreen root element',
    root: 'Dropzone root element',
    inner: 'Dropzone inner element (wraps children)',
  },
  vars: {},
}

export const EmptyStateStylesApi: StylesApiData<
  'actions' | 'body' | 'description' | 'indicator' | 'root' | 'title'
> = {
  selectors: {
    actions: 'Wrapper around action buttons',
    body: 'Wrapper around `title`, `description` and `actions`',
    description: 'Description element',
    indicator: 'Wrapper around the icon or illustration',
    root: 'Root element',
    title: 'Title element',
  },
  vars: {
    root: {
      '--empty-state-description-fz': 'Controls description `font-size`',
      '--empty-state-gap': 'Controls gap between elements',
      '--empty-state-indicator-bg':
        'Controls indicator background of `filled` and `light` variants',
      '--empty-state-indicator-color': 'Controls indicator color of `filled` and `light` variants',
      '--empty-state-indicator-size': 'Controls indicator icon size',
      '--empty-state-title-fz': 'Controls title `font-size`',
    },
  },
  modifiers: [
    {
      modifier: 'data-align',
      selector: 'root',
      value: 'Value of `align` prop',
    },
    {
      modifier: 'data-variant',
      selector: 'root',
      value: 'Value of `variant` prop',
    },
    {
      modifier: 'data-with-background',
      selector: 'indicator',
      condition: '`withIndicatorBackground` prop is set or `variant` is set',
    },
  ],
}

export const FieldsetStylesApi: StylesApiData<'legend' | 'root'> = {
  selectors: {
    legend: 'Legend element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--fieldset-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-variant',
      selector: 'root',
    },
  ],
}

export const FileInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'placeholder'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    placeholder: 'Placeholder text',
  },
  vars: {},
}

export const FlexStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {},
}

export const FloatingIndicatorStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Indicator element that animates to match the target position and size',
  },
  vars: {
    root: {
      '--transition-duration': 'Controls indicator transition duration',
    },
  },
  modifiers: [
    {
      modifier: 'data-initialized',
      selector: 'root',
      condition: 'Indicator has been initialized and transitions are enabled',
    },
    {
      modifier: 'data-hidden',
      selector: 'root',
      condition: 'Indicator is hidden (when displayAfterTransitionEnd is true)',
    },
  ],
}

export const FloatingWindowStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--floating-window-height': 'Controls the window height',
      '--floating-window-width': 'Controls the window width',
      '--floating-window-z-index': 'Controls the window z index',
    },
  },
  modifiers: [
    {
      modifier: 'data-dragging',
      selector: 'root',
      condition: 'Window is being dragged',
    },
  ],
}

export const FunnelChartStylesApi: StylesApiData<
  | 'root'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
> = {
  selectors: {
    root: 'Root element',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
  },
  vars: {
    root: {
      '--chart-labels-color': 'Controls color of the chart labels',
      '--chart-size': 'Controls size of the chart',
      '--chart-stroke-color': 'Controls color of the chart stroke',
    },
  },
}

export const GridStylesApi: StylesApiData<'col' | 'container' | 'inner' | 'root'> = {
  selectors: {
    col: '`Grid.Col` root element',
    container: 'Container element, only used with `type="container"` prop',
    inner: 'Columns wrapper',
    root: 'Root element',
  },
  vars: {
    root: {
      '--grid-align': 'Controls `align-items` property',
      '--grid-justify': 'Controls `justify-content` property',
      '--grid-overflow': 'Controls `overflow` property',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-gap',
      selector: 'root',
      value: 'true',
      condition:
        'CSS variables for gap, rowGap, and columnGap are set. Variables include: --grid-gap, --grid-row-gap, --grid-column-gap, --grid-margin, --grid-col-padding-x, --grid-col-padding-y',
    },
    {
      modifier: 'data-with-col-vars',
      selector: 'col',
      value: 'true',
      condition:
        'CSS variables for column layout are set. Variables include: --col-flex-grow, --col-flex-basis, --col-width, --col-max-width, --col-offset, --col-order, --col-align-self',
    },
  ],
}

export const GridColStylesApi: StylesApiData<'col'> = {
  selectors: {
    col: 'col element',
  },
  vars: {},
}

export const GroupStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--group-align': 'Controls `align-items` property',
      '--group-child-width':
        'Controls `max-width` of child elements, applied when grow prop is set and `preventGrowOverflow` is `true`',
      '--group-gap': 'Controls `gap` property',
      '--group-justify': 'Controls `justify-content` property',
      '--group-wrap': 'Controls `flex-wrap` property',
    },
  },
  modifiers: [
    {
      modifier: 'data-grow',
      selector: 'root',
      condition: '`grow` prop is set',
    },
  ],
}

export const HeatmapStylesApi: StylesApiData<
  'legend' | 'legendLabel' | 'legendRect' | 'monthLabel' | 'rect' | 'root' | 'weekdayLabel'
> = {
  selectors: {
    legend: 'Legend group element',
    legendLabel: 'Legend text label (Less/More)',
    legendRect: 'Legend color rect',
    monthLabel: 'Month text element',
    rect: 'Rect that represents date',
    root: 'Root element',
    weekdayLabel: 'Weekday text element',
  },
  vars: {},
}

export const HighlightStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {},
}

export const HoverCardStylesApi: StylesApiData<'dropdown' | 'arrow' | 'overlay'> = {
  selectors: {
    dropdown: 'Dropdown element',
    arrow: 'Dropdown arrow',
    overlay: 'Overlay element',
  },
  vars: {
    dropdown: {
      '--popover-radius': 'Controls dropdown border-radius',
      '--popover-shadow': 'Controls dropdown box-shadow',
    },
  },
  modifiers: [
    {
      modifier: 'data-position',
      selector: 'dropdown',
      value: 'Value of floating ui dropdown position',
    },
  ],
}

export const HueSliderStylesApi: StylesApiData<'slider' | 'sliderOverlay' | 'thumb'> = {
  selectors: {
    slider: 'Root element',
    sliderOverlay: 'Element used to display various overlays over hue slider',
    thumb: 'Thumb of the hue slider',
  },
  vars: {},
}

export const ImageStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--image-object-fit': 'Controls `object-fit` property',
      '--image-radius': 'Controls `border-radius` property',
    },
  },
  modifiers: [
    {
      modifier: 'data-fallback',
      selector: 'root',
      condition: 'Image failed to load',
    },
  ],
}

export const IndicatorStylesApi: StylesApiData<'indicator' | 'root'> = {
  selectors: {
    indicator: 'Indicator element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--indicator-color': 'Controls `background-color`',
      '--indicator-radius': 'Controls `border-radius`',
      '--indicator-size': 'Controls `min-width` and `height`',
      '--indicator-text-color': 'Controls `color`',
      '--indicator-z-index': 'Controls `z-index` style',
    },
  },
  modifiers: [
    {
      modifier: 'data-inline',
      selector: 'root',
      condition: '`inline` prop is set',
    },
    {
      modifier: 'data-with-label',
      selector: 'indicator',
      condition: '`label` prop is set',
    },
    {
      modifier: 'data-with-border',
      selector: 'indicator',
      condition: '`withBorder` prop is set',
    },
    {
      modifier: 'data-processing',
      selector: 'indicator',
      condition: '`processing` prop is set',
    },
  ],
}

export const InlineCodeHighlightStylesApi: StylesApiData<'inlineCodeHighlight'> = {
  selectors: {
    inlineCodeHighlight: 'Root element',
  },
  vars: {
    inlineCodeHighlight: {
      '--ch-background': 'Background color',
      '--ch-radius': 'Border radius',
    },
  },
}

export const InputStylesApi: StylesApiData<'bottomSection' | 'input' | 'section' | 'wrapper'> = {
  selectors: {
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    input: 'Input element',
    section: 'Left and right sections',
    wrapper: 'Root element of the Input',
  },
  vars: {
    wrapper: {
      '--input-fz': '`font-size` of the input element',
      '--input-height':
        '`height` or `min-height` of the input element (depends on `multiline` prop)',
      '--input-left-section-pointer-events': 'Controls `pointer-events` of the left section',
      '--input-left-section-width': '`width` of the left section',
      '--input-margin-bottom':
        '`margin-bottom` of the input element, usually controlled by `Input.Wrapper`',
      '--input-margin-top':
        '`margin-top` of the input element, usually controlled by `Input.Wrapper`',
      '--input-padding-y': '`padding-top` and `padding-bottom` of the input element',
      '--input-radius': '`border-radius` of the input element',
      '--input-right-section-pointer-events': 'Controls `pointer-events` of the right section',
      '--input-right-section-width': '`width` of the right section',
    },
  },
  modifiers: [
    {
      modifier: 'data-error',
      selector: ['wrapper', 'input'],
      condition: '`error` prop is set',
    },
    {
      modifier: 'data-success',
      selector: ['wrapper', 'input'],
      condition: '`success` prop is set and `error` is not set',
    },
    {
      modifier: 'data-disabled',
      selector: 'input',
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-with-right-section',
      selector: 'wrapper',
      condition: '`rightSection` prop is set',
    },
    {
      modifier: 'data-with-left-section',
      selector: 'wrapper',
      condition: '`leftSection` prop is set',
    },
    {
      modifier: 'data-multiline',
      selector: 'wrapper',
      condition: '`multiline` prop is set',
    },
    {
      modifier: 'data-pointer',
      selector: 'wrapper',
      condition: '`pointer` prop is set',
    },
    {
      modifier: 'data-position',
      selector: 'section',
      value: 'Section position: left or right',
    },
    {
      modifier: 'data-size',
      selector: 'wrapper',
    },
  ],
}

export const InputWrapperStylesApi: StylesApiData<
  'description' | 'error' | 'label' | 'required' | 'root'
> = {
  selectors: {
    description: 'Description element',
    error: 'Error element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    root: 'Root element',
  },
  vars: {
    label: {
      '--input-asterisk-color': 'Controls label asterisk text `color`',
      '--input-label-size': 'Controls label `font-size`',
    },
    description: {
      '--input-description-size': 'Controls description `font-size`',
    },
    error: {
      '--input-error-size': 'Controls error `font-size`',
    },
  },
}

export const JsonInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const KbdStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--kbd-fz': 'Controls `font-size`',
    },
  },
}

export const LineChartStylesApi: StylesApiData<
  | 'root'
  | 'line'
  | 'axis'
  | 'container'
  | 'grid'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'referenceLine'
  | 'axisLabel'
  | 'brush'
> = {
  selectors: {
    root: 'Root element',
    line: 'Line of the chart',
    axis: 'X and Y axis of the chart',
    container: 'Recharts ResponsiveContainer component',
    grid: 'Recharts CartesianGrid component',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    referenceLine: 'Reference line',
    axisLabel: 'X and Y axis labels',
    brush: 'Brush (range selector) root element',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
    },
  },
}

export const ListStylesApi: StylesApiData<
  'item' | 'itemIcon' | 'itemLabel' | 'itemWrapper' | 'root'
> = {
  selectors: {
    item: 'ListItem root element',
    itemIcon: 'ListItem icon',
    itemLabel: 'ListItem content',
    itemWrapper: 'ListItem wrapper element, container, icon and content',
    root: 'Root element',
  },
  vars: {
    root: {
      '--list-fz': 'Controls `font-size`',
      '--list-lh': 'Controls `line-height`',
      '--list-spacing': 'Controls spacing between items',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-padding',
      selector: 'root',
      condition: '`withPadding` prop is set',
    },
    {
      modifier: 'data-centered',
      selector: 'item',
      condition: '`center` prop is set on List component',
    },
    {
      modifier: 'data-with-icon',
      selector: 'item',
      condition: '`icon` prop is set on ListItem component',
    },
  ],
}

export const LoaderStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--loader-color': 'Control loader color',
      '--loader-size':
        'Controls loader size (usually `width` and `height`, in some cases only `width`)',
    },
  },
}

export const LoadingOverlayStylesApi: StylesApiData<'loader' | 'overlay' | 'root'> = {
  selectors: {
    loader: '`Loader` component',
    overlay: '`Overlay` component',
    root: 'Root element',
  },
  vars: {
    root: {
      '--lo-z-index': 'Controls `z-index` of the overlay and loader',
    },
  },
}

export const MarkStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--mark-bg-dark': 'Controls `background-color` in dark color scheme',
      '--mark-bg-light': 'Controls `background-color` for light color scheme',
    },
  },
}

export const MarqueeStylesApi: StylesApiData<'content' | 'group' | 'root'> = {
  selectors: {
    content: 'Animated scrolling container',
    group: 'Repeated children wrapper',
    root: 'Root element',
  },
  vars: {
    root: {
      '--marquee-duration': 'Controls animation duration',
      '--marquee-fade-color': 'Controls the fade edge gradient color',
      '--marquee-fade-size': 'Controls the size of the fade gradient',
      '--marquee-gap': 'Controls gap between items',
      '--marquee-repeat': 'Number of times content is repeated',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      value: 'horizontal | vertical',
      condition: 'Value depends on `orientation` prop',
    },
    {
      modifier: 'data-reverse',
      selector: 'root',
      condition: '`reverse` prop is set',
    },
    {
      modifier: 'data-pause-on-hover',
      selector: 'root',
      condition: '`pauseOnHover` prop is set',
    },
    {
      modifier: 'data-fade-edges',
      selector: 'root',
      condition: '`fadeEdges` prop is `true` (default)',
    },
  ],
}

export const MaskInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const MenuStylesApi: StylesApiData<
  | 'arrow'
  | 'chevron'
  | 'divider'
  | 'dropdown'
  | 'item'
  | 'itemIndicator'
  | 'itemLabel'
  | 'itemSection'
  | 'label'
  | 'overlay'
  | 'search'
> = {
  selectors: {
    arrow: 'Dropdown arrow',
    chevron: 'Sub menu chevron',
    divider: '`Menu.Divider` root element',
    dropdown: 'Dropdown element',
    item: '`Menu.Item` root element',
    itemIndicator: 'Indicator slot of `Menu.CheckboxItem` and `Menu.RadioItem`',
    itemLabel: 'Label of `Menu.Item`',
    itemSection: 'Left and right sections of `Menu.Item`',
    label: '`Menu.Label` root element',
    overlay: 'Overlay element',
    search: '`Menu.Search` input element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'item',
      condition: '`disabled` prop is set on `Menu.Item`',
    },
  ],
}

export const MenubarStylesApi: StylesApiData<'root' | 'target'> = {
  selectors: {
    root: 'Root element with `role="menubar"`',
    target: '`Menubar.Target` top-level trigger button',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-expanded',
      selector: 'target',
      condition: 'Associated menu is opened',
    },
  ],
}

export const MiniCalendarStylesApi: StylesApiData<
  | 'root'
  | 'control'
  | 'days'
  | 'day'
  | 'dayMonth'
  | 'dayNumber'
  | 'calendar'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'month'
  | 'monthCell'
  | 'monthRow'
  | 'pickerControl'
  | 'placeholder'
  | 'presetButton'
  | 'presetsList'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
  | 'weekday'
  | 'weekNumber'
> = {
  selectors: {
    root: 'Root element',
    control: 'Button in the dropdown which is used to select hours/minutes/seconds/am-pm',
    days: 'Days container',
    day: 'Single day element',
    dayMonth: 'Day element in month view',
    dayNumber: 'Day number element',
    calendar: 'calendar element',
    calendarHeader: 'calendar header element',
    calendarHeaderControl: 'calendar header control element',
    calendarHeaderControlIcon: 'calendar header control icon element',
    calendarHeaderLevel: 'calendar header level element',
    calendarHeaderSelect: 'calendar header select element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    month: 'month element',
    monthCell: 'month cell element',
    monthRow: 'month row element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    presetButton: 'preset button element',
    presetsList: 'presets list element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
    weekday: 'weekday element',
    weekNumber: 'week number element',
  },
  vars: {
    root: {
      '--mini-calendar-font-size': 'Controls size of all elements (based on em units)',
    },
  },
  modifiers: [
    {
      selector: 'control',
      modifier: 'disabled',
      condition: 'Next/previous range is after `maxDate` or before `minDate`',
    },
    {
      selector: 'control',
      modifier: 'direction',
      value: '`previous` or `next`',
    },
    {
      selector: 'day',
      modifier: 'selected',
      condition: 'The day matches the `value`',
    },
    {
      selector: 'day',
      modifier: 'disabled',
      condition: 'The day is before `minDate` or after `maxDate`',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderLevel',
    },
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControlIcon',
    },
    {
      modifier: 'data-selected',
      selector: 'day',
    },
    {
      modifier: 'data-chevron',
      selector: 'miniCalendarControl',
    },
  ],
}

export const MobileMonthViewStylesApi: StylesApiData<
  | 'mobileMonthView'
  | 'mobileMonthViewCalendar'
  | 'mobileMonthViewDay'
  | 'mobileMonthViewDayIndicator'
  | 'mobileMonthViewDayIndicators'
  | 'mobileMonthViewEvent'
  | 'mobileMonthViewEventBody'
  | 'mobileMonthViewEventColor'
  | 'mobileMonthViewEventsHeader'
  | 'mobileMonthViewEventsList'
  | 'mobileMonthViewEventTime'
  | 'mobileMonthViewEventTitle'
  | 'mobileMonthViewHeader'
  | 'mobileMonthViewHeaderBackButton'
  | 'mobileMonthViewHeaderLabel'
  | 'mobileMonthViewNoEvents'
  | 'mobileMonthViewWeek'
  | 'mobileMonthViewWeekday'
  | 'mobileMonthViewWeekdays'
  | 'mobileMonthViewWeekdaysCorner'
  | 'mobileMonthViewWeekNumber'
> = {
  selectors: {
    mobileMonthView: 'Root element',
    mobileMonthViewCalendar: 'Calendar grid container',
    mobileMonthViewDay: 'Day cell button',
    mobileMonthViewDayIndicator: 'Individual day indicator dot',
    mobileMonthViewDayIndicators: 'Day indicators container',
    mobileMonthViewEvent: 'Event item button',
    mobileMonthViewEventBody: 'Event body layout container',
    mobileMonthViewEventColor: 'Event color indicator',
    mobileMonthViewEventsHeader: 'Events list header (selected date)',
    mobileMonthViewEventsList: 'Events list container',
    mobileMonthViewEventTime: 'Event time label',
    mobileMonthViewEventTitle: 'Event title text',
    mobileMonthViewHeader: 'Header container with back button and month label',
    mobileMonthViewHeaderBackButton: 'Back button with year text',
    mobileMonthViewHeaderLabel: 'Month and year label in the header',
    mobileMonthViewNoEvents: 'No events message',
    mobileMonthViewWeek: 'Week row',
    mobileMonthViewWeekday: 'Individual weekday name',
    mobileMonthViewWeekdays: 'Weekdays row',
    mobileMonthViewWeekdaysCorner: 'Weekdays corner (for week numbers)',
    mobileMonthViewWeekNumber: 'Week number button',
  },
  vars: {
    mobileMonthView: {
      '--mobile-month-view-radius': 'Controls border radius',
    },
  },
}

export const ModalStylesApi: StylesApiData<
  'body' | 'close' | 'content' | 'header' | 'inner' | 'overlay' | 'root' | 'title'
> = {
  selectors: {
    body: 'Modal body, displayed after header',
    close: 'Close button',
    content: '`Modal.Content` root element',
    header: 'Contains title and close button',
    inner: 'Element used to center modal, has fixed position, takes entire screen',
    overlay: 'Overlay displayed under the `Modal.Content`',
    root: 'Root element',
    title: 'Modal title (h2 tag), displayed in the header',
  },
  vars: {
    root: {
      '--modal-radius': 'Controls `border-radius` of `Modal.Content`',
      '--modal-size': 'Controls `width` of `Modal.Content`',
      '--modal-x-offset':
        'Controls left and right `padding` of the inner element used to position `Modal.Content`',
      '--modal-y-offset':
        'Controls top and bottom `padding` of the inner element used to position `Modal.Content`',
    },
  },
  modifiers: [
    {
      modifier: 'data-full-screen',
      selector: 'root',
      condition: '`fullScreen` prop is set',
    },
    {
      modifier: 'data-centered',
      selector: 'root',
      condition: '`centered` prop is set',
    },
  ],
}

export const MonthPickerStylesApi: StylesApiData<
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'calendar'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'day'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'month'
  | 'monthCell'
  | 'monthRow'
  | 'pickerControl'
  | 'placeholder'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
  | 'weekday'
  | 'weekNumber'
> = {
  selectors: {
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of years levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthPickerRoot: 'Month picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    calendar: 'calendar element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    day: 'day element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    month: 'month element',
    monthCell: 'month cell element',
    monthRow: 'month row element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
    weekday: 'weekday element',
    weekNumber: 'week number element',
  },
  vars: {
    monthPickerRoot: {
      '--preset-font-size': 'Controls font size of preset buttons',
    },
  },
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
  ],
}

export const MonthPickerInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'monthsList'
  | 'monthsListRow'
  | 'monthsListCell'
  | 'monthsListControl'
  | 'monthPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'placeholder'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of years levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    monthsList: 'Months list table element',
    monthsListRow: 'Months list row element',
    monthsListCell: 'Months list cell element',
    monthsListControl: 'Button used to pick months and years',
    monthPickerRoot: 'Month picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    placeholder: 'Placeholder element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
  ],
}

export const MonthViewStylesApi: StylesApiData<
  | 'monthView'
  | 'monthViewScrollArea'
  | 'monthViewInner'
  | 'monthViewBackgroundEvent'
  | 'monthViewDay'
  | 'monthViewDayLabel'
  | 'monthViewEvents'
  | 'monthViewWeek'
  | 'monthViewWeekday'
  | 'monthViewWeekdays'
  | 'monthViewWeekdaysCorner'
  | 'monthViewWeekNumber'
> = {
  selectors: {
    monthView: 'Root element',
    monthViewScrollArea: 'Scroll area component that wraps the grid',
    monthViewInner: 'Inner container wrapping the weekday names and the weeks',
    monthViewBackgroundEvent: 'Background event element',
    monthViewDay: 'Day cell',
    monthViewDayLabel: 'Day number label',
    monthViewEvents: 'Events container in day cell',
    monthViewWeek: 'Week row',
    monthViewWeekday: 'Weekday name cell',
    monthViewWeekdays: 'Weekdays row',
    monthViewWeekdaysCorner: 'Top-left corner in weekdays row',
    monthViewWeekNumber: 'Week number indicator',
  },
  vars: {
    monthView: {
      '--month-view-radius': 'Controls `border-radius` of the month view',
      '--month-view-max-events':
        'Maximum number of visible events per day before "+more" indicator',
    },
  },
  modifiers: [
    {
      modifier: 'data-today',
      selector: 'monthViewDay',
      condition: 'Day is today',
    },
    {
      modifier: 'data-weekend',
      selector: 'monthViewDay',
      condition: 'Day is a weekend day',
    },
    {
      modifier: 'data-outside',
      selector: 'monthViewDay',
      condition: 'Day is outside current month',
    },
    {
      modifier: 'data-static',
      selector: 'monthView',
      condition: '`mode="static"` is set',
    },
  ],
}

export const MultiSelectStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'empty'
  | 'group'
  | 'groupLabel'
  | 'pill'
  | 'inputField'
  | 'pillsList'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    dropdown: 'Dropdown root element',
    options: 'Options wrapper',
    option: 'Option',
    empty: 'Nothing found message',
    group: 'Options group wrapper',
    groupLabel: 'Options group label',
    pill: 'Value pill',
    inputField: 'Input field',
    pillsList: 'List of pills, also contains input field',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: 'Options was activated by keyboard',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: 'Option is disabled',
    },
  ],
}

export const NativeSelectStylesApi: StylesApiData<
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
> = {
  selectors: {
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
  },
  vars: {},
}

export const NavLinkStylesApi: StylesApiData<
  'body' | 'chevron' | 'children' | 'collapse' | 'description' | 'label' | 'root' | 'section'
> = {
  selectors: {
    body: 'Contains label and description',
    chevron: 'Default chevron icon',
    children: 'Wrapper around nested links',
    collapse: 'Nested links Collapse container',
    description: 'Dimmed description displayed below the label',
    label: 'NavLink label',
    root: 'Root element',
    section: 'Left and right sections',
  },
  vars: {
    root: {
      '--nl-bg': 'Controls link `background-color`',
      '--nl-color': 'Controls link `color`',
      '--nl-hover': 'Controls link `background-color` when hovered',
    },
    children: {
      '--nl-offset': 'Controls nested links offset',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'root',
      condition: '`active` prop is set',
    },
  ],
}

export const NotificationStylesApi: StylesApiData<
  'body' | 'closeButton' | 'description' | 'icon' | 'loader' | 'root' | 'title'
> = {
  selectors: {
    body: 'Notification body, contains all other elements',
    closeButton: 'Close button element',
    description: 'Description displayed below the title',
    icon: 'Icon component, displayed only when `icon` prop is set',
    loader: 'Loader component, displayed only when `loading` prop is set',
    root: 'Root element',
    title: 'Title element, displayed only when `title` prop is set',
  },
  vars: {
    root: {
      '--notification-color': 'Controls icon color or notification line color',
      '--notification-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-icon',
      selector: 'root',
      condition: '`icon` prop is set',
    },
    {
      modifier: 'data-with-border',
      selector: 'root',
      condition: '`withBorder` prop is set',
    },
    {
      modifier: 'data-with-title',
      selector: 'description',
      condition: '`title` prop is set',
    },
  ],
}

export const NotificationsStylesApi: StylesApiData<'notification' | 'root'> = {
  selectors: {
    notification: 'Single notification',
    root: 'Notifications container, contains all notifications',
  },
  vars: {
    root: {
      '--notifications-container-width': 'Controls notifications container `max-width`',
      '--notifications-z-index': 'Controls notifications container `z-index`',
    },
  },
  modifiers: [
    {
      modifier: 'data-layout',
      selector: 'root',
      value: 'Value of the `layout` prop',
    },
  ],
}

export const NumberInputStylesApi: StylesApiData<
  | 'bottomSection'
  | 'control'
  | 'controls'
  | 'description'
  | 'error'
  | 'input'
  | 'label'
  | 'required'
  | 'root'
  | 'section'
  | 'wrapper'
> = {
  selectors: {
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    control: 'Increment and decrement buttons',
    controls: 'Increment and decrement buttons wrapper',
    description: 'Description element',
    error: 'Error element',
    input: 'Input element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    root: 'Root element',
    section: 'Left and right sections',
    wrapper: 'Root element of the Input',
  },
  vars: {
    controls: {
      '--ni-chevron-size': 'Controls `width` and `height` of the default chevron icon',
    },
  },
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'control',
      value: '`up` or `down` depending on the control',
    },
  ],
}

export const OverflowListStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--ol-gap': 'Controls gap between items',
    },
  },
}

export const OverlayStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--overlay-bg': 'Controls `background-color`',
      '--overlay-filter': 'Controls `backdrop-filter`',
      '--overlay-radius': 'Controls `border-radius`',
      '--overlay-z-index': 'Controls `z-index`',
    },
  },
  modifiers: [
    {
      modifier: 'data-center',
      selector: 'root',
      condition: '`center` prop is set',
    },
    {
      modifier: 'data-fixed',
      selector: 'root',
      condition: '`fixed` prop is set',
    },
  ],
}

export const PaginationStylesApi: StylesApiData<'root' | 'control' | 'dots' | 'items' | 'label'> = {
  selectors: {
    root: 'Root element',
    control: 'Control element: items, next/previous, first/last buttons',
    dots: 'Dots icon wrapper',
    items: 'Wrapper around page number controls, used with `layout="responsive"`',
    label: 'Compact label element displayed in narrow containers with `layout="responsive"`',
  },
  vars: {
    root: {
      '--pagination-active-bg': 'Active control `background-color`',
      '--pagination-active-color': 'Active control `color`',
      '--pagination-control-fz': 'Controls `font-size`',
      '--pagination-control-radius': 'Controls control `border-radius`',
      '--pagination-control-size': 'Controls control `min-width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'control',
      condition: 'Control is active',
    },
    {
      modifier: 'data-disabled',
      selector: 'control',
      condition: 'Control is disabled',
    },
    {
      modifier: 'data-layout',
      selector: 'root',
      value: 'Value of `layout` prop',
    },
  ],
}

export const PaperStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--paper-radius': 'Controls `border-radius`',
      '--paper-shadow': 'Controls `box-shadow`',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-border',
      selector: 'root',
      condition: '`withBorderProp` is set',
    },
  ],
}

export const PasswordInputStylesApi: StylesApiData<
  | 'bottomSection'
  | 'description'
  | 'error'
  | 'innerInput'
  | 'input'
  | 'label'
  | 'required'
  | 'root'
  | 'section'
  | 'visibilityToggle'
  | 'wrapper'
> = {
  selectors: {
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    description: 'Description element',
    error: 'Error element',
    innerInput: 'Actual input element',
    input: 'Input element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    root: 'Root element',
    section: 'Left and right sections',
    visibilityToggle: 'Visibility toggle button',
    wrapper: 'Root element of the Input',
  },
  vars: {
    root: {
      '--psi-button-size': 'Controls visibility toggle button `width` and `height`',
      '--psi-icon-size': 'Controls visibility toggle icon `width` and `height`',
    },
  },
}

export const PieChartStylesApi: StylesApiData<'label' | 'root'> = {
  selectors: {
    label: 'label element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--chart-labels-color': 'Controls color of the chart labels',
      '--chart-size': 'Controls size of the chart',
      '--chart-stroke-color': 'Controls color of the chart stroke',
    },
  },
}

export const PillStylesApi: StylesApiData<'label' | 'remove' | 'root'> = {
  selectors: {
    label: 'Pill label (children)',
    remove: 'Remove button',
    root: 'Root element',
  },
  vars: {
    root: {
      '--pill-fz': 'Controls `font-size`',
      '--pill-height': 'Controls `height` of the pill',
      '--pill-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-remove',
      selector: 'root',
      condition: '`withRemoveButton` prop is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: '`disabled` prop is set',
    },
  ],
}

export const PillGroupStylesApi: StylesApiData<'group'> = {
  selectors: {
    group: 'Root element',
  },
  vars: {
    group: {
      '--pg-gap': 'Controls `gap` between pills',
    },
  },
}

export const PillsInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const PinInputStylesApi: StylesApiData<'input' | 'pinInput' | 'root'> = {
  selectors: {
    input: 'Input element',
    pinInput: 'Input item wrapper',
    root: 'Root element',
  },
  vars: {
    root: {
      '--input-padding': 'Controls the padding',
      '--input-text-align': 'Controls the text align',
      '--pin-input-size': 'Controls input `width` and `height`',
    },
  },
}

export const PopoverStylesApi: StylesApiData<'arrow' | 'dropdown' | 'overlay'> = {
  selectors: {
    arrow: 'Dropdown arrow',
    dropdown: 'Dropdown element',
    overlay: 'Overlay element',
  },
  vars: {
    dropdown: {
      '--popover-radius': 'Controls dropdown border-radius',
      '--popover-shadow': 'Controls dropdown box-shadow',
    },
  },
  modifiers: [
    {
      modifier: 'data-position',
      selector: 'dropdown',
      value: 'Value of floating ui dropdown position',
    },
  ],
}

export const ProgressStylesApi: StylesApiData<'label' | 'root' | 'section'> = {
  selectors: {
    label: '`Progress.Label` root element',
    root: 'Root element',
    section: '`Progress.Section` root element',
  },
  vars: {
    root: {
      '--progress-radius': 'Controls `border-radius` of track and sections',
      '--progress-size': 'Controls height of progress bar',
      '--progress-transition-duration': 'Controls width `transition-duration` of progress bar',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      value: 'vertical | horizontal',
      condition: '`orientation` prop',
    },
    {
      modifier: 'data-striped',
      selector: 'section',
      condition: '`striped` or `animated` props are set',
    },
    {
      modifier: 'data-animated',
      selector: 'section',
      condition: '`animated` prop is set',
    },
  ],
}

export const RadarChartStylesApi: StylesApiData<
  | 'root'
  | 'container'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
> = {
  selectors: {
    root: 'Root element',
    container: 'Recharts ResponsiveContainer component',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the chart grid',
      '--chart-text-color': 'Controls color of all text elements in the chart',
    },
  },
}

export const RadialBarChartStylesApi: StylesApiData<
  'root' | 'tooltip' | 'legend' | 'legendItem' | 'legendItemColor' | 'legendItemName'
> = {
  selectors: {
    root: 'Root element',
    tooltip: 'Tooltip root element',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
  },
  vars: {
    root: {
      '--chart-empty-background': 'Background color of the empty space in the chart',
    },
  },
}

export const RadioStylesApi: StylesApiData<
  'body' | 'description' | 'error' | 'icon' | 'inner' | 'label' | 'labelWrapper' | 'radio' | 'root'
> = {
  selectors: {
    body: 'Input body, contains all other elements',
    description: 'Description displayed below the label',
    error: 'Error message displayed below the label',
    icon: 'Radio icon, used to display checked icon',
    inner: 'Wrapper for `icon` and `input`',
    label: 'Label element',
    labelWrapper: 'Contains `label`, `description` and `error`',
    radio: 'Input element (`input[type="radio"]`)',
    root: 'Root element',
  },
  vars: {
    root: {
      '--radio-color': 'Controls checked radio `background-color`',
      '--radio-icon-color': 'Controls radio icon `color`',
      '--radio-icon-size': 'Controls radio icon `width` and `height`',
      '--radio-radius': 'Controls radio `border-radius`',
      '--radio-size': 'Controls radio `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-error',
      selector: 'radio',
      condition: '`error` prop is set',
    },
    {
      modifier: 'data-label-position',
      selector: 'inner',
      value: 'Value of `labelPosition` prop',
    },
  ],
}

export const RadioCardStylesApi: StylesApiData<'card'> = {
  selectors: {
    card: 'Root element',
  },
  vars: {
    card: {
      '--card-radius': 'Controls card `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'card',
      condition: '`checked` prop is set',
    },
    {
      modifier: 'data-with-border',
      selector: 'card',
      condition: '`withBorder` prop is set',
    },
  ],
}

export const RadioGroupStylesApi: StylesApiData<
  'root' | 'label' | 'required' | 'description' | 'error' | 'success'
> = {
  selectors: {
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const RadioIndicatorStylesApi: StylesApiData<'icon' | 'indicator'> = {
  selectors: {
    icon: 'Radio icon',
    indicator: 'Root element',
  },
  vars: {
    indicator: {
      '--radio-color': 'Controls checked radio `background-color`',
      '--radio-icon-color': 'Controls radio icon `color`',
      '--radio-icon-size': 'Controls radio icon `width` and `height`',
      '--radio-radius': 'Controls radio `border-radius`',
      '--radio-size': 'Controls radio `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'indicator',
      condition: '`checked` prop is set',
    },
    {
      modifier: 'data-disabled',
      selector: 'indicator',
      condition: '`disabled` prop is set',
    },
  ],
}

export const RangeSliderStylesApi: StylesApiData<
  | 'root'
  | 'label'
  | 'thumb'
  | 'trackContainer'
  | 'track'
  | 'bar'
  | 'markWrapper'
  | 'mark'
  | 'markLabel'
> = {
  selectors: {
    root: 'Root element',
    label: 'Thumb label',
    thumb: 'Thumb element',
    trackContainer: 'Wraps track element',
    track: 'Slider track',
    bar: 'Track filled part',
    markWrapper: 'Contains `mark` and `markLabel` elements',
    mark: 'Mark displayed on track',
    markLabel: 'Label of the associated mark, displayed below track',
  },
  vars: {
    root: {
      '--slider-color': 'Controls filled track, thumb and marks `background`',
      '--slider-radius': 'Controls `border-radius` of track and thumb',
      '--slider-size': 'Controls track `height`',
      '--slider-thumb-size': 'Controls thumb `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      condition: 'Determines slider orientation, `horizontal` by default',
    },
    {
      modifier: 'data-disabled',
      selector: ['trackContainer', 'track', 'bar', 'thumb', 'mark'],
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-inverted',
      selector: ['track', 'bar'],
      condition: '`inverted` prop is set',
    },
    {
      modifier: 'data-dragging',
      selector: 'thumb',
      condition: 'slider is being dragged',
    },
    {
      modifier: 'data-filled',
      selector: 'mark',
      condition: 'mark position is less or equal slider value',
    },
  ],
}

export const RatingStylesApi: StylesApiData<
  'input' | 'label' | 'root' | 'starSymbol' | 'symbolBody' | 'symbolGroup'
> = {
  selectors: {
    input: 'Item input, hidden by default',
    label: 'Item label, used to display star icon',
    root: 'Root element',
    starSymbol: 'Symbol element (star icon by default, or custom symbol)',
    symbolBody: 'Wrapper around star icon, used for clip-path masking in fractional ratings',
    symbolGroup: 'Container for all fractional symbols of a single rating unit',
  },
  vars: {
    root: {
      '--rating-color': 'Controls filled star icon color',
      '--rating-size':
        'Controls star icon width and height. Can use theme size or custom CSS value.',
    },
  },
  modifiers: [
    {
      modifier: 'data-read-only',
      selector: 'label',
      condition: '`readOnly` prop is set',
    },
    {
      modifier: 'data-active',
      selector: 'input',
      condition: 'Input value is the same as component value',
    },
    {
      modifier: 'data-active',
      selector: 'symbolGroup',
      condition: 'Symbol group is being hovered',
    },
    {
      modifier: 'data-filled',
      selector: 'starSymbol',
      condition: 'Associated input value is less or equal to the component value',
    },
  ],
}

export const ResourcesDayViewStylesApi: StylesApiData<
  | 'resourcesDayView'
  | 'resourcesDayViewRoot'
  | 'resourcesDayViewInner'
  | 'resourcesDayViewTimeLabelsRow'
  | 'resourcesDayViewScrollArea'
  | 'resourcesDayViewCorner'
  | 'resourcesDayViewTimeLabel'
  | 'resourcesDayViewResourceLabel'
  | 'resourcesDayViewRow'
  | 'resourcesDayViewRowSlot'
  | 'resourcesDayViewRowSlots'
  | 'resourcesDayViewBackgroundEvent'
  | 'resourcesDayViewAllDayEvent'
  | 'resourcesDayViewCurrentTimeIndicator'
  | 'resourcesDayViewCurrentTimeIndicatorLine'
  | 'resourcesDayViewCurrentTimeIndicatorThumb'
  | 'resourcesDayViewCurrentTimeIndicatorTimeBubble'
  | 'resourcesDayViewEventWrapper'
  | 'resourcesDayViewResizeHandle'
  | 'resourcesDayViewGroupColumn'
  | 'resourcesDayViewGroupColumnEmpty'
  | 'moreEventsButton'
  | 'moreEventsList'
  | 'moreEventsDropdown'
  | 'header'
  | 'headerControl'
  | 'viewSelect'
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
> = {
  selectors: {
    resourcesDayView: 'Root element',
    resourcesDayViewRoot: 'Root container wrapping scroll area',
    resourcesDayViewInner: 'Inner container wrapping time labels and rows',
    resourcesDayViewTimeLabelsRow: 'Row containing time labels',
    resourcesDayViewScrollArea: 'Scroll area component',
    resourcesDayViewCorner: 'Top-left corner element',
    resourcesDayViewTimeLabel: 'Individual time label element',
    resourcesDayViewResourceLabel: 'Resource label element',
    resourcesDayViewRow: 'Resource row element',
    resourcesDayViewRowSlot: 'Individual time slot element',
    resourcesDayViewRowSlots: 'Container for all slots in a row',
    resourcesDayViewBackgroundEvent: 'Background event element',
    resourcesDayViewAllDayEvent: 'All-day event element',
    resourcesDayViewCurrentTimeIndicator: 'Current time indicator container',
    resourcesDayViewCurrentTimeIndicatorLine: 'Current time indicator line',
    resourcesDayViewCurrentTimeIndicatorThumb: 'Current time indicator thumb',
    resourcesDayViewCurrentTimeIndicatorTimeBubble: 'Current time indicator time bubble',
    resourcesDayViewEventWrapper: 'Event wrapper element',
    resourcesDayViewResizeHandle: 'Event resize handle element',
    resourcesDayViewGroupColumn: 'Group label column element',
    resourcesDayViewGroupColumnEmpty: 'Empty group column cell for ungrouped resources',
    moreEventsButton: 'More events button, part of MoreEvents',
    moreEventsList: 'More events list, part of MoreEvents',
    moreEventsDropdown: 'More events dropdown, part of MoreEvents',
    header: 'Header container, part of ScheduleHeader',
    headerControl: 'Header control element, part of ScheduleHeader',
    viewSelect: 'View select element, part of ScheduleHeader',
    monthYearSelectTarget: 'MonthYearSelect target button, part of ScheduleHeader',
    monthYearSelectDropdown: 'MonthYearSelect dropdown, part of ScheduleHeader',
    monthYearSelectControl: 'MonthYearSelect control, part of ScheduleHeader',
    monthYearSelectList: 'MonthYearSelect list, part of ScheduleHeader',
    monthYearSelectLabel: 'MonthYearSelect label, part of ScheduleHeader',
  },
  vars: {
    resourcesDayView: {
      '--resources-day-view-radius': 'Controls `border-radius` of the view',
      '--resources-day-view-slot-width': 'Controls `width` of each time slot column',
      '--resources-day-view-row-height': 'Controls `height` of each resource row',
      '--resources-day-view-group-label-width': 'Controls `width` of the group label column',
      '--_time-bubble-width': 'Controls the bubble width',
      '--bg-event-bg': 'Controls the event bg',
      '--bg-event-color': 'Controls the event color',
      '--event-color': 'Controls the color',
      '--indicator-left-offset': 'Controls the left offset',
    },
  },
  modifiers: [
    {
      modifier: 'data-hour-start',
      selector: 'resourcesDayViewRowSlot',
      condition: 'Slot is at the start of an hour',
    },
    {
      modifier: 'data-business-hours',
      selector: 'resourcesDayViewRowSlot',
      condition: '`highlightBusinessHours` is true and slot is within business hours',
    },
    {
      modifier: 'data-non-business-hours',
      selector: 'resourcesDayViewRowSlot',
      condition: '`highlightBusinessHours` is true and slot is outside business hours',
    },
    {
      modifier: 'data-drop-target',
      selector: 'resourcesDayViewRowSlot',
      condition: 'Slot is the current drag drop target',
    },
    {
      modifier: 'data-drag-selected',
      selector: 'resourcesDayViewRowSlot',
      condition: 'Slot is selected during drag-to-select',
    },
    {
      modifier: 'data-static',
      selector: 'resourcesDayView',
      condition: '`mode="static"` is set',
    },
    {
      modifier: 'data-scrolled',
      selector: 'resourcesDayViewTimeLabelsRow',
      condition: 'Scroll area is scrolled vertically',
    },
    {
      modifier: 'data-scrolled-x',
      selector: 'resourcesDayViewResourceLabel',
      condition: 'Scroll area is scrolled horizontally',
    },
    {
      modifier: 'data-resizing',
      selector: 'resourcesDayView',
      condition: 'An event is being resized',
    },
    {
      modifier: 'data-resizing',
      selector: 'resourcesDayViewEventWrapper',
      condition: 'This event is being resized',
    },
    {
      modifier: 'data-edge',
      selector: 'resourcesDayViewResizeHandle',
      condition: "Set to 'start' or 'end' based on resize handle position",
    },
    {
      modifier: 'data-active',
      selector: 'resourcesDayViewResizeHandle',
      condition: 'Resize handle is actively being dragged',
    },
    {
      modifier: 'data-event-interaction',
      selector: 'resourcesDayView',
    },
  ],
}

export const ResourcesMonthViewStylesApi: StylesApiData<
  | 'resourcesMonthView'
  | 'resourcesMonthViewRoot'
  | 'resourcesMonthViewScrollArea'
  | 'resourcesMonthViewDayLabelsRow'
  | 'resourcesMonthViewCorner'
  | 'resourcesMonthViewDayLabel'
  | 'resourcesMonthViewDayLabelWeekday'
  | 'resourcesMonthViewDayLabelNumber'
  | 'resourcesMonthViewRow'
  | 'resourcesMonthViewResourceLabel'
  | 'resourcesMonthViewRowSlots'
  | 'resourcesMonthViewCell'
  | 'resourcesMonthViewEventWrapper'
  | 'resourcesMonthViewResizeHandle'
  | 'resourcesMonthViewInner'
  | 'resourcesMonthViewGroupColumn'
  | 'resourcesMonthViewGroupColumnEmpty'
  | 'moreEventsButton'
  | 'moreEventsList'
  | 'moreEventsDropdown'
  | 'header'
  | 'headerControl'
  | 'viewSelect'
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
> = {
  selectors: {
    resourcesMonthView: 'Root element',
    resourcesMonthViewRoot: 'Root container wrapping scroll area',
    resourcesMonthViewScrollArea: 'Scroll area component',
    resourcesMonthViewDayLabelsRow: 'Row containing day labels',
    resourcesMonthViewCorner: 'Top-left corner element',
    resourcesMonthViewDayLabel: 'Individual day label element',
    resourcesMonthViewDayLabelWeekday: 'Weekday text inside day label',
    resourcesMonthViewDayLabelNumber: 'Day number inside day label',
    resourcesMonthViewRow: 'Resource row element',
    resourcesMonthViewResourceLabel: 'Resource label element',
    resourcesMonthViewRowSlots: 'Container for all day cells in a row',
    resourcesMonthViewCell: 'Individual day cell element',
    resourcesMonthViewEventWrapper: 'Event wrapper element',
    resourcesMonthViewResizeHandle: 'Event resize handle element',
    resourcesMonthViewInner: 'Inner container wrapping day labels and rows',
    resourcesMonthViewGroupColumn: 'Group label column element',
    resourcesMonthViewGroupColumnEmpty: 'Empty group column cell for ungrouped resources',
    moreEventsButton: 'More events button, part of MoreEvents',
    moreEventsList: 'More events list, part of MoreEvents',
    moreEventsDropdown: 'More events dropdown, part of MoreEvents',
    header: 'Header container, part of ScheduleHeader',
    headerControl: 'Header control element, part of ScheduleHeader',
    viewSelect: 'View select element, part of ScheduleHeader',
    monthYearSelectTarget: 'MonthYearSelect target button, part of ScheduleHeader',
    monthYearSelectDropdown: 'MonthYearSelect dropdown, part of ScheduleHeader',
    monthYearSelectControl: 'MonthYearSelect control, part of ScheduleHeader',
    monthYearSelectList: 'MonthYearSelect list, part of ScheduleHeader',
    monthYearSelectLabel: 'MonthYearSelect label, part of ScheduleHeader',
  },
  vars: {
    resourcesMonthView: {
      '--resources-month-view-radius': 'Controls `border-radius` of the view',
      '--resources-month-view-day-width': 'Controls `width` of each day column',
      '--resources-month-view-row-height': 'Controls `height` of each resource row',
      '--resources-month-view-group-label-width': 'Controls `width` of the group label column',
      '--event-color': 'Controls the event color',
    },
  },
  modifiers: [
    {
      modifier: 'data-weekend',
      selector: 'resourcesMonthViewDayLabel',
      condition: 'Day label represents a weekend day',
    },
    {
      modifier: 'data-today',
      selector: 'resourcesMonthViewDayLabel',
      condition: 'Day label represents today and `highlightToday` is true',
    },
    {
      modifier: 'data-weekend',
      selector: 'resourcesMonthViewCell',
      condition: 'Cell represents a weekend day',
    },
    {
      modifier: 'data-drop-target',
      selector: 'resourcesMonthViewCell',
      condition: 'Cell is the current drag drop target',
    },
    {
      modifier: 'data-drag-selected',
      selector: 'resourcesMonthViewCell',
      condition: 'Cell is selected during drag-to-select',
    },
    {
      modifier: 'data-static',
      selector: 'resourcesMonthViewCell',
      condition: '`mode="static"` is set',
    },
    {
      modifier: 'data-static',
      selector: 'resourcesMonthView',
      condition: '`mode="static"` is set',
    },
    {
      modifier: 'data-resizing',
      selector: 'resourcesMonthViewEventWrapper',
      condition: 'This event is being resized',
    },
    {
      modifier: 'data-active',
      selector: 'resourcesMonthViewResizeHandle',
      condition: 'Resize handle is actively being dragged',
    },
    {
      modifier: 'data-event-interaction',
      selector: 'resourcesMonthView',
    },
  ],
}

export const ResourcesScheduleStylesApi: StylesApiData<
  | 'root'
  | 'resourcesDayView'
  | 'resourcesDayViewRoot'
  | 'resourcesDayViewInner'
  | 'resourcesDayViewTimeLabelsRow'
  | 'resourcesDayViewScrollArea'
  | 'resourcesDayViewCorner'
  | 'resourcesDayViewTimeLabel'
  | 'resourcesDayViewResourceLabel'
  | 'resourcesDayViewRow'
  | 'resourcesDayViewRowSlot'
  | 'resourcesDayViewRowSlots'
  | 'resourcesDayViewBackgroundEvent'
  | 'resourcesDayViewAllDayEvent'
  | 'resourcesDayViewCurrentTimeIndicator'
  | 'resourcesDayViewCurrentTimeIndicatorLine'
  | 'resourcesDayViewCurrentTimeIndicatorThumb'
  | 'resourcesDayViewCurrentTimeIndicatorTimeBubble'
  | 'resourcesDayViewEventWrapper'
  | 'resourcesDayViewResizeHandle'
  | 'resourcesDayViewGroupColumn'
  | 'resourcesDayViewGroupColumnEmpty'
  | 'resourcesWeekView'
  | 'resourcesWeekViewRoot'
  | 'resourcesWeekViewInner'
  | 'resourcesWeekViewHeaderRows'
  | 'resourcesWeekViewHeaderContent'
  | 'resourcesWeekViewDayLabelsRow'
  | 'resourcesWeekViewDayLabel'
  | 'resourcesWeekViewTimeLabelsRow'
  | 'resourcesWeekViewScrollArea'
  | 'resourcesWeekViewCorner'
  | 'resourcesWeekViewTimeLabel'
  | 'resourcesWeekViewResourceLabel'
  | 'resourcesWeekViewRow'
  | 'resourcesWeekViewRowSlot'
  | 'resourcesWeekViewRowSlots'
  | 'resourcesWeekViewBackgroundEvent'
  | 'resourcesWeekViewAllDayEvent'
  | 'resourcesWeekViewCurrentTimeIndicator'
  | 'resourcesWeekViewCurrentTimeIndicatorLine'
  | 'resourcesWeekViewCurrentTimeIndicatorThumb'
  | 'resourcesWeekViewCurrentTimeIndicatorTimeBubble'
  | 'resourcesWeekViewEventWrapper'
  | 'resourcesWeekViewResizeHandle'
  | 'resourcesWeekViewGroupColumn'
  | 'resourcesWeekViewGroupColumnEmpty'
  | 'resourcesMonthView'
  | 'resourcesMonthViewRoot'
  | 'resourcesMonthViewScrollArea'
  | 'resourcesMonthViewDayLabelsRow'
  | 'resourcesMonthViewCorner'
  | 'resourcesMonthViewDayLabel'
  | 'resourcesMonthViewDayLabelWeekday'
  | 'resourcesMonthViewDayLabelNumber'
  | 'resourcesMonthViewRow'
  | 'resourcesMonthViewResourceLabel'
  | 'resourcesMonthViewRowSlots'
  | 'resourcesMonthViewCell'
  | 'resourcesMonthViewInner'
  | 'resourcesMonthViewGroupColumn'
  | 'resourcesMonthViewGroupColumnEmpty'
  | 'moreEventsButton'
  | 'moreEventsList'
  | 'moreEventsDropdown'
  | 'header'
  | 'headerControl'
  | 'viewSelect'
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
> = {
  selectors: {
    root: 'Root element',
    resourcesDayView: 'ResourcesDayView root element',
    resourcesDayViewRoot: 'ResourcesDayView root container',
    resourcesDayViewInner: 'ResourcesDayView inner container',
    resourcesDayViewTimeLabelsRow: 'ResourcesDayView time labels row',
    resourcesDayViewScrollArea: 'ResourcesDayView scroll area',
    resourcesDayViewCorner: 'ResourcesDayView top-left corner',
    resourcesDayViewTimeLabel: 'ResourcesDayView time label',
    resourcesDayViewResourceLabel: 'ResourcesDayView resource label',
    resourcesDayViewRow: 'ResourcesDayView resource row',
    resourcesDayViewRowSlot: 'ResourcesDayView time slot',
    resourcesDayViewRowSlots: 'ResourcesDayView slots container',
    resourcesDayViewBackgroundEvent: 'ResourcesDayView background event',
    resourcesDayViewAllDayEvent: 'ResourcesDayView all-day event',
    resourcesDayViewCurrentTimeIndicator: 'ResourcesDayView current time indicator container',
    resourcesDayViewCurrentTimeIndicatorLine: 'ResourcesDayView current time indicator line',
    resourcesDayViewCurrentTimeIndicatorThumb: 'ResourcesDayView current time indicator thumb',
    resourcesDayViewCurrentTimeIndicatorTimeBubble:
      'ResourcesDayView current time indicator time bubble',
    resourcesDayViewEventWrapper: 'ResourcesDayView event wrapper',
    resourcesDayViewResizeHandle: 'ResourcesDayView event resize handle',
    resourcesDayViewGroupColumn: 'ResourcesDayView group label column',
    resourcesDayViewGroupColumnEmpty: 'ResourcesDayView empty group column cell',
    resourcesWeekView: 'ResourcesWeekView root element',
    resourcesWeekViewRoot: 'ResourcesWeekView root container',
    resourcesWeekViewInner: 'ResourcesWeekView inner container',
    resourcesWeekViewHeaderRows: 'ResourcesWeekView header rows container',
    resourcesWeekViewHeaderContent: 'ResourcesWeekView header content container',
    resourcesWeekViewDayLabelsRow: 'ResourcesWeekView day labels row',
    resourcesWeekViewDayLabel: 'ResourcesWeekView day label',
    resourcesWeekViewTimeLabelsRow: 'ResourcesWeekView time labels row',
    resourcesWeekViewScrollArea: 'ResourcesWeekView scroll area',
    resourcesWeekViewCorner: 'ResourcesWeekView top-left corner',
    resourcesWeekViewTimeLabel: 'ResourcesWeekView time label',
    resourcesWeekViewResourceLabel: 'ResourcesWeekView resource label',
    resourcesWeekViewRow: 'ResourcesWeekView resource row',
    resourcesWeekViewRowSlot: 'ResourcesWeekView time slot',
    resourcesWeekViewRowSlots: 'ResourcesWeekView slots container',
    resourcesWeekViewBackgroundEvent: 'ResourcesWeekView background event',
    resourcesWeekViewAllDayEvent: 'ResourcesWeekView all-day event',
    resourcesWeekViewCurrentTimeIndicator: 'ResourcesWeekView current time indicator container',
    resourcesWeekViewCurrentTimeIndicatorLine: 'ResourcesWeekView current time indicator line',
    resourcesWeekViewCurrentTimeIndicatorThumb: 'ResourcesWeekView current time indicator thumb',
    resourcesWeekViewCurrentTimeIndicatorTimeBubble:
      'ResourcesWeekView current time indicator time bubble',
    resourcesWeekViewEventWrapper: 'ResourcesWeekView event wrapper',
    resourcesWeekViewResizeHandle: 'ResourcesWeekView event resize handle',
    resourcesWeekViewGroupColumn: 'ResourcesWeekView group label column',
    resourcesWeekViewGroupColumnEmpty: 'ResourcesWeekView empty group column cell',
    resourcesMonthView: 'ResourcesMonthView root element',
    resourcesMonthViewRoot: 'ResourcesMonthView root container',
    resourcesMonthViewScrollArea: 'ResourcesMonthView scroll area',
    resourcesMonthViewDayLabelsRow: 'ResourcesMonthView day labels row',
    resourcesMonthViewCorner: 'ResourcesMonthView top-left corner',
    resourcesMonthViewDayLabel: 'ResourcesMonthView day label',
    resourcesMonthViewDayLabelWeekday: 'ResourcesMonthView weekday text inside day label',
    resourcesMonthViewDayLabelNumber: 'ResourcesMonthView day number inside day label',
    resourcesMonthViewRow: 'ResourcesMonthView resource row',
    resourcesMonthViewResourceLabel: 'ResourcesMonthView resource label',
    resourcesMonthViewRowSlots: 'ResourcesMonthView day cells container',
    resourcesMonthViewCell: 'ResourcesMonthView day cell',
    resourcesMonthViewInner: 'ResourcesMonthView inner container',
    resourcesMonthViewGroupColumn: 'ResourcesMonthView group label column',
    resourcesMonthViewGroupColumnEmpty: 'ResourcesMonthView empty group column cell',
    moreEventsButton: 'More events button, part of MoreEvents',
    moreEventsList: 'More events list, part of MoreEvents',
    moreEventsDropdown: 'More events dropdown, part of MoreEvents',
    header: 'ScheduleHeader container',
    headerControl: 'ScheduleHeader control element',
    viewSelect: 'ViewSelect element',
    monthYearSelectTarget: 'MonthYearSelect target button',
    monthYearSelectDropdown: 'MonthYearSelect dropdown',
    monthYearSelectControl: 'MonthYearSelect control',
    monthYearSelectList: 'MonthYearSelect list',
    monthYearSelectLabel: 'MonthYearSelect label',
  },
  vars: {},
}

export const ResourcesWeekViewStylesApi: StylesApiData<
  | 'resourcesWeekView'
  | 'resourcesWeekViewRoot'
  | 'resourcesWeekViewInner'
  | 'resourcesWeekViewHeaderRows'
  | 'resourcesWeekViewHeaderContent'
  | 'resourcesWeekViewDayLabelsRow'
  | 'resourcesWeekViewDayLabel'
  | 'resourcesWeekViewTimeLabelsRow'
  | 'resourcesWeekViewScrollArea'
  | 'resourcesWeekViewCorner'
  | 'resourcesWeekViewTimeLabel'
  | 'resourcesWeekViewResourceLabel'
  | 'resourcesWeekViewRow'
  | 'resourcesWeekViewRowSlot'
  | 'resourcesWeekViewRowSlots'
  | 'resourcesWeekViewBackgroundEvent'
  | 'resourcesWeekViewAllDayEvent'
  | 'resourcesWeekViewCurrentTimeIndicator'
  | 'resourcesWeekViewCurrentTimeIndicatorLine'
  | 'resourcesWeekViewCurrentTimeIndicatorThumb'
  | 'resourcesWeekViewCurrentTimeIndicatorTimeBubble'
  | 'resourcesWeekViewEventWrapper'
  | 'resourcesWeekViewResizeHandle'
  | 'resourcesWeekViewGroupColumn'
  | 'resourcesWeekViewGroupColumnEmpty'
  | 'moreEventsButton'
  | 'moreEventsList'
  | 'moreEventsDropdown'
  | 'header'
  | 'headerControl'
  | 'viewSelect'
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
> = {
  selectors: {
    resourcesWeekView: 'Root element',
    resourcesWeekViewRoot: 'Root container wrapping scroll area',
    resourcesWeekViewInner: 'Inner container wrapping header rows and resource rows',
    resourcesWeekViewHeaderRows: 'Container for header rows (corner, day labels, time labels)',
    resourcesWeekViewHeaderContent: 'Container for day labels and time labels rows',
    resourcesWeekViewDayLabelsRow: 'Row containing day labels',
    resourcesWeekViewDayLabel: 'Individual day label element',
    resourcesWeekViewTimeLabelsRow: 'Row containing time labels',
    resourcesWeekViewScrollArea: 'Scroll area component',
    resourcesWeekViewCorner: 'Top-left corner element',
    resourcesWeekViewTimeLabel: 'Individual time label element',
    resourcesWeekViewResourceLabel: 'Resource label element',
    resourcesWeekViewRow: 'Resource row element',
    resourcesWeekViewRowSlot: 'Individual time slot element',
    resourcesWeekViewRowSlots: 'Container for all slots in a row',
    resourcesWeekViewBackgroundEvent: 'Background event element',
    resourcesWeekViewAllDayEvent: 'All-day event element',
    resourcesWeekViewCurrentTimeIndicator: 'Current time indicator container',
    resourcesWeekViewCurrentTimeIndicatorLine: 'Current time indicator line',
    resourcesWeekViewCurrentTimeIndicatorThumb: 'Current time indicator thumb',
    resourcesWeekViewCurrentTimeIndicatorTimeBubble: 'Current time indicator time bubble',
    resourcesWeekViewEventWrapper: 'Event wrapper element',
    resourcesWeekViewResizeHandle: 'Event resize handle element',
    resourcesWeekViewGroupColumn: 'Group label column element',
    resourcesWeekViewGroupColumnEmpty: 'Empty group column cell for ungrouped resources',
    moreEventsButton: 'More events button, part of MoreEvents',
    moreEventsList: 'More events list, part of MoreEvents',
    moreEventsDropdown: 'More events dropdown, part of MoreEvents',
    header: 'Header container, part of ScheduleHeader',
    headerControl: 'Header control element, part of ScheduleHeader',
    viewSelect: 'View select element, part of ScheduleHeader',
    monthYearSelectTarget: 'MonthYearSelect target button, part of ScheduleHeader',
    monthYearSelectDropdown: 'MonthYearSelect dropdown, part of ScheduleHeader',
    monthYearSelectControl: 'MonthYearSelect control, part of ScheduleHeader',
    monthYearSelectList: 'MonthYearSelect list, part of ScheduleHeader',
    monthYearSelectLabel: 'MonthYearSelect label, part of ScheduleHeader',
  },
  vars: {
    resourcesWeekView: {
      '--resources-week-view-radius': 'Controls `border-radius` of the view',
      '--resources-week-view-slot-width': 'Controls `width` of each time slot column',
      '--resources-week-view-row-height': 'Controls `height` of each resource row',
      '--resources-week-view-group-label-width': 'Controls `width` of the group label column',
      '--_time-bubble-width': 'Controls the bubble width',
      '--bg-event-bg': 'Controls the event bg',
      '--bg-event-color': 'Controls the event color',
      '--event-color': 'Controls the color',
      '--indicator-left-offset': 'Controls the left offset',
    },
  },
  modifiers: [
    {
      modifier: 'data-hour-start',
      selector: 'resourcesWeekViewRowSlot',
      condition: 'Slot is at the start of an hour',
    },
    {
      modifier: 'data-business-hours',
      selector: 'resourcesWeekViewRowSlot',
      condition: '`highlightBusinessHours` is true and slot is within business hours',
    },
    {
      modifier: 'data-non-business-hours',
      selector: 'resourcesWeekViewRowSlot',
      condition: '`highlightBusinessHours` is true and slot is outside business hours',
    },
    {
      modifier: 'data-drop-target',
      selector: 'resourcesWeekViewRowSlot',
      condition: 'Slot is the current drag drop target',
    },
    {
      modifier: 'data-drag-selected',
      selector: 'resourcesWeekViewRowSlot',
      condition: 'Slot is selected during drag-to-select',
    },
    {
      modifier: 'data-static',
      selector: 'resourcesWeekView',
      condition: '`mode="static"` is set',
    },
    {
      modifier: 'data-scrolled',
      selector: 'resourcesWeekViewTimeLabelsRow',
      condition: 'Scroll area is scrolled vertically',
    },
    {
      modifier: 'data-scrolled-x',
      selector: 'resourcesWeekViewResourceLabel',
      condition: 'Scroll area is scrolled horizontally',
    },
    {
      modifier: 'data-today',
      selector: 'resourcesWeekViewDayLabel',
      condition: 'Day label represents today and `highlightToday` is true',
    },
    {
      modifier: 'data-weekend',
      selector: 'resourcesWeekViewDayLabel',
      condition: 'Day label represents a weekend day',
    },
    {
      modifier: 'data-active',
      selector: 'resourcesWeekViewEventWrapper',
    },
    {
      modifier: 'data-event-interaction',
      selector: 'resourcesWeekView',
    },
    {
      modifier: 'data-resizing',
      selector: 'resourcesWeekView',
    },
  ],
}

export const RichTextEditorStylesApi: StylesApiData<
  | 'content'
  | 'control'
  | 'controlIcon'
  | 'controlsGroup'
  | 'linkEditor'
  | 'linkEditorDropdown'
  | 'linkEditorExternalControl'
  | 'linkEditorInput'
  | 'linkEditorSave'
  | 'root'
  | 'tableInsertCell'
  | 'tableInsertDropdown'
  | 'tableInsertGrid'
  | 'tableInsertLabel'
  | 'toolbar'
  | 'Typography'
> = {
  selectors: {
    content: 'Content area',
    control: 'RichTextEditor.Control root element, used as a base for all controls',
    controlIcon: 'Control icon element',
    controlsGroup: 'RichTextEditor.ControlsGroup component root',
    linkEditor: 'Link editor root element',
    linkEditorDropdown: 'Link editor popover dropdown element',
    linkEditorExternalControl: 'Link editor external button',
    linkEditorInput: 'Link editor url input',
    linkEditorSave: 'Link editor save button',
    root: 'Root element',
    tableInsertCell: 'Individual cell in the table insert picker',
    tableInsertDropdown: 'Table insert picker dropdown',
    tableInsertGrid: 'Table insert picker grid',
    tableInsertLabel: 'Selected table dimensions label',
    toolbar: 'Toolbar element',
    Typography: 'Typography component, wraps content',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'control',
      condition: 'Control is active',
    },
  ],
}

export const RingProgressStylesApi: StylesApiData<'curve' | 'label' | 'root' | 'svg'> = {
  selectors: {
    curve: 'Individual ring section (circle element)',
    label: 'Label displayed in the center of the ring',
    root: 'Root container element',
    svg: 'SVG element containing all ring sections',
  },
  vars: {
    root: {
      '--rp-label-offset': 'Controls horizontal spacing between label and ring edges',
      '--rp-size': 'Controls width and height of the entire component',
      '--rp-transition-duration': 'Controls animation duration for value and color changes',
    },
    svg: {
      '--rp-start-angle': 'Controls the starting angle of the progress ring in degrees',
    },
  },
}

export const RollingNumberStylesApi: StylesApiData<
  'char' | 'copyValue' | 'digit' | 'digitColumn' | 'root'
> = {
  selectors: {
    char: 'char element',
    copyValue: 'Visually hidden copyable value element',
    digit: 'digit element',
    digitColumn: 'digit column element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--rn-duration': 'Controls the duration',
      '--rn-timing-function': 'Controls the timing function',
    },
  },
}

export const SankeyChartStylesApi: StylesApiData<'container' | 'root'> = {
  selectors: {
    container: 'container element',
    root: 'Root element',
  },
  vars: {},
}

export const ScatterChartStylesApi: StylesApiData<
  | 'root'
  | 'scatter'
  | 'axis'
  | 'container'
  | 'grid'
  | 'legend'
  | 'legendItem'
  | 'legendItemColor'
  | 'legendItemName'
  | 'tooltip'
  | 'tooltipBody'
  | 'tooltipItem'
  | 'tooltipItemBody'
  | 'tooltipItemColor'
  | 'tooltipItemName'
  | 'tooltipItemData'
  | 'tooltipLabel'
  | 'referenceLine'
  | 'axisLabel'
> = {
  selectors: {
    root: 'Root element',
    scatter: 'recharts Scatter component',
    axis: 'X and Y axis of the chart',
    container: 'Recharts ResponsiveContainer component',
    grid: 'Recharts CartesianGrid component',
    legend: 'Legend root element',
    legendItem: 'Legend item representing data series',
    legendItemColor: 'Legend item color',
    legendItemName: 'Legend item name',
    tooltip: 'Tooltip root element',
    tooltipBody: 'Tooltip wrapper around all items',
    tooltipItem: 'Tooltip item representing data series',
    tooltipItemBody: 'Tooltip item wrapper around item color and name',
    tooltipItemColor: 'Tooltip item color',
    tooltipItemName: 'Tooltip item name',
    tooltipItemData: 'Tooltip item data',
    tooltipLabel: 'Label of the tooltip',
    referenceLine: 'Reference line',
    axisLabel: 'X and Y axis labels',
  },
  vars: {
    root: {
      '--chart-grid-color': 'Controls color of the grid and cursor lines',
      '--chart-text-color': 'Controls color of the axis labels',
    },
  },
}

export const ScheduleStylesApi: StylesApiData<
  | 'root'
  | 'desktopView'
  | 'mobileView'
  | 'dayView'
  | 'dayViewInner'
  | 'dayViewScrollArea'
  | 'dayViewAllDay'
  | 'dayViewAllDayEvents'
  | 'dayViewSlot'
  | 'dayViewSlots'
  | 'dayViewTimeSlots'
  | 'dayViewSlotLabel'
  | 'dayViewSlotLabels'
  | 'dayViewBackgroundEvent'
  | 'weekView'
  | 'weekViewRoot'
  | 'weekViewHeader'
  | 'weekViewInner'
  | 'weekViewAllDaySlotsEvents'
  | 'weekViewAllDaySlots'
  | 'weekViewAllDaySlotsList'
  | 'weekViewAllDaySlot'
  | 'weekViewAllDaySlotsLabel'
  | 'weekViewScrollArea'
  | 'weekViewCorner'
  | 'weekViewSlotLabels'
  | 'weekViewSlotLabel'
  | 'weekViewDayLabel'
  | 'weekViewDayWeekday'
  | 'weekViewDay'
  | 'weekViewDayNumber'
  | 'weekViewDaySlot'
  | 'weekViewDaySlots'
  | 'weekViewWeekLabel'
  | 'weekViewWeekNumber'
  | 'weekViewBackgroundEvent'
  | 'monthView'
  | 'monthViewScrollArea'
  | 'monthViewInner'
  | 'monthViewWeek'
  | 'monthViewDay'
  | 'monthViewDayLabel'
  | 'monthViewWeekNumber'
  | 'monthViewWeekday'
  | 'monthViewWeekdays'
  | 'monthViewWeekdaysCorner'
  | 'monthViewEvents'
  | 'monthViewBackgroundEvent'
  | 'yearView'
  | 'yearViewMonths'
  | 'yearViewMonth'
  | 'yearViewWeekday'
  | 'yearViewDay'
  | 'yearViewWeek'
  | 'yearViewWeekNumber'
  | 'yearViewWeekdays'
  | 'yearViewWeekdaysCorner'
  | 'yearViewMonthCaption'
  | 'yearViewDayIndicators'
  | 'yearViewDayIndicator'
  | 'mobileMonthView'
  | 'mobileMonthViewCalendar'
  | 'mobileMonthViewWeekdays'
  | 'mobileMonthViewWeekday'
  | 'mobileMonthViewWeekdaysCorner'
  | 'mobileMonthViewWeek'
  | 'mobileMonthViewWeekNumber'
  | 'mobileMonthViewDay'
  | 'mobileMonthViewDayIndicators'
  | 'mobileMonthViewDayIndicator'
  | 'mobileMonthViewEventsList'
  | 'mobileMonthViewEventsHeader'
  | 'mobileMonthViewHeader'
  | 'mobileMonthViewHeaderBackButton'
  | 'mobileMonthViewHeaderLabel'
  | 'mobileMonthViewEvent'
  | 'mobileMonthViewEventBody'
  | 'mobileMonthViewEventTitle'
  | 'mobileMonthViewEventTime'
  | 'mobileMonthViewEventColor'
  | 'mobileMonthViewNoEvents'
  | 'header'
  | 'headerControl'
  | 'viewSelect'
  | 'monthYearSelectTarget'
  | 'monthYearSelectDropdown'
  | 'monthYearSelectControl'
  | 'monthYearSelectList'
  | 'monthYearSelectLabel'
  | 'event'
  | 'eventInner'
  | 'eventResizeHandle'
  | 'moreEventsButton'
  | 'moreEventsList'
  | 'moreEventsDropdown'
  | 'currentTimeIndicator'
  | 'currentTimeIndicatorLine'
  | 'currentTimeIndicatorThumb'
  | 'currentTimeIndicatorTimeBubble'
  | 'agendaView'
  | 'agendaViewHeader'
  | 'agendaViewHeaderLabel'
  | 'agendaViewBody'
  | 'agendaViewDateGroup'
  | 'agendaViewDateHeader'
  | 'agendaViewEvent'
  | 'agendaViewEventBody'
  | 'agendaViewEventColor'
  | 'agendaViewEventTitle'
  | 'agendaViewEventTime'
  | 'agendaViewNoEvents'
> = {
  selectors: {
    root: 'Root element',
    desktopView: 'Desktop view container (visible on large screens when layout="responsive")',
    mobileView: 'Mobile view container (visible on small screens when layout="responsive")',
    dayView: 'DayView root element',
    dayViewInner: 'DayView inner container',
    dayViewScrollArea: 'DayView scroll area component',
    dayViewAllDay: 'DayView all-day events container',
    dayViewAllDayEvents: 'DayView all-day events wrapper',
    dayViewSlot: 'DayView individual time slot',
    dayViewSlots: 'DayView slots container',
    dayViewTimeSlots: 'DayView time slots container',
    dayViewSlotLabel: 'DayView time slot label',
    dayViewSlotLabels: 'DayView slot labels container',
    dayViewBackgroundEvent: 'DayView background event element',
    weekView: 'WeekView root element',
    weekViewRoot: 'WeekView root container',
    weekViewHeader: 'WeekView header row',
    weekViewInner: 'WeekView inner container',
    weekViewAllDaySlotsEvents: 'WeekView all-day events container',
    weekViewAllDaySlots: 'WeekView all-day slots container',
    weekViewAllDaySlotsList: 'WeekView all-day slots list',
    weekViewAllDaySlot: 'WeekView individual all-day slot',
    weekViewAllDaySlotsLabel: 'WeekView all-day slots label',
    weekViewScrollArea: 'WeekView scroll area',
    weekViewCorner: 'WeekView top-left corner',
    weekViewSlotLabels: 'WeekView slot labels container',
    weekViewSlotLabel: 'WeekView individual slot label',
    weekViewDayLabel: 'WeekView day label',
    weekViewDayWeekday: 'WeekView weekday label',
    weekViewDay: 'WeekView day column',
    weekViewDayNumber: 'WeekView day number',
    weekViewDaySlot: 'WeekView individual day slot',
    weekViewDaySlots: 'WeekView day slots container',
    weekViewWeekLabel: 'WeekView week label',
    weekViewWeekNumber: 'WeekView week number',
    weekViewBackgroundEvent: 'WeekView background event element',
    monthView: 'MonthView root element',
    monthViewScrollArea: 'MonthView scroll area wrapper',
    monthViewInner: 'MonthView inner container',
    monthViewWeek: 'MonthView week row',
    monthViewDay: 'MonthView day cell',
    monthViewDayLabel: 'MonthView day number label',
    monthViewWeekNumber: 'MonthView week number',
    monthViewWeekday: 'MonthView weekday name',
    monthViewWeekdays: 'MonthView weekdays row',
    monthViewWeekdaysCorner: 'MonthView top-left corner',
    monthViewEvents: 'MonthView events container',
    monthViewBackgroundEvent: 'MonthView background event element',
    yearView: 'YearView root element',
    yearViewMonths: 'YearView months container',
    yearViewMonth: 'YearView individual month',
    yearViewWeekday: 'YearView weekday name',
    yearViewDay: 'YearView day cell',
    yearViewWeek: 'YearView week row',
    yearViewWeekNumber: 'YearView week number',
    yearViewWeekdays: 'YearView weekdays row',
    yearViewWeekdaysCorner: 'YearView top-left corner',
    yearViewMonthCaption: 'YearView month caption',
    yearViewDayIndicators: 'YearView day indicators container',
    yearViewDayIndicator: 'YearView individual day indicator',
    mobileMonthView: 'MobileMonthView root element',
    mobileMonthViewCalendar: 'MobileMonthView calendar grid',
    mobileMonthViewWeekdays: 'MobileMonthView weekdays row',
    mobileMonthViewWeekday: 'MobileMonthView individual weekday',
    mobileMonthViewWeekdaysCorner: 'MobileMonthView weekdays corner (for week numbers)',
    mobileMonthViewWeek: 'MobileMonthView week row',
    mobileMonthViewWeekNumber: 'MobileMonthView week number',
    mobileMonthViewDay: 'MobileMonthView day cell',
    mobileMonthViewDayIndicators: 'MobileMonthView day indicators container',
    mobileMonthViewDayIndicator: 'MobileMonthView individual day indicator',
    mobileMonthViewEventsList: 'MobileMonthView events list container',
    mobileMonthViewEventsHeader: 'MobileMonthView events list header',
    mobileMonthViewHeader: 'MobileMonthView header with back button and label',
    mobileMonthViewHeaderBackButton: 'MobileMonthView header back button',
    mobileMonthViewHeaderLabel: 'MobileMonthView header month/year label',
    mobileMonthViewEvent: 'MobileMonthView event item',
    mobileMonthViewEventBody: 'MobileMonthView event body button',
    mobileMonthViewEventTitle: 'MobileMonthView event title',
    mobileMonthViewEventTime: 'MobileMonthView event time label',
    mobileMonthViewEventColor: 'MobileMonthView event color indicator',
    mobileMonthViewNoEvents: 'MobileMonthView no events message',
    header: 'ScheduleHeader container',
    headerControl: 'ScheduleHeader control element',
    viewSelect: 'ViewSelect element',
    monthYearSelectTarget: 'MonthYearSelect target button',
    monthYearSelectDropdown: 'MonthYearSelect dropdown',
    monthYearSelectControl: 'MonthYearSelect control',
    monthYearSelectList: 'MonthYearSelect list',
    monthYearSelectLabel: 'MonthYearSelect label',
    event: 'ScheduleEvent element',
    eventInner: 'ScheduleEvent inner element',
    eventResizeHandle: 'ScheduleEvent resize handle element',
    moreEventsButton: 'MoreEvents button',
    moreEventsList: 'MoreEvents list',
    moreEventsDropdown: 'MoreEvents dropdown',
    currentTimeIndicator: 'CurrentTimeIndicator container',
    currentTimeIndicatorLine: 'CurrentTimeIndicator line',
    currentTimeIndicatorThumb: 'CurrentTimeIndicator thumb',
    currentTimeIndicatorTimeBubble: 'CurrentTimeIndicator time bubble',
    agendaView: 'AgendaView root element, shown when agenda is open',
    agendaViewHeader: 'AgendaView header container',
    agendaViewHeaderLabel: 'AgendaView date range label',
    agendaViewBody: 'AgendaView body container',
    agendaViewDateGroup: 'AgendaView date group container',
    agendaViewDateHeader: 'AgendaView date header text',
    agendaViewEvent: 'AgendaView event item button',
    agendaViewEventBody: 'AgendaView event body container',
    agendaViewEventColor: 'AgendaView event color indicator',
    agendaViewEventTitle: 'AgendaView event title text',
    agendaViewEventTime: 'AgendaView event time label',
    agendaViewNoEvents: 'AgendaView no events message',
  },
  vars: {},
}

export const ScrollAreaStylesApi: StylesApiData<
  'content' | 'corner' | 'root' | 'scrollbar' | 'thumb' | 'viewport'
> = {
  selectors: {
    content: 'Wraps component children',
    corner: 'Corner between horizontal and vertical scrollbars',
    root: 'Root element',
    scrollbar: 'Horizontal or vertical scrollbar root',
    thumb: 'Scrollbar thumb',
    viewport: 'Main scrollable area',
  },
  vars: {
    root: {
      '--scrollarea-over-scroll-behavior': 'Controls the over scroll behavior',
      '--scrollarea-scrollbar-size': 'Scrollbar size',
    },
  },
  modifiers: [
    {
      modifier: 'data-hidden',
      selector: ['scrollbar', 'corner'],
      condition: 'type="never"',
    },
    {
      modifier: 'data-hovered',
      selector: 'corner',
      condition: 'One of the scrollbars is hovered',
    },
    {
      modifier: 'data-orientation',
      selector: 'scrollbar',
      value: '"horizontal" or "vertical" depending on scrollbar position',
    },
  ],
}

export const ScrollerStylesApi: StylesApiData<
  'chevron' | 'container' | 'content' | 'control' | 'root'
> = {
  selectors: {
    chevron: 'Chevron icon inside controls',
    container: 'Scrollable container',
    content: 'Wraps component children',
    control: 'Start and end scroll control buttons',
    root: 'Root element',
  },
  vars: {
    root: {
      '--scroller-background-color': 'Background color for the control edge gradients',
      '--scroller-control-size': 'Controls width and chevron size',
    },
  },
  modifiers: [
    {
      modifier: 'data-draggable',
      selector: 'container',
      condition: '`draggable` prop is set',
    },
    {
      modifier: 'data-position',
      selector: 'control',
      value: '"start" or "end" depending on control position',
    },
    {
      modifier: 'data-hidden',
      selector: 'control',
      condition: 'Control is hidden because scrolling is not available in that direction',
    },
  ],
}

export const SegmentedControlStylesApi: StylesApiData<
  'control' | 'indicator' | 'innerLabel' | 'input' | 'label' | 'root'
> = {
  selectors: {
    control: 'Wrapper element for input and label',
    indicator: 'Floating indicator that moves between items',
    innerLabel: 'Wrapper of label element children',
    input: 'Input element (`input[type="radio"]`), hidden by default',
    label: 'Label element associated with input',
    root: 'Root element',
  },
  vars: {
    root: {
      '--sc-color': 'Control `background-color` of `indicator`',
      '--sc-font-size': 'Controls `font-size` of labels',
      '--sc-label-color': 'Controls the label color',
      '--sc-padding': 'Controls `padding` of control',
      '--sc-radius': 'Controls `border-radius` of `indicator` and `root` elements',
      '--sc-shadow': 'Controls `box-shadow` of indicator',
      '--sc-transition-duration':
        'Controls `transition-duration` of various elements that have animations',
      '--sc-transition-timing-function':
        'Controls `transition-timing-function` of various elements that have animations',
    },
  },
  modifiers: [
    {
      modifier: 'data-full-width',
      selector: 'root',
      condition: '`fullWidth` prop is set',
    },
    {
      modifier: 'data-with-items-borders',
      selector: 'root',
      condition: '`withItemsBorders` prop is not `false`',
    },
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: 'Value of `disabled` prop',
    },
    {
      modifier: 'data-orientation',
      selector: 'control',
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-active',
      selector: ['label', 'control'],
      condition: 'Associated input is checked',
    },
    {
      modifier: 'data-disabled',
      selector: 'label',
      condition: 'Associated input is disabled',
    },
    {
      modifier: 'data-read-only',
      selector: 'label',
      condition: '`readOnly` prop is set',
    },
  ],
}

export const SelectStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'empty'
  | 'group'
  | 'groupLabel'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    dropdown: 'Dropdown root element',
    options: 'Options wrapper',
    option: 'Option',
    empty: 'Nothing found message',
    group: 'Options group wrapper',
    groupLabel: 'Options group label',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: 'Options was activated by keyboard',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: 'Option is disabled',
    },
  ],
}

export const SemiCircleProgressStylesApi: StylesApiData<
  'emptySegment' | 'filledSegment' | 'label' | 'root' | 'svg'
> = {
  selectors: {
    emptySegment: 'Empty circle segment',
    filledSegment: 'Filled circle segment',
    label: 'Label element',
    root: 'Root element',
    svg: 'Root svg element',
  },
  vars: {
    root: {
      '--scp-empty-segment-color': 'Color of the empty segment',
      '--scp-filled-segment-color': 'Color of the filled segment',
      '--scp-rotation':
        'Transform styles of the svg, controlled by `orientation` and `fillDirection` props',
      '--scp-thickness': 'Controls `strokeWidth` of the circle',
      '--scp-transition-duration': 'Controls transition duration of the filled segment',
    },
  },
  modifiers: [
    {
      selector: 'label',
      modifier: 'data-position',
      value: 'Value of `labelPosition` prop',
    },
    {
      selector: 'label',
      modifier: 'data-orientation',
      value: 'Value of `orientation` prop',
    },
  ],
}

export const SimpleGridStylesApi: StylesApiData<'container' | 'root'> = {
  selectors: {
    container: 'Container element, available only when `type="container"` is set',
    root: 'Root element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-auto-cols',
      selector: 'root',
    },
  ],
}

export const SkeletonStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--skeleton-height': 'Controls skeleton `height`',
      '--skeleton-radius': 'Controls skeleton `border-radius`',
      '--skeleton-width': 'Controls skeleton `width`',
    },
  },
  modifiers: [
    {
      modifier: 'data-visible',
      selector: 'root',
      condition: '`visible` prop is set',
    },
    {
      modifier: 'data-animate',
      selector: 'root',
      condition: '`animate` prop is set',
    },
  ],
}

export const SliderStylesApi: StylesApiData<
  | 'bar'
  | 'label'
  | 'mark'
  | 'markLabel'
  | 'markWrapper'
  | 'root'
  | 'thumb'
  | 'track'
  | 'trackContainer'
> = {
  selectors: {
    bar: 'Track filled part',
    label: 'Thumb label',
    mark: 'Mark displayed on track',
    markLabel: 'Label of the associated mark, displayed below track',
    markWrapper: 'Contains `mark` and `markLabel` elements',
    root: 'Root element',
    thumb: 'Thumb element',
    track: 'Slider track',
    trackContainer: 'Wraps track element',
  },
  vars: {
    root: {
      '--slider-color': 'Controls filled track, thumb and marks `background`',
      '--slider-radius': 'Controls `border-radius` of track and thumb',
      '--slider-size': 'Controls track `height`',
      '--slider-thumb-size': 'Controls thumb `width` and `height`',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: 'root',
      condition: 'Determines slider orientation, `horizontal` by default',
    },
    {
      modifier: 'data-disabled',
      selector: ['trackContainer', 'track', 'bar', 'thumb', 'mark'],
      condition: '`disabled` prop is set',
    },
    {
      modifier: 'data-inverted',
      selector: ['track', 'bar'],
      condition: '`inverted` prop is set',
    },
    {
      modifier: 'data-dragging',
      selector: 'thumb',
      condition: 'slider is being dragged',
    },
    {
      modifier: 'data-filled',
      selector: 'mark',
      condition: 'mark position is less or equal slider value',
    },
  ],
}

export const SparklineStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--chart-color': 'Controls stroke and fill color',
    },
  },
}

export const SplitterStylesApi: StylesApiData<'handle' | 'pane' | 'root' | 'thumb'> = {
  selectors: {
    handle: 'Handle element between panes, contains the separator line and the thumb',
    pane: 'Pane element (`Splitter.Pane` component)',
    root: 'Root element',
    thumb: 'Thumb element inside the handle, contains the grip icon',
  },
  vars: {
    root: {
      '--splitter-handle-color': 'Controls the color of the separator line between panes',
      '--splitter-line-size': 'Controls the thickness of the separator line between panes',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: ['root', 'handle', 'thumb'],
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-active',
      selector: ['handle', 'thumb'],
      condition: 'Handle is being dragged',
    },
    {
      modifier: 'data-collapsed',
      selector: 'pane',
      condition: 'Pane is collapsed',
    },
  ],
}

export const SpoilerStylesApi: StylesApiData<'content' | 'control' | 'root'> = {
  selectors: {
    content: 'Wraps content to set max-height and transition',
    control: 'Show/hide content control',
    root: 'Root element',
  },
  vars: {
    root: {
      '--spoiler-transition-duration': 'Controls transition duration',
    },
  },
  modifiers: [
    {
      modifier: 'data-has-spoiler',
      selector: 'root',
      condition: 'Whether the control button is shown or not',
    },
  ],
}

export const SpotlightStylesApi: StylesApiData<
  | 'root'
  | 'inner'
  | 'content'
  | 'header'
  | 'overlay'
  | 'title'
  | 'body'
  | 'close'
  | 'search'
  | 'actionsList'
  | 'empty'
  | 'footer'
  | 'action'
  | 'actionBody'
  | 'actionLabel'
  | 'actionDescription'
  | 'actionSection'
  | 'actionsGroup'
> = {
  selectors: {
    root: 'Root element',
    inner: 'Element used to center modal, has fixed position, takes entire screen',
    content: '`Modal.Content` root element',
    header: 'Contains title and close button',
    overlay: 'Overlay displayed under the `Modal.Content`',
    title: 'Modal title (h2 tag), displayed in the header',
    body: 'Modal body, displayed after header',
    close: 'Close button',
    search: 'Search input (`Spotlight.Search`)',
    actionsList: 'Actions list (`Spotlight.ActionsList`)',
    empty: 'Empty state (`Spotlight.Empty`)',
    footer: 'Footer (`Spotlight.Footer`)',
    action: 'Action (`Spotlight.Action`)',
    actionBody: 'Body of the action, contains label and description',
    actionLabel: '`Spotlight.Action` label',
    actionDescription: '`Spotlight.Action` description',
    actionSection: '`Spotlight.Action` left and right sections',
    actionsGroup: '`Spotlight.ActionsGroup` root element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-selected',
      selector: 'action',
      condition: 'Action is selected with up/down keys',
    },
    {
      modifier: 'data-position',
      selector: 'actionSection',
      value: 'Section position: left or right',
    },
    {
      modifier: 'data-dimmed',
      selector: 'actionSection',
      condition: '`dimmedSections` prop is set on `Spotlight.Action` component',
    },
  ],
}

export const StackStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--stack-align': 'Controls `align-items` property',
      '--stack-gap': 'Controls `gap` property',
      '--stack-justify': 'Controls `justify-content` property',
    },
  },
}

export const StepperStylesApi: StylesApiData<
  | 'content'
  | 'root'
  | 'separator'
  | 'step'
  | 'stepBody'
  | 'stepCompletedIcon'
  | 'stepDescription'
  | 'stepIcon'
  | 'stepIconContent'
  | 'stepLabel'
  | 'stepLoader'
  | 'steps'
  | 'stepWrapper'
  | 'verticalSeparator'
> = {
  selectors: {
    content: 'Current step content wrapper',
    root: 'Root element',
    separator: 'Separator line between step controls',
    step: 'Step control button',
    stepBody: 'Contains stepLabel and stepDescription',
    stepCompletedIcon: 'Completed step icon, rendered within stepIcon',
    stepDescription: 'Step description',
    stepIcon: 'Step icon wrapper',
    stepIconContent: 'Step icon content wrapper for non-completed steps, rendered within stepIcon',
    stepLabel: 'Step label',
    stepLoader: 'Step loader',
    steps: 'Steps controls wrapper',
    stepWrapper: 'Wrapper for the step icon and separator',
    verticalSeparator: 'Vertical separator line between step controls',
  },
  vars: {
    root: {
      '--stepper-color': 'Controls color of the active step and separator',
      '--stepper-content-padding': 'Controls `padding-top` of the content',
      '--stepper-fz': 'Controls `font-size` of various elements',
      '--stepper-icon-color': 'Controls `color` of the step icon',
      '--stepper-icon-size': 'Controls `width` and `height` of the icons',
      '--stepper-radius': 'Controls `border-radius` of the step icon',
      '--stepper-spacing': 'Controls various spacings',
    },
  },
  modifiers: [
    {
      modifier: 'data-progress',
      selector: 'stepIcon',
      condition: 'Step is current',
    },
    {
      modifier: 'data-completed',
      selector: 'stepIcon',
      condition: 'Step is completed',
    },
    {
      modifier: 'data-orientation',
      selector: 'steps',
    },
    {
      modifier: 'data-active',
      selector: 'separator',
    },
  ],
}

export const SwitchStylesApi: StylesApiData<
  | 'body'
  | 'description'
  | 'error'
  | 'input'
  | 'label'
  | 'labelWrapper'
  | 'root'
  | 'thumb'
  | 'track'
  | 'trackLabel'
> = {
  selectors: {
    body: 'Input body, contains all other elements',
    description: 'Description displayed below the label',
    error: 'Error message displayed below the label',
    input: 'Input element (`input[type="checkbox"]`), hidden by default',
    label: 'Label element',
    labelWrapper: 'Contains `label`, `description` and `error`',
    root: 'Root element',
    thumb: 'Thumb displayed inside `track`',
    track: 'Switch track, contains `thumb` and `trackLabel`',
    trackLabel: 'Label displayed inside `track`',
  },
  vars: {
    root: {
      '--switch-color': 'Controls track `background-color` when input is checked',
      '--switch-height': 'Controls height of `track`',
      '--switch-label-font-size': 'Controls `font-size` of `trackLabel`',
      '--switch-radius': 'Controls `border-radius` of `track` and `thumb`',
      '--switch-thumb-size': 'Controls width and height of `thumb`',
      '--switch-track-label-padding': 'Controls `trackLabel` offset',
      '--switch-width': 'Controls min-width of `track`',
    },
  },
  modifiers: [
    {
      modifier: 'data-error',
      selector: 'track',
      condition: '`error` prop is set',
    },
    {
      modifier: 'data-label-position',
      selector: ['track', 'root'],
      value: 'value of `labelPosition` prop',
    },
    {
      modifier: 'data-disabled',
      selector: 'label',
      condition: '`disabled` prop is set',
    },
  ],
}

export const TableStylesApi: StylesApiData<
  'caption' | 'table' | 'tbody' | 'td' | 'tfoot' | 'th' | 'thead' | 'tr'
> = {
  selectors: {
    caption: '`caption` element (`Table.Caption` component)',
    table: 'Root `table` element (`Table` component)',
    tbody: '`tbody` element (`Table.Tbody` component)',
    td: '`td` element (`Table.Td` component)',
    tfoot: '`tfoot` element (`Table.Tfoot` component)',
    th: '`th` element (`Table.Th` component)',
    thead: '`thead` element (`Table.Thead` component)',
    tr: '`tr` element (`Table.Tr` component)',
  },
  vars: {
    table: {
      '--table-border-color': 'Controls `border-color` of all elements inside table',
      '--table-caption-side': 'Controls caption-side of the table element, `bottom` by default',
      '--table-highlight-on-hover-color':
        'Controls `background-color` of `Table.Tr` elements when hovered',
      '--table-horizontal-spacing':
        'Controls `padding-left` and `padding-right` of `Table.Th` and `Table.Td` elements',
      '--table-layout': 'Controls `table-layout` of the table element, auto by default',
      '--table-sticky-header-offset': 'Controls `top` offset of sticky header',
      '--table-striped-color': 'Controls `background-color` of even/odd `Table.Tr` elements',
      '--table-vertical-spacing':
        'Controls `padding-top` and `padding-bottom` of `Table.Td` and `Table.Th` elements',
    },
  },
  modifiers: [
    {
      modifier: 'data-with-table-border',
      selector: 'table',
      condition: '`withTableBorder` prop is set on `Table` component',
    },
    {
      modifier: 'data-with-column-border',
      selector: ['th', 'td'],
      condition: '`withColumnsBorder` prop is set on `Table` component',
    },
    {
      modifier: 'data-with-row-border',
      selector: 'tr',
      condition: '`withRowsBorder` prop is set on `Table` component',
    },
    {
      modifier: 'data-striped',
      selector: 'tr',
      value: 'odd | even',
      condition: '`striped` prop is set on `Table` component',
    },
    {
      modifier: 'data-hover',
      selector: 'tr',
      condition: '`highlightOnHover` prop is set on `Table` component',
    },
    {
      modifier: 'data-size',
      selector: 'tr',
      value: 'value of `captionSize` prop on `Table` component',
    },
  ],
}

export const TableOfContentsStylesApi: StylesApiData<'control' | 'root'> = {
  selectors: {
    control: 'Control element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--depth-offset': 'Controls the offset',
      '--toc-bg': 'Background color of active control',
      '--toc-color': 'Text color of active control',
      '--toc-depth-offset': 'Offset between of control depending on depth',
      '--toc-radius': 'Border-radius of control',
      '--toc-size': 'Controls font-size and padding of all elements',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'control',
      condition: 'Associated heading is currently the best match in the viewport',
    },
  ],
}

export const TabsStylesApi: StylesApiData<
  'list' | 'panel' | 'root' | 'tab' | 'tabLabel' | 'tabSection'
> = {
  selectors: {
    list: 'List of tabs (`Tabs.List` component)',
    panel: 'Panel with tab content (`Tabs.Panel` component)',
    root: 'Root element (`Tabs` component)',
    tab: 'Tab button (`Tabs.Tab` component)',
    tabLabel: 'Label of `Tabs.Tab`',
    tabSection: 'Left and right sections of `Tabs.Tab`',
  },
  vars: {
    root: {
      '--tabs-color':
        'Controls colors of `Tabs.Tab`, only applicable when variant is `pills` or `default`',
      '--tabs-radius': 'Controls `Tabs.Tab` `border-radius`',
      '--tabs-text-color': 'Controls the text color',
    },
  },
  modifiers: [
    {
      modifier: 'data-orientation',
      selector: ['root', 'tab', 'list', 'panel'],
      value: 'Value of `orientation` prop',
    },
    {
      modifier: 'data-placement',
      selector: ['root', 'tab', 'list'],
      value: 'Value of placement prop',
      condition: 'Value of `orientation` prop is "vertical" on `Tabs` component',
    },
    {
      modifier: 'data-inverted',
      selector: ['tab', 'list'],
      condition: '`inverted` prop is set on `Tabs` component',
    },
    {
      modifier: 'data-grow',
      selector: ['list'],
      condition: '`grow` prop is set on `Tabs.List` component',
    },
    {
      modifier: 'data-position',
      selector: ['tabSection'],
      value: 'Position of the section, left or right',
    },
  ],
}

export const TagsInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'empty'
  | 'group'
  | 'groupLabel'
  | 'pill'
  | 'inputField'
  | 'pillsList'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    dropdown: 'Dropdown root element',
    options: 'Options wrapper',
    option: 'Option',
    empty: 'Nothing found message',
    group: 'Options group wrapper',
    groupLabel: 'Options group label',
    pill: 'Value pill',
    inputField: 'Input field',
    pillsList: 'List of pills, also contains input field',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: 'Options was activated by keyboard',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: 'Option is disabled',
    },
  ],
}

export const TextStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--text-fz': 'Controls `font-size` property',
      '--text-gradient': 'Text fill gradient',
      '--text-lh': 'Controls `line-height` property',
      '--text-line-clamp': 'Number of lines that should be visible',
      '--text-text-wrap': 'Controls `text-wrap` property',
    },
  },
  modifiers: [
    {
      modifier: 'data-truncate',
      selector: 'root',
      value: 'Value of `truncate` prop',
      condition: '`truncate` prop is set',
    },
    {
      modifier: 'data-line-clamp',
      selector: 'root',
      condition: '`lineClamp` prop is a number',
    },
    {
      modifier: 'data-inline',
      selector: 'root',
      condition: '`inline` prop is set',
    },
    {
      modifier: 'data-inherit',
      selector: 'root',
      condition: '`inherit` prop is set',
    },
  ],
}

export const TextareaStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {
    root: {
      '--input-resize': 'Controls the resize',
    },
  },
}

export const TextInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const ThemeIconStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--ti-bd': 'Controls `border`',
      '--ti-bg': 'Controls `background`',
      '--ti-color': 'Controls icon `color`',
      '--ti-radius': 'Controls `border-radius`',
      '--ti-size': 'Controls `width`, `height`, `min-width` and `min-height` styles',
    },
  },
}

export const TimeGridStylesApi: StylesApiData<
  | 'root'
  | 'control'
  | 'simpleGrid'
  | 'calendar'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'day'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'month'
  | 'monthCell'
  | 'monthRow'
  | 'pickerControl'
  | 'placeholder'
  | 'presetButton'
  | 'presetsList'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
  | 'weekday'
  | 'weekNumber'
> = {
  selectors: {
    root: 'Root element',
    control: 'Time grid control',
    simpleGrid: 'SimpleGrid component root',
    calendar: 'calendar element',
    calendarHeader: 'calendar header element',
    calendarHeaderControl: 'calendar header control element',
    calendarHeaderControlIcon: 'calendar header control icon element',
    calendarHeaderLevel: 'calendar header level element',
    calendarHeaderSelect: 'calendar header select element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    day: 'day element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    month: 'month element',
    monthCell: 'month cell element',
    monthRow: 'month row element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    presetButton: 'preset button element',
    presetsList: 'presets list element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
    weekday: 'weekday element',
    weekNumber: 'week number element',
  },
  vars: {
    root: {
      '--time-grid-fz': 'Controls `font-size` property of all controls',
      '--time-grid-radius': 'Controls `border-radius` property of all controls',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: 'control',
      condition: 'Current component value is the same as control value',
    },
    {
      modifier: 'data-disabled',
      selector: 'control',
      condition:
        'Component is disabled by one of the props: `minTime`, `maxTime`, `disableTime`, `disabled`',
    },
  ],
}

export const TimeInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
  },
  vars: {},
}

export const TimelineStylesApi: StylesApiData<
  'item' | 'itemBody' | 'itemBullet' | 'itemContent' | 'itemOpposite' | 'itemTitle' | 'root'
> = {
  selectors: {
    item: 'Item root element',
    itemBody: 'Item body, wraps title and content',
    itemBullet: 'Item bullet',
    itemContent: 'Item content, controlled by children prop',
    itemOpposite: 'Item opposite content, controlled by opposite prop on Timeline.Item',
    itemTitle: 'Item title, controlled by title prop',
    root: 'Root element',
  },
  vars: {
    root: {
      '--tl-bullet-size': 'Controls bullet `width` and `height`',
      '--tl-color': 'Controls active bullet and line colors',
      '--tl-icon-color': 'Controls icon color',
      '--tl-line-width': 'Controls width of the line between bullets',
      '--tl-radius': 'Controls bullet `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-active',
      selector: ['item', 'itemBullet'],
      condition: 'Item index is =< Timeline active prop',
    },
    {
      modifier: 'data-line-active',
      selector: ['item'],
      condition: 'Item index is < Timeline active prop',
    },
  ],
}

export const TimelineItemStylesApi: StylesApiData<
  'item' | 'itemBody' | 'itemBullet' | 'itemContent' | 'itemOpposite' | 'itemTitle' | 'root'
> = {
  selectors: {
    item: 'item element',
    itemBody: 'item body element',
    itemBullet: 'item bullet element',
    itemContent: 'item content element',
    itemOpposite: 'item opposite element',
    itemTitle: 'item title element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--tli-border-style': 'Controls the border style',
      '--tli-color': 'Controls the color',
      '--tli-radius': 'Controls the radius',
    },
  },
}

export const TimePickerStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'control'
  | 'controlsList'
  | 'controlsListGroup'
  | 'dropdown'
  | 'fieldsRoot'
  | 'fieldsGroup'
  | 'field'
  | 'presetControl'
  | 'presetsGroup'
  | 'presetsGroupLabel'
  | 'presetsRoot'
  | 'scrollarea'
  | 'calendar'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'day'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'month'
  | 'monthCell'
  | 'monthRow'
  | 'pickerControl'
  | 'placeholder'
  | 'presetButton'
  | 'presetsList'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
  | 'weekday'
  | 'weekNumber'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    control: 'Button in the dropdown which is used to select hours/minutes/seconds/am-pm',
    controlsList: 'List of buttons with hours/minutes/seconds/am-pm',
    controlsListGroup: 'Group of controlsLists',
    dropdown: 'Popover dropdown',
    fieldsRoot: 'A wrapper element for all fieldsGroups',
    fieldsGroup: 'A wrapper element for hours/minutes/seconds/am-pm fields',
    field: 'Hours/minutes/seconds/am-pm input field',
    presetControl: 'Time preset button',
    presetsGroup: 'Wraps preset controls and label',
    presetsGroupLabel: 'Labels of the preset group',
    presetsRoot: 'Element wrapping all presets content',
    scrollarea: 'Scroll area in the dropdown',
    calendar: 'calendar element',
    calendarHeader: 'calendar header element',
    calendarHeaderControl: 'calendar header control element',
    calendarHeaderControlIcon: 'calendar header control icon element',
    calendarHeaderLevel: 'calendar header level element',
    calendarHeaderSelect: 'calendar header select element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    day: 'day element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    month: 'month element',
    monthCell: 'month cell element',
    monthRow: 'month row element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    presetButton: 'preset button element',
    presetsList: 'presets list element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
    weekday: 'weekday element',
    weekNumber: 'week number element',
  },
  vars: {
    dropdown: {
      '--control-font-size': 'Controls `font-size` of dropdown controls',
    },
  },
}

export const TitleStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {
    root: {
      '--title-fw': 'Title `font-weight`, by default value from `theme.headings`',
      '--title-fz': 'Title `font-size`, by default value from `theme.headings`',
      '--title-lh': 'Title `line-height`, by default value from `theme.headings`',
      '--title-line-clamp': 'Controls `-webkit-line-clamp` css property',
      '--title-text-wrap': 'Controls `text-wrap` css property',
    },
  },
  modifiers: [
    {
      modifier: 'data-order',
      selector: 'root',
      value: 'Value of the `order` prop',
    },
    {
      modifier: 'data-line-clamp',
      selector: 'root',
      condition: '`lineClamp` prop is a number',
    },
  ],
}

export const TooltipStylesApi: StylesApiData<'arrow' | 'tooltip'> = {
  selectors: {
    arrow: 'Tooltip arrow, rendered inside tooltip',
    tooltip: 'Root element',
  },
  vars: {
    tooltip: {
      '--tooltip-bg': 'Tooltip `background-color`',
      '--tooltip-color': 'Controls tooltip text color',
      '--tooltip-radius': 'Tooltip `border-radius`',
    },
  },
  modifiers: [
    {
      modifier: 'data-multiline',
      selector: 'tooltip',
      condition: '`multiline` prop is set',
    },
  ],
}

export const TreeStylesApi: StylesApiData<'label' | 'node' | 'root' | 'subtree'> = {
  selectors: {
    label: 'Node label',
    node: 'Node element (li), contains label and subtree elements',
    root: 'Root element',
    subtree: 'Subtree element (ul)',
  },
  vars: {
    root: {
      '--level-offset': 'Controls offset of nested tree levels',
    },
  },
  modifiers: [
    {
      modifier: 'data-selected',
      selector: ['node', 'label'],
      condition: 'The node is selected',
    },
    {
      modifier: 'data-hovered',
      selector: ['node', 'label'],
      condition: 'The node is hovered',
    },
    {
      modifier: 'data-level',
      selector: 'node',
      value: 'Nesting level of the node',
    },
  ],
}

export const TreemapStylesApi: StylesApiData<'container' | 'root'> = {
  selectors: {
    container: 'container element',
    root: 'Root element',
  },
  vars: {
    root: {
      '--chart-stroke-color': 'Controls color of the chart stroke',
      '--chart-height': 'Controls height of the chart',
    },
  },
}

export const TreeSelectStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'dropdown'
  | 'options'
  | 'option'
  | 'empty'
  | 'group'
  | 'groupLabel'
  | 'pill'
  | 'inputField'
  | 'pillsList'
  | 'branchHorizontal'
  | 'branchVertical'
  | 'checkIcon'
  | 'expandIcon'
  | 'guideLine'
  | 'optionsWrapper'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    dropdown: 'Dropdown root element',
    options: 'Options wrapper',
    option: 'Option',
    empty: 'Nothing found message',
    group: 'Options group wrapper',
    groupLabel: 'Options group label',
    pill: 'Value pill',
    inputField: 'Input field',
    pillsList: 'List of pills, also contains input field',
    branchHorizontal: 'branch horizontal element',
    branchVertical: 'branch vertical element',
    checkIcon: 'check icon element',
    expandIcon: 'expand icon element',
    guideLine: 'guide line element',
    optionsWrapper: 'options wrapper element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-combobox-selected',
      selector: 'option',
      condition: 'Option is selected',
    },
    {
      modifier: 'data-combobox-active',
      selector: 'option',
      condition: 'Options was activated by keyboard',
    },
    {
      modifier: 'data-combobox-disabled',
      selector: 'option',
      condition: 'Option is disabled',
    },
  ],
}

export const VisuallyHiddenStylesApi: StylesApiData<'root'> = {
  selectors: {
    root: 'Root element',
  },
  vars: {},
}

export const WeekViewStylesApi: StylesApiData<
  | 'weekView'
  | 'weekViewAllDaySlot'
  | 'weekViewAllDaySlots'
  | 'weekViewAllDaySlotsEvents'
  | 'weekViewAllDaySlotsLabel'
  | 'weekViewAllDaySlotsList'
  | 'weekViewBackgroundEvent'
  | 'weekViewCorner'
  | 'weekViewDay'
  | 'weekViewDayLabel'
  | 'weekViewDayNumber'
  | 'weekViewDaySlot'
  | 'weekViewDaySlots'
  | 'weekViewDayWeekday'
  | 'weekViewHeader'
  | 'weekViewInner'
  | 'weekViewRoot'
  | 'weekViewScrollArea'
  | 'weekViewSlotLabel'
  | 'weekViewSlotLabels'
  | 'weekViewWeekLabel'
  | 'weekViewWeekNumber'
> = {
  selectors: {
    weekView: 'Root element',
    weekViewAllDaySlot: 'Individual all-day slot',
    weekViewAllDaySlots: 'All-day slots container',
    weekViewAllDaySlotsEvents: 'All-day events container',
    weekViewAllDaySlotsLabel: 'All-day slots label',
    weekViewAllDaySlotsList: 'List of all-day slots',
    weekViewBackgroundEvent: 'Background event element',
    weekViewCorner: 'Top-left corner element',
    weekViewDay: 'Day column',
    weekViewDayLabel: 'Day label element',
    weekViewDayNumber: 'Day number in header',
    weekViewDaySlot: 'Individual day time slot',
    weekViewDaySlots: 'Container for day slots',
    weekViewDayWeekday: 'Weekday label',
    weekViewHeader: 'Header row with day labels',
    weekViewInner: 'Inner container',
    weekViewRoot: 'Week view root container',
    weekViewScrollArea: 'Scroll area for time slots',
    weekViewSlotLabel: 'Individual slot label',
    weekViewSlotLabels: 'Container for slot labels',
    weekViewWeekLabel: 'Week label',
    weekViewWeekNumber: 'Week number indicator',
  },
  vars: {
    weekView: {
      '--week-view-radius': 'Controls `border-radius` of the week view',
      '--week-view-slot-height': 'Controls `height` of 1-hour time slots',
      '--week-view-all-day-slots-height': 'Controls `height` of all-day slots section',
      '--indicator-offset-index': 'Controls the offset index',
      '--number-of-days': 'Controls the of days',
    },
  },
  modifiers: [
    {
      modifier: 'data-today',
      selector: 'weekViewDayLabel',
      condition: 'Day is today',
    },
    {
      modifier: 'data-weekend',
      selector: 'weekViewDay',
      condition: 'Day is a weekend day',
    },
    {
      modifier: 'data-highlight-today',
      selector: 'weekViewDay',
      condition: '`highlightToday="column"` and day is today',
    },
    {
      modifier: 'data-hour-start',
      selector: 'weekViewDaySlot',
      condition: 'Slot is at the start of an hour',
    },
    {
      modifier: 'data-business-hours',
      selector: 'weekViewDaySlot',
      condition: '`highlightBusinessHours` is true and slot is within business hours',
    },
    {
      modifier: 'data-non-business-hours',
      selector: 'weekViewDaySlot',
      condition: '`highlightBusinessHours` is true and slot is outside business hours',
    },
    {
      modifier: 'data-static',
      selector: 'weekView',
      condition: '`mode="static"` is set',
    },
  ],
}

export const YearPickerStylesApi: StylesApiData<
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'yearPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'calendar'
  | 'calendarLevel'
  | 'controlsGrid'
  | 'datePickerRoot'
  | 'dateTimePicker'
  | 'day'
  | 'dropdown'
  | 'miniCalendarControl'
  | 'miniCalendarDay'
  | 'miniCalendarDayMonth'
  | 'miniCalendarDayNumber'
  | 'miniCalendarDays'
  | 'miniCalendarRoot'
  | 'month'
  | 'monthCell'
  | 'monthRow'
  | 'pickerControl'
  | 'placeholder'
  | 'timeGridControl'
  | 'timeInput'
  | 'timePicker'
  | 'timePickerControl'
  | 'timePickerControlsList'
  | 'timePickerControlsListGroup'
  | 'timePickerDropdown'
  | 'timePickerField'
  | 'timePickerFieldsGroup'
  | 'timePickerFieldsRoot'
  | 'timePickerPresetsGroup'
  | 'timeWrapper'
  | 'weekday'
  | 'weekNumber'
> = {
  selectors: {
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of decades levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    yearPickerRoot: 'Year picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    calendar: 'calendar element',
    calendarLevel: 'calendar level element',
    controlsGrid: 'controls grid element',
    datePickerRoot: 'date picker root element',
    dateTimePicker: 'date time picker element',
    day: 'day element',
    dropdown: 'dropdown element',
    miniCalendarControl: 'mini calendar control element',
    miniCalendarDay: 'mini calendar day element',
    miniCalendarDayMonth: 'mini calendar day month element',
    miniCalendarDayNumber: 'mini calendar day number element',
    miniCalendarDays: 'mini calendar days element',
    miniCalendarRoot: 'mini calendar root element',
    month: 'month element',
    monthCell: 'month cell element',
    monthRow: 'month row element',
    pickerControl: 'picker control element',
    placeholder: 'placeholder element',
    timeGridControl: 'time grid control element',
    timeInput: 'time input element',
    timePicker: 'time picker element',
    timePickerControl: 'time picker control element',
    timePickerControlsList: 'time picker controls list element',
    timePickerControlsListGroup: 'time picker controls list group element',
    timePickerDropdown: 'time picker dropdown element',
    timePickerField: 'time picker field element',
    timePickerFieldsGroup: 'time picker fields group element',
    timePickerFieldsRoot: 'time picker fields root element',
    timePickerPresetsGroup: 'time picker presets group element',
    timeWrapper: 'time wrapper element',
    weekday: 'weekday element',
    weekNumber: 'week number element',
  },
  vars: {
    yearPickerRoot: {
      '--preset-font-size': 'Controls font size of preset buttons',
    },
  },
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
  ],
}

export const YearPickerInputStylesApi: StylesApiData<
  | 'wrapper'
  | 'input'
  | 'section'
  | 'bottomSection'
  | 'root'
  | 'label'
  | 'required'
  | 'description'
  | 'error'
  | 'success'
  | 'calendarHeader'
  | 'calendarHeaderControl'
  | 'calendarHeaderControlIcon'
  | 'calendarHeaderLevel'
  | 'calendarHeaderSelect'
  | 'levelsGroup'
  | 'yearsList'
  | 'yearsListRow'
  | 'yearsListCell'
  | 'yearsListControl'
  | 'yearPickerRoot'
  | 'presetsList'
  | 'presetButton'
  | 'placeholder'
> = {
  selectors: {
    wrapper: 'Root element of the Input',
    input: 'Input element',
    section: 'Left and right sections',
    bottomSection: 'Bottom section element, rendered inside the input border at the bottom',
    root: 'Root element',
    label: 'Label element',
    required: 'Required asterisk element, rendered inside label',
    description: 'Description element',
    error: 'Error element',
    success: 'Success element',
    calendarHeader: 'Calendar header root element',
    calendarHeaderControl: 'Previous/next calendar header controls',
    calendarHeaderControlIcon: 'Icon of previous/next calendar header controls',
    calendarHeaderLevel: 'Level control (changes levels when clicked, month -> year -> decade)',
    calendarHeaderSelect:
      'Native select element used for level navigation when withNativeLevelSelect is enabled',
    levelsGroup: 'Group of decades levels',
    yearsList: 'Years list table element',
    yearsListRow: 'Years list row element',
    yearsListCell: 'Years list cell element',
    yearsListControl: 'Button used to pick months and years',
    yearPickerRoot: 'Year picker root element, contains calendar and presets',
    presetsList: 'Presets wrapper element',
    presetButton: 'Preset button',
    placeholder: 'Placeholder element',
  },
  vars: {},
  modifiers: [
    {
      modifier: 'data-direction',
      selector: 'calendarHeaderControl',
      value: '`"previous"` or `"next"` depending on the control type',
    },
    {
      modifier: 'data-disabled',
      selector: 'calendarHeaderControl',
      condition: 'Control is disabled for any reason',
    },
  ],
}

export const YearViewStylesApi: StylesApiData<
  | 'yearView'
  | 'yearViewDay'
  | 'yearViewDayIndicator'
  | 'yearViewDayIndicators'
  | 'yearViewMonth'
  | 'yearViewMonthCaption'
  | 'yearViewMonths'
  | 'yearViewWeek'
  | 'yearViewWeekday'
  | 'yearViewWeekdays'
  | 'yearViewWeekdaysCorner'
  | 'yearViewWeekNumber'
> = {
  selectors: {
    yearView: 'Root element',
    yearViewDay: 'Day cell',
    yearViewDayIndicator: 'Individual day event indicator',
    yearViewDayIndicators: 'Container for day event indicators',
    yearViewMonth: 'Individual month container',
    yearViewMonthCaption: 'Month name label',
    yearViewMonths: 'Container for all months',
    yearViewWeek: 'Week row',
    yearViewWeekday: 'Weekday name cell',
    yearViewWeekdays: 'Weekdays row',
    yearViewWeekdaysCorner: 'Top-left corner in weekdays row',
    yearViewWeekNumber: 'Week number indicator',
  },
  vars: {
    yearView: {
      '--year-view-radius': 'Controls `border-radius` of the year view',
      '--year-view-columns': 'Controls the number of columns in the year view',
    },
  },
  modifiers: [
    {
      modifier: 'data-today',
      selector: 'yearViewDay',
      condition: 'Day is today',
    },
    {
      modifier: 'data-weekend',
      selector: 'yearViewDay',
      condition: 'Day is a weekend day',
    },
    {
      modifier: 'data-outside',
      selector: 'yearViewDay',
      condition: 'Day is outside current month',
    },
    {
      modifier: 'data-static',
      selector: 'yearView',
      condition: '`mode="static"` is set',
    },
  ],
}
