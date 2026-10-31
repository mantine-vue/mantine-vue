import { defineComponent, h, ref } from 'vue'
import {
  Badge,
  Button,
  Code,
  Group,
  Select,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine-vue/core'
import {
  createMemoryAdapter,
  FileManager,
  FileManagerError,
  useFileManager,
} from '@mantine-vue/file-manager'
import type {
  FileEntry,
  FileManagerAction,
  FileManagerItemSize,
  FileManagerPreviewRenderer,
  FileManagerViewDefinition,
  FileManagerViewItemProps,
  FileSystemAdapter,
} from '@mantine-vue/file-manager'
import type { MantineDemo } from '@/demo'
import { createDemoFiles, createLargeFolder } from './_data'

const HEIGHT = '520px'

/** The column of the documentation is narrow, the demos should still show the full layout. */
const DEMO_PROPS = { compactBreakpoint: 480 }

const usageCode = `
<script setup lang="ts">
import { FileManager, createMemoryAdapter } from '@mantine-vue/file-manager'

// Complete file system kept in memory. Swap it for your own adapter later.
const adapter = createMemoryAdapter({
  files: [
    { name: 'Documents', children: [{ name: 'Notes.txt', content: 'Hello' }] },
    { name: 'Photos', children: [] },
    { name: 'Read me.md', content: '# Welcome' },
  ],
})
</script>

<template>
  <FileManager :adapter="adapter" style="height: 520px" />
</template>
`

const Usage = defineComponent({
  name: 'FileManagerUsageDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })

    return () => h(FileManager, { ...DEMO_PROPS, adapter, style: { height: HEIGHT } })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: usageCode,
  maxWidth: '100%',
}

const advancedCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { FileManager, createMemoryAdapter } from '@mantine-vue/file-manager'
import type { FileFilters, FileSort } from '@mantine-vue/file-manager'

const files = [
  { name: 'Documents', children: [{ name: 'Report.pdf', size: 2_400_000 }] },
  { name: 'Read me.md', content: '# Welcome' },
]
const adapter = createMemoryAdapter({ files, latency: [80, 240], quota: 500 * 1024 * 1024 })

const view = ref('grid')
const sort = ref<FileSort>({ field: 'modifiedAt', direction: 'desc' })
const filters = ref<FileFilters>({})
const selectedIds = ref<string[]>([])
</script>

<template>
  <FileManager
    v-model:view="view"
    v-model:sort="sort"
    v-model:filters="filters"
    v-model:selected-ids="selectedIds"
    :adapter="adapter"
    :restrictions="{ maxFileSize: 25 * 1024 * 1024, maxFiles: 20 }"
    :upload-concurrency="2"
    :confirm="{ delete: true, emptyTrash: true, trash: false }"
    conflict-strategy="ask"
    style="height: 560px"
    @open="(entry) => console.log('opened', entry.name)"
  />
</template>
`

const Advanced = defineComponent({
  name: 'FileManagerAdvancedDemo',
  setup() {
    const adapter = createMemoryAdapter({
      files: createDemoFiles(),
      latency: [80, 240],
      quota: 500 * 1024 * 1024,
    })
    const view = ref('grid')
    const sort = ref({ field: 'modifiedAt' as const, direction: 'desc' as const })
    const selectedIds = ref<string[]>([])

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Group, { gap: 'xs' }, () => [
          h(Badge, { variant: 'light' }, () => `view: ${view.value}`),
          h(Badge, { variant: 'light' }, () => `sort: ${sort.value.field} ${sort.value.direction}`),
          h(Badge, { variant: 'light' }, () => `selected: ${selectedIds.value.length}`),
        ]),
        h(FileManager, {
          ...DEMO_PROPS,
          adapter,
          view: view.value,
          'onUpdate:view': (value: string) => {
            view.value = value
          },
          sort: sort.value,
          'onUpdate:sort': (value: any) => {
            sort.value = value
          },
          selectedIds: selectedIds.value,
          'onUpdate:selectedIds': (value: string[]) => {
            selectedIds.value = value
          },
          restrictions: { maxFileSize: 25 * 1024 * 1024, maxFiles: 20 },
          uploadConcurrency: 2,
          confirm: { delete: true, emptyTrash: true, trash: false },
          style: { height: '560px' },
        }),
      ])
  },
})

export const advanced: MantineDemo = {
  type: 'code',
  component: Advanced,
  code: advancedCode,
  maxWidth: '100%',
}

const themingCode = `
<template>
  <!-- The manager inherits the font and every color of your Mantine theme. These props set
       what is specific to it, and work the same in light and dark mode. -->
  <div style="font-family: Georgia, serif; height: 520px">
    <FileManager
      :adapter="adapter"
      color="grape"
      folder-color="teal"
      radius="lg"
      item-size="lg"
      default-view="grid"
    />
  </div>
</template>
`

const Theming = defineComponent({
  name: 'FileManagerThemingDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })
    const { colorScheme, toggleColorScheme } = useMantineColorScheme() as any
    const color = ref('grape')

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Group, { gap: 'xs' }, () => [
          ...['grape', 'teal', 'orange', 'indigo'].map((value) =>
            h(
              Button,
              {
                key: value,
                size: 'xs',
                color: value,
                variant: color.value === value ? 'filled' : 'light',
                onClick: () => {
                  color.value = value
                },
              },
              () => value,
            ),
          ),
          h(
            Button,
            { size: 'xs', variant: 'default', onClick: () => toggleColorScheme?.() },
            () => `Color scheme: ${colorScheme?.value ?? 'auto'}`,
          ),
        ]),
        h(
          'div',
          { style: { fontFamily: 'Georgia, serif', height: HEIGHT } },
          h(FileManager, {
            ...DEMO_PROPS,
            adapter,
            color: color.value,
            folderColor: 'teal',
            radius: 'lg',
            itemSize: 'lg',
            defaultView: 'grid',
          }),
        ),
      ])
  },
})

export const theming: MantineDemo = {
  type: 'code',
  component: Theming,
  code: themingCode,
  maxWidth: '100%',
}

const layoutsCode = `
<template>
  <FileManager
    :adapter="adapter"
    default-view="gallery"
    item-size="sm"
    :views="['gallery', 'grid', 'tree']"
    :sections="{ sidebar: false, statusBar: false, details: false }"
    style="height: 480px"
  />
</template>
`

const Layouts = defineComponent({
  name: 'FileManagerLayoutsDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })
    const size = ref<FileManagerItemSize>('md')
    const withSidebar = ref(true)
    const withBreadcrumbs = ref(true)

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Group, { gap: 'xs', align: 'flex-end' }, () => [
          h(Select, {
            size: 'xs',
            label: 'Item size',
            data: ['sm', 'md', 'lg'],
            modelValue: size.value,
            'onUpdate:modelValue': (value: any) => {
              size.value = value ?? 'md'
            },
          }),
          h(
            Button,
            {
              size: 'xs',
              variant: 'default',
              onClick: () => {
                withSidebar.value = !withSidebar.value
              },
            },
            () => (withSidebar.value ? 'Hide sidebar' : 'Show sidebar'),
          ),
          h(
            Button,
            {
              size: 'xs',
              variant: 'default',
              onClick: () => {
                withBreadcrumbs.value = !withBreadcrumbs.value
              },
            },
            () => (withBreadcrumbs.value ? 'Hide breadcrumbs' : 'Show breadcrumbs'),
          ),
        ]),
        h(FileManager, {
          ...DEMO_PROPS,
          adapter,
          defaultView: 'gallery',
          itemSize: size.value,
          sections: { sidebar: withSidebar.value, breadcrumbs: withBreadcrumbs.value },
          style: { height: HEIGHT },
        }),
      ])
  },
})

export const layouts: MantineDemo = {
  type: 'code',
  component: Layouts,
  code: layoutsCode,
  maxWidth: '100%',
}

const customViewCode = `
<script setup lang="ts">
import type { FileManagerViewDefinition } from '@mantine-vue/file-manager'
import FileCard from './FileCard.vue'

// A view only draws one entry. Selection, keyboard, drag and drop and menus keep working.
const cards: FileManagerViewDefinition = {
  name: 'cards',
  label: 'Cards',
  icon: 'viewList',
  layout: 'grid',
  rowHeight: 76,
  minItemWidth: 240,
  component: FileCard,
}
</script>

<template>
  <FileManager
    :adapter="adapter"
    default-view="cards"
    :views="['details', cards]"
    style="height: 520px"
  />
</template>
`

const FileCard = defineComponent<FileManagerViewItemProps>({
  name: 'FileManagerCardDemo',
  props: ['entry', 'selected', 'active', 'cut', 'depth'] as any,
  setup(props) {
    return () =>
      h(
        'div',
        {
          style: {
            height: '68px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--mantine-color-default-border)',
            background: props.selected ? 'var(--mantine-primary-color-light)' : undefined,
          },
        },
        [
          h(Text, { size: 'sm', fw: 600, truncate: true }, () => props.entry.name),
          h(Badge, { size: 'xs', variant: 'light' }, () => props.entry.kind),
        ],
      )
  },
})

const CustomView = defineComponent({
  name: 'FileManagerCustomViewDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })
    const cards: FileManagerViewDefinition = {
      name: 'cards',
      label: 'Cards',
      icon: 'viewList',
      layout: 'grid',
      rowHeight: 76,
      minItemWidth: 240,
      component: FileCard,
    }

    return () =>
      h(FileManager, {
        ...DEMO_PROPS,
        adapter,
        defaultView: 'cards',
        views: ['details', cards],
        style: { height: HEIGHT },
      })
  },
})

export const customView: MantineDemo = {
  type: 'code',
  component: CustomView,
  code: customViewCode,
  maxWidth: '100%',
}

const actionsCode = `
<script setup lang="ts">
import type { FileManagerAction } from '@mantine-vue/file-manager'

const share: FileManagerAction = {
  id: 'share',
  label: 'Copy share link',
  icon: 'copy',
  visible: ({ entries }) => entries.length === 1,
  run: ({ entries }) => navigator.clipboard.writeText(linkTo(entries[0])),
}
</script>

<template>
  <FileManager
    :adapter="adapter"
    :actions="[share]"
    :toolbar-actions="['newFolder', 'upload', 'divider', 'share', 'delete']"
    :item-menu="['open', 'share', 'divider', 'rename', 'delete']"
    :shortcuts="{ share: 'mod+shift+L' }"
    style="height: 480px"
  />
</template>
`

const Actions = defineComponent({
  name: 'FileManagerActionsDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })
    const log = ref('Select a file and run the custom action')
    const share: FileManagerAction = {
      id: 'share',
      label: 'Copy share link',
      icon: 'copy',
      visible: ({ entries }) => entries.length === 1,
      run: ({ entries }) => {
        log.value = `https://files.example.com/${encodeURIComponent(entries[0].name)}`
      },
    }

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Code, () => log.value),
        h(FileManager, {
          ...DEMO_PROPS,
          adapter,
          actions: [share],
          toolbarActions: ['newFolder', 'upload', 'divider', 'share', 'delete'],
          itemMenu: ['open', 'share', 'divider', 'rename', 'delete'],
          shortcuts: { share: 'mod+shift+L' },
          style: { height: '480px' },
        }),
      ])
  },
})

