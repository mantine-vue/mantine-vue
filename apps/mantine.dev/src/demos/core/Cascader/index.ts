import { defineComponent, h } from 'vue'
import { PhMapPin } from '@phosphor-icons/vue'
import { Badge, Button, Cascader, Group, Popover } from '@mantine-vue/core'
import { useMediaQuery } from '@mantine-vue/hooks'
import type { ConfiguratorControlOptions, MantineDemo } from '@/demo'
import { data, dataCode } from './data'
import type { CascaderOption } from '@mantine-vue/core'

const componentCode = (props: string, setup = '') => `<script setup lang="ts">
import { Cascader } from '@mantine-vue/core'
${setup}import { data } from './data'
</script>

<template>
  <Cascader
    ${props}
    label="Location"
    placeholder="Pick location"
    :data="data"
  />
</template>`

const codeFiles = (code: string) => [
  { fileName: 'Demo.vue', language: 'vue', code },
  { fileName: 'data.ts', language: 'ts', code: dataCode },
]

function createDemo(
  name: string,
  props: Record<string, unknown> = {},
  codeProps = '',
  slots?: () => Record<string, (...args: any[]) => any>,
): MantineDemo {
  const Demo = defineComponent({
    name: `Cascader${name}Demo`,
    setup() {
      const withColumns = useMediaQuery('(min-width: 48em)')
      return () =>
        h(
          Cascader,
          {
            label: 'Location',
            placeholder: 'Pick location',
            data,
            withColumns: Boolean(props.withColumns ?? withColumns.value),
            ...props,
          },
          slots?.(),
        )
    },
  })

  return {
    type: 'code',
    component: Demo,
    code: codeFiles(componentCode(codeProps)),
    maxWidth: 340,
    centered: true,
  }
}

const usage = createDemo('Usage', {}, ':with-columns="withColumns"', undefined)
usage.code = codeFiles(
  componentCode(
    ':with-columns="withColumns"',
    `import { useMediaQuery } from '@mantine-vue/hooks'

const withColumns = useMediaQuery('(min-width: 48em)')

`,
  ),
)
const changeOnSelect = createDemo(
  'ChangeOnSelect',
  { changeOnSelect: true, placeholder: 'Pick any level' },
  'change-on-select',
)
const closeOnSelect = createDemo(
  'CloseOnSelect',
  { closeOnSelect: false },
  ':close-on-select="false"',
)
const allowDeselect = createDemo(
  'AllowDeselect',
  { allowDeselect: true, defaultValue: ['asia', 'jp', 'tokyo'] },
  "allow-deselect\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const hoverExpand = createDemo(
  'HoverExpand',
  { expandTrigger: 'hover', placeholder: 'Hover to expand' },
  'expand-trigger="hover"',
)
const maxDisplayedLevels = createDemo(
  'MaxDisplayedLevels',
  { maxDisplayedLevels: 2, defaultValue: ['asia', 'jp', 'tokyo'] },
  ":max-displayed-levels=\"2\"\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const searchable = createDemo(
  'Searchable',
  {
    searchable: true,
    placeholder: 'Search location',
    nothingFoundMessage: 'Nothing found...',
  },
  'searchable\n    placeholder="Search location"\n    nothing-found-message="Nothing found..."',
)
const nothingFound = createDemo(
  'NothingFound',
  {
    searchable: true,
    placeholder: 'Search location',
    nothingFoundMessage: 'Nothing found...',
  },
  'searchable\n    placeholder="Search location"\n    nothing-found-message="Nothing found..."',
)
const flatList = createDemo(
  'FlatList',
  {
    withColumns: false,
    searchable: true,
    nothingFoundMessage: 'Nothing found...',
  },
  ':with-columns="false"\n    searchable\n    nothing-found-message="Nothing found..."',
)
const clearable = createDemo(
  'Clearable',
  { clearable: true, defaultValue: ['asia', 'jp', 'tokyo'] },
  "clearable\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const clearSectionMode = createDemo(
  'ClearSectionMode',
  {
    clearable: true,
    clearSectionMode: 'clear',
    defaultValue: ['asia', 'jp', 'tokyo'],
  },
  "clearable\n    clear-section-mode=\"clear\"\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const checkIcon = createDemo(
  'CheckIcon',
  { checkIconPosition: 'left', defaultValue: ['asia', 'jp', 'tokyo'] },
  "check-icon-position=\"left\"\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const formatValue = createDemo(
  'FormatValue',
  {
    separator: '›',
    defaultValue: ['asia', 'jp', 'tokyo'],
    formatValue: ({ options }: { options: CascaderOption[] }) =>
      options.map((option) => option.label).join(' › '),
  },
  "separator=\"›\"\n    :default-value=\"['asia', 'jp', 'tokyo']\"\n    :format-value=\"({ options }) => options.map((option) => option.label).join(' › ')\"",
)
const sections = createDemo(
  'Sections',
  { leftSectionPointerEvents: 'none' },
  'left-section-pointer-events="none"',
  () => ({ leftSection: () => h(PhMapPin, { size: 16 }) }),
)
sections.code = codeFiles(`<script setup lang="ts">
import { PhMapPin } from '@phosphor-icons/vue'
import { Cascader } from '@mantine-vue/core'
import { data } from './data'
</script>

<template>
  <Cascader
    label="Location"
    placeholder="Pick location"
    left-section-pointer-events="none"
    :data="data"
  >
    <template #leftSection><PhMapPin :size="16" /></template>
  </Cascader>
</template>`)

