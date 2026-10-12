import { defineComponent, h } from 'vue'
import {
  JsonViewer,
  serializeJsonViewerPath,
  type JsonViewerHighlightType,
  type JsonViewerProps,
} from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

function createDemo(value: unknown, props: Omit<JsonViewerProps, 'value'> = {}): MantineDemo {
  const propCode = Object.entries(props)
    .map(([key, item]) => {
      if (item === true) return ` ${key}`
      if (typeof item === 'string') return ` ${key}="${item}"`
      return ` :${key}="${JSON.stringify(item)}"`
    })
    .join('')

  return {
    type: 'code',
    component: defineComponent({ setup: () => () => h(JsonViewer as any, { value, ...props }) }),
    code: `<script setup lang="ts">
import { JsonViewer } from '@mantine-vue/code-highlight'

const data = ${JSON.stringify(value, null, 2)}
</script>

<template>
  <JsonViewer :value="data"${propCode} />
</template>`,
  }
}

const usageData = {
  name: 'Mantine Vue',
  version: '1.0.0',
  description: 'Vue components library',
  homepage: 'https://mantine-vue.dev',
  license: 'MIT',
  keywords: ['vue', 'components', 'ui'],
  author: { name: 'Hasan Alhawaj', url: 'https://github.com/hasan-alhawaj' },
  credit: { name: 'Vitaly Rtishchev', url: 'https://github.com/rtivital' },
  repository: { type: 'git', url: 'https://github.com/mantine-vue/mantine-vue' },
  bugs: { url: 'https://github.com/mantine-vue/mantine-vueissues' },
  dependencies: { vue: '^3.5.0' },
  devDependencies: null,
  private: false,
  sideEffects: false,
}

export const usage = createDemo(usageData)
export const expandDepth = createDemo(
  {
    user: {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        coordinates: { lat: 39.7817, lng: -89.6501 },
      },
      contacts: [
        { type: 'email', value: 'john@example.com' },
        { type: 'phone', value: '+1-555-0123' },
      ],
    },
  },
  { defaultExpandDepth: 3 },
)
export const controls = createDemo(
  {
    users: [
      { id: 1, name: 'Alice', roles: ['admin', 'user'] },
      { id: 2, name: 'Bob', roles: ['user'] },
      { id: 3, name: 'Charlie', roles: ['moderator', 'user'] },
    ],
    settings: { theme: 'dark', notifications: { email: true, push: false } },
  },
  { withControls: true },
)
export const rootName = createDemo(
  { id: 1, name: 'Mantine Vue', type: 'library' },
  { rootName: 'response' },
)
export const withTypes = createDemo(
  { name: 'Mantine Vue', version: 1, stable: true, deprecated: null, tags: ['vue', 'ui'] },
  { withTypes: true, withSize: true },
)
export const withCopy = createDemo(
  {
    name: 'Mantine Vue',
    version: '1.0.0',
    description: 'Vue components library',
    keywords: ['vue', 'components', 'ui'],
    author: { name: 'Hasan Alhawaj', url: 'https://github.com/hasan-alhawaj' },
    credit: { name: 'Vitaly Rtishchev', url: 'https://github.com/rtivital' },
  },
  { withCopy: true },
)
export const collapseStrings = createDemo(
  {
    title: 'Short title',
    description:
      'This is a very long description that will be collapsed because it exceeds the configured character limit for string display in the JSON viewer component.',
    content:
      'Another long string value that demonstrates how the collapseStringsAfterLength prop works with different string lengths in the viewer.',
    short: 'ok',
  },
  { collapseStringsAfterLength: 30 },
)
export const sortKeys = createDemo(
  {
    zebra: 'last',
    apple: 'first',
    mango: 'middle',
    banana: 'second',
    nested: { zoo: 3, ark: 1, bee: 2 },
  },
  { sortKeys: true },
)

const highlightData = {
  name: '@mantine/core',
  version: '1.0.0',
  description: 'Vue components library',
  deprecated: 'Use @mantine/core@9 instead',
  license: 'MIT',
  author: { name: 'Hasan Alhawaj', url: 'https://github.com/hasan-alhawaj' },
  credit: { name: 'Vitaly Rtishchev', url: 'https://github.com/rtivital' },
  repository: { type: 'git', url: 'https://github.com/mantinedev/mantine' },
}
const highlightItems: Record<string, JsonViewerHighlightType> = {
  [serializeJsonViewerPath(['version'])]: 'added',
  [serializeJsonViewerPath(['deprecated'])]: 'removed',
  [serializeJsonViewerPath(['author', 'url'])]: 'added',
}
export const highlight: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(JsonViewer, { value: highlightData, highlightItems, defaultExpandDepth: 3 }),
  }),
  code: `<script setup lang="ts">
import { JsonViewer, serializeJsonViewerPath } from '@mantine-vue/code-highlight'
// highlightItems maps serialized property paths to 'added' or 'removed'
</script>`,
}
export const allExpanded = createDemo(
  {
    user: {
      name: 'John Doe',
      address: { street: '123 Main St', city: 'Springfield' },
      contacts: [
        { type: 'email', value: 'john@example.com' },
        { type: 'phone', value: '+1-555-0123' },
      ],
    },
    settings: { theme: 'dark', notifications: { email: true, push: false } },
  },
  { allExpanded: true },
)
export const lineNumbers = createDemo(
  {
    name: 'Mantine Vue',
    version: '1.0.0',
    description: 'Vue components library',
    keywords: ['vue', 'components', 'ui'],
    author: { name: 'Hasan Alhawaj', url: 'https://github.com/hasan-alhawaj' },
    credit: { name: 'Vitaly Rtishchev', url: 'https://github.com/rtivital' },
    license: 'MIT',
    private: false,
  },
  { withLineNumbers: true },
)
export const withChevrons = createDemo(
  {
    user: { name: 'John Doe', address: { city: 'Springfield', state: 'IL' } },
    settings: { theme: 'dark', notifications: true },
  },
  { withChevrons: true },
)

export const JsonViewerDemos = {
  usage,
  expandDepth,
  controls,
  rootName,
  withTypes,
  withCopy,
  collapseStrings,
  sortKeys,
  highlight,
  allExpanded,
  lineNumbers,
  withChevrons,
}