export const actions: MantineDemo = {
  type: 'code',
  component: Actions,
  code: actionsCode,
  maxWidth: '100%',
}

const mockBackendCode = `
<script setup lang="ts">
import { createMemoryAdapter, FileManagerError } from '@mantine-vue/file-manager'

const failing = ref(false)

const adapter = createMemoryAdapter({
  files,
  latency: [150, 500],
  // Runs before every request, which makes error states easy to demonstrate and test.
  onRequest: (operation) => {
    if (failing.value && operation !== 'list') {
      throw new FileManagerError('network', 'The server is not reachable')
    }
  },
})
</script>
`

const MockBackend = defineComponent({
  name: 'FileManagerMockBackendDemo',
  setup() {
    const failing = ref(false)
    const adapter = createMemoryAdapter({
      files: createDemoFiles(),
      latency: [150, 500],
      onRequest: (operation) => {
        if (failing.value && operation !== 'list') {
          throw new FileManagerError('network', 'The server is not reachable')
        }
      },
    })

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(
          Button,
          {
            size: 'xs',
            w: 'fit-content',
            color: failing.value ? 'red' : undefined,
            onClick: () => {
              failing.value = !failing.value
            },
          },
          () => (failing.value ? 'Backend is failing' : 'Simulate a failing backend'),
        ),
        h(FileManager, { ...DEMO_PROPS, adapter, style: { height: HEIGHT } }),
      ])
  },
})