const flags: Record<string, string> = {
  jp: '🇯🇵',
  kr: '🇰🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  us: '🇺🇸',
  ca: '🇨🇦',
}

function countCities(option: CascaderOption): number {
  return option.children?.length
    ? option.children.reduce((sum, child) => sum + countCities(child), 0)
    : 1
}

const renderOption = createDemo('RenderOption', {}, '', () => ({
  renderOption: ({ option, level }: { option: CascaderOption; level: number }) =>
    h(Group, { gap: 'xs', justify: 'space-between', wrap: 'nowrap', flex: 1 }, () => [
      h(Group, { gap: 6, wrap: 'nowrap' }, () => [
        level === 1 ? h('span', null, flags[option.value]) : null,
        h('span', null, option.label as any),
      ]),
      level === 0
        ? h(
            Badge,
            { size: 'xs', variant: 'light', color: 'gray' },
            () => `${countCities(option)} cities`,
          )
        : null,
    ]),
}))
renderOption.code = codeFiles(`<script setup lang="ts">
import { Badge, Cascader, Group } from '@mantine-vue/core'
import type { CascaderOption } from '@mantine-vue/core'
import { data } from './data'

const flags: Record<string, string> = {
  jp: '🇯🇵',
  kr: '🇰🇷',
  fr: '🇫🇷',
  de: '🇩🇪',
  us: '🇺🇸',
  ca: '🇨🇦',
}

function countCities(option: CascaderOption): number {
  return option.children?.length
    ? option.children.reduce((sum, child) => sum + countCities(child), 0)
    : 1
}
</script>

<template>
  <Cascader label="Location" placeholder="Pick location" :data="data">
    <template #renderOption="{ option, level }">
      <Group gap="xs" justify="space-between" wrap="nowrap" flex="1">
        <Group :gap="6" wrap="nowrap">
          <span v-if="level === 1">{{ flags[option.value] }}</span>
          <span>{{ option.label }}</span>
        </Group>
        <Badge v-if="level === 0" size="xs" variant="light" color="gray">
          {{ countCities(option) }} cities
        </Badge>
      </Group>
    </template>
  </Cascader>
</template>`)

const columnWidth = createDemo(
  'ColumnWidth',
  { columnWidth: 140, maxDropdownHeight: 200 },
  ':column-width="140"\n    :max-dropdown-height="200"',
)

const disabledData: CascaderOption[] = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'jp',
        label: 'Japan',
        children: [{ value: 'tokyo', label: 'Tokyo' }],
      },
      { value: 'kr', label: 'South Korea', disabled: true },
    ],
  },
  { value: 'antarctica', label: 'Antarctica', disabled: true },
]
const disabledOptions = createDemo('DisabledOptions', { data: disabledData }, '')

const cities = Array.from({ length: 30 }, (_, index) => ({
  value: `city-${index + 1}`,
  label: `City ${index + 1}`,
}))
const scrollAreaData: CascaderOption[] = [
  {
    value: 'asia',
    label: 'Asia',
    children: [{ value: 'jp', label: 'Japan', children: cities }],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [{ value: 'fr', label: 'France', children: cities }],
  },
]
const scrollArea = createDemo(
  'ScrollArea',
  {
    data: scrollAreaData,
    defaultValue: ['asia', 'jp'],
    maxDropdownHeight: 180,
  },
  ':default-value="[\'asia\', \'jp\']"\n    :max-dropdown-height="180"',
)

const dropdownPosition = createDemo(
  'DropdownPosition',
  { comboboxProps: { position: 'top-start' } },
  ':combobox-props="{ position: \'top-start\' }"',
)
const dropdownOffset = createDemo(
  'DropdownOffset',
  { comboboxProps: { offset: 0 } },
  ':combobox-props="{ offset: 0 }"',
)
const dropdownWidth = createDemo(
  'DropdownWidth',
  { withColumns: false, comboboxProps: { width: 220, position: 'bottom-start' } },
  ':with-columns="false"\n    :combobox-props="{ width: 220, position: \'bottom-start\' }"',
)
const dropdownPadding = createDemo(
  'DropdownPadding',
  { withColumns: false, comboboxProps: { dropdownPadding: 12 } },
  ':with-columns="false"\n    :combobox-props="{ dropdownPadding: 12 }"',
)
const dropdownShadow = createDemo(
  'DropdownShadow',
  { comboboxProps: { shadow: 'md' } },
  ':combobox-props="{ shadow: \'md\' }"',
)
const dropdownAnimation = createDemo(
  'DropdownAnimation',
  { comboboxProps: { transitionProps: { transition: 'pop', duration: 200 } } },
  ':combobox-props="{ transitionProps: { transition: \'pop\', duration: 200 } }"',
)