export const mockBackend: MantineDemo = {
  type: 'code',
  component: MockBackend,
  code: mockBackendCode,
  maxWidth: '100%',
}

const customAdapterCode = `
<script setup lang="ts">
import type { FileEntry, FileSystemAdapter } from '@mantine-vue/file-manager'

// Only \`list\` is required. Every method left out removes its feature from the interface, so
// this read-only adapter gets no upload, rename or delete controls.
const adapter: FileSystemAdapter = {
  async list({ folderId }) {
    const items = await api.getFolder(folderId)

    return {
      folder: { id: folderId ?? 'root', name: 'Catalog', kind: 'folder', parentId: null },
      ancestors: [],
      items,
    }
  },

  async download({ id }) {
    return { fileName: id, url: api.fileUrl(id) }
  },
}
</script>

<template>
  <FileManager :adapter="adapter" style="height: 400px" />
</template>
`

const CATALOG: FileEntry[] = [
  { id: 'a', name: 'Terms of service.txt', kind: 'file', parentId: 'root', size: 2048 },
  { id: 'b', name: 'Privacy policy.txt', kind: 'file', parentId: 'root', size: 4096 },
  { id: 'c', name: 'Press kit.zip', kind: 'file', parentId: 'root', size: 1_048_576 },
]

const CustomAdapter = defineComponent({
  name: 'FileManagerCustomAdapterDemo',
  setup() {
    const adapter: FileSystemAdapter = {
      async list({ folderId }) {
        return {
          folder: { id: folderId ?? 'root', name: 'Catalog', kind: 'folder', parentId: null },
          ancestors: [],
          items: CATALOG,
        }
      },
      async download({ id }) {
        const entry = CATALOG.find((item) => item.id === id)

        return { fileName: entry?.name ?? id, blob: new Blob([entry?.name ?? ''], {}) }
      },
    }

    return () => h(FileManager, { ...DEMO_PROPS, adapter, style: { height: '400px' } })
  },
})

export const customAdapter: MantineDemo = {
  type: 'code',
  component: CustomAdapter,
  code: customAdapterCode,
  maxWidth: '100%',
}

const mobileCode = `
<template>
  <!-- layout="auto" (the default) measures the component, not the viewport. -->
  <FileManager :adapter="adapter" layout="compact" style="height: 640px; max-width: 390px" />
</template>
`

const Mobile = defineComponent({
  name: 'FileManagerMobileDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createDemoFiles() })

    return () =>
      h(
        'div',
        { style: { maxWidth: '390px', height: '640px', marginInline: 'auto' } },
        h(FileManager, { adapter, layout: 'compact', defaultView: 'list' }),
      )
  },
})

export const mobile: MantineDemo = {
  type: 'code',
  component: Mobile,
  code: mobileCode,
  maxWidth: '100%',
}

const largeCode = `
<template>
  <!-- Open the folder: 50 000 entries, and only the visible rows exist in the DOM. -->
  <FileManager
    :adapter="adapter"
    pagination="infinite"
    :page-size="500"
    style="height: 480px"
  />
</template>
`

const Large = defineComponent({
  name: 'FileManagerLargeDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createLargeFolder(50_000) })

    return () =>
      h(FileManager, {
        ...DEMO_PROPS,
        adapter,
        pagination: 'infinite',
        pageSize: 500,
        style: { height: '480px' },
      })
  },
})

export const large: MantineDemo = {
  type: 'code',
  component: Large,
  code: largeCode,
  maxWidth: '100%',
}