const WithinPopoverDemo = defineComponent({
  name: 'CascaderWithinPopoverDemo',
  setup: () => () =>
    h(
      Popover,
      { width: 320, position: 'bottom', withArrow: true, shadow: 'md' },
      {
        default: () => [
          h(Popover.Target, null, () => h(Button, null, () => 'Toggle popover')),
          h(Popover.Dropdown, null, () =>
            h(Cascader, {
              withColumns: false,
              label: 'Location',
              placeholder: 'Pick location',
              comboboxProps: { withinPortal: false },
              data,
            }),
          ),
        ],
      },
    ),
})
const withinPopover: MantineDemo = {
  type: 'code',
  component: WithinPopoverDemo,
  code: codeFiles(`<script setup lang="ts">
import { Button, Cascader, Popover } from '@mantine-vue/core'
import { data } from './data'
</script>

<template>
  <Popover :width="320" position="bottom" with-arrow shadow="md">
    <Popover.Target><Button>Toggle popover</Button></Popover.Target>
    <Popover.Dropdown>
      <Cascader
        :with-columns="false"
        label="Location"
        placeholder="Pick location"
        :combobox-props="{ withinPortal: false }"
        :data="data"
      />
    </Popover.Dropdown>
  </Popover>
</template>`),
  centered: true,
}

const readOnly = createDemo(
  'ReadOnly',
  { readOnly: true, defaultValue: ['asia', 'jp', 'tokyo'] },
  "read-only\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const disabled = createDemo('Disabled', { disabled: true }, 'disabled')
const error = createDemo(
  'Error',
  { error: 'Pick a valid location' },
  'error="Pick a valid location"',
)
const success = createDemo(
  'Success',
  { success: 'Looks good!', defaultValue: ['asia', 'jp', 'tokyo'] },
  "success=\"Looks good!\"\n    :default-value=\"['asia', 'jp', 'tokyo']\"",
)
const loading = createDemo('Loading', { loading: true }, 'loading')

const inputControls: ConfiguratorControlOptions[] = [
  {
    type: 'select',
    prop: 'variant',
    initialValue: 'default',
    libraryValue: 'default',
    data: ['default', 'filled', 'unstyled'],
  },
  {
    type: 'select',
    prop: 'size',
    initialValue: 'sm',
    libraryValue: 'sm',
    data: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    type: 'select',
    prop: 'radius',
    initialValue: 'sm',
    libraryValue: 'sm',
    data: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  { type: 'string', prop: 'label', initialValue: 'Cascader label', libraryValue: '' },
  { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
  { type: 'string', prop: 'description', initialValue: '', libraryValue: '' },
  { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
]
const ConfiguratorDemo = defineComponent({
  name: 'CascaderConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const withColumns = useMediaQuery('(min-width: 48em)')
    return () =>
      h(Cascader, {
        ...attrs,
        withColumns: withColumns.value,
        placeholder: 'Pick location',
        data,
      })
  },
})
const configurator: MantineDemo = {
  type: 'configurator',
  component: ConfiguratorDemo,
  code: componentCode('{{props}}'),
  centered: true,
  maxWidth: 340,
  controls: inputControls,
}

const StylesApiDemo = defineComponent({
  name: 'CascaderStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Cascader, {
        ...attrs,
        defaultValue: ['asia', 'jp'],
        defaultDropdownOpened: true,
        label: 'Location',
        placeholder: 'Pick location',
        comboboxProps: { withinPortal: false },
        data,
      })
  },
})
const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      wrapper: 'Input wrapper',
      input: 'Input element',
      section: 'Left and right sections',
      label: 'Label element',
      required: 'Required asterisk',
      description: 'Description element',
      error: 'Error message',
      dropdown: 'Dropdown root element',
      columns: 'Columns wrapper',
      column: 'Single options column',
      option: 'Option',
      control: 'Previous and next levels controls',
      empty: 'Nothing found message',
    },
  },
  component: StylesApiDemo,
  code: componentCode('{{props}}'),
  centered: true,
  maxWidth: 340,
}

export const CascaderDemos = {
  usage,
  configurator,
  changeOnSelect,
  closeOnSelect,
  allowDeselect,
  hoverExpand,
  maxDisplayedLevels,
  searchable,
  nothingFound,
  flatList,
  clearable,
  clearSectionMode,
  checkIcon,
  formatValue,
  sections,
  renderOption,
  columnWidth,
  disabledOptions,
  scrollArea,
  withinPopover,
  dropdownPosition,
  dropdownWidth,
  dropdownOffset,
  dropdownPadding,
  dropdownShadow,
  dropdownAnimation,
  stylesApi,
  disabled,
  readOnly,
  loading,
  error,
  success,
} satisfies Record<string, MantineDemo>