const pagesCode = `
<template>
  <FileManager :adapter="adapter" pagination="pages" :page-size="50" style="height: 480px" />
</template>
`

const Pages = defineComponent({
  name: 'FileManagerPagesDemo',
  setup() {
    const adapter = createMemoryAdapter({ files: createLargeFolder(1_000) })

    return () =>
      h(FileManager, {
        ...DEMO_PROPS,
        adapter,
        pagination: 'pages',
        pageSize: 50,
        style: { height: '480px' },
      })
  },
})

export const pages: MantineDemo = {
  type: 'code',
  component: Pages,
  code: pagesCode,
  maxWidth: '100%',
}

const previewCode = `
<script setup lang="ts">
import type { FileManagerPreviewRenderer } from '@mantine-vue/file-manager'
import CsvTable from './CsvTable.vue'

// Tried before the built-in previews. The component receives \`entry\`, \`source\` and \`url\`.
const renderers: FileManagerPreviewRenderer[] = [
  { test: (entry) => entry.name.endsWith('.csv'), component: CsvTable },
]
</script>

<template>
  <FileManager :adapter="adapter" :preview-renderers="renderers" style="height: 520px" />
</template>
`

const CsvTable = defineComponent({
  name: 'FileManagerCsvDemo',
  props: ['entry', 'source', 'url'],
  setup(props) {
    return () =>
      h(
        'table',
        { style: { margin: '16px', borderCollapse: 'collapse' } },
        h(
          'tbody',
          String(props.source?.text ?? '')
            .trim()
            .split('\n')
            .map((line) =>
              h(
                'tr',
                line.split(',').map((cell) => h('td', { style: { padding: '4px 12px' } }, cell)),
              ),
            ),
        ),
      )
  },
})

const Preview = defineComponent({
  name: 'FileManagerPreviewDemo',
  setup() {
    const adapter = createMemoryAdapter({
      files: [
        { name: 'Sales.csv', content: 'Month,Sales\nJanuary,1200\nFebruary,1450\nMarch,990\n' },
        ...createDemoFiles(),
      ],
    })
    const renderers: FileManagerPreviewRenderer[] = [
      { test: (entry) => entry.name.endsWith('.csv'), component: CsvTable },
    ]

    return () =>
      h(FileManager, {
        ...DEMO_PROPS,
        adapter,
        previewRenderers: renderers,
        style: { height: HEIGHT },
      })
  },
})

export const preview: MantineDemo = {
  type: 'code',
  component: Preview,
  code: previewCode,
  maxWidth: '100%',
}

const headlessCode = `
<script setup lang="ts">
import { FileManager, createMemoryAdapter, useFileManager } from '@mantine-vue/file-manager'

const adapter = createMemoryAdapter({
  files: [{ name: 'Documents', children: [] }, { name: 'Read me.md', content: '# Welcome' }],
})
const manager = useFileManager({ adapter })
</script>

<template>
  <Button @click="manager.openFolder(null)">Go home</Button>
  <Text>{{ manager.selectedEntries.value.length }} selected</Text>
  <FileManager :controller="manager" style="height: 520px" />
</template>
`

const Headless = defineComponent({
  name: 'FileManagerHeadlessDemo',
  setup() {
    const manager = useFileManager({
      adapter: createMemoryAdapter({ files: createDemoFiles() }),
    })

    return () =>
      h(Stack, { gap: 'xs' }, () => [
        h(Group, { gap: 'xs' }, () => [
          h(Button, { size: 'xs', onClick: () => manager.openFolder(null) }, () => 'Go home'),
          h(
            Button,
            { size: 'xs', variant: 'default', onClick: () => manager.selectAll() },
            () => 'Select all',
          ),
          h(Text, { size: 'sm' }, () => `${manager.selectedEntries.value.length} selected`),
        ]),
        h(FileManager, { ...DEMO_PROPS, controller: manager, style: { height: HEIGHT } }),
      ])
  },
})

export const headless: MantineDemo = {
  type: 'code',
  component: Headless,
  code: headlessCode,
  maxWidth: '100%',
}
