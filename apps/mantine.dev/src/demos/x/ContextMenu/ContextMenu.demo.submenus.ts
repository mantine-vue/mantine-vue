/* oxlint-disable no-console */

import { defineComponent, h } from 'vue'
import { SimpleGrid } from '@mantine-vue/core'
import { useContextMenu, type ContextMenuItemOptions } from '@mantine-vue/contextmenu'
import {
  PhCopy,
  PhDownloadSimple,
  PhFileText,
  PhGear,
  PhImage,
  PhShareNetwork,
  PhUser,
} from '@phosphor-icons/vue'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'
import { ContextMenuTarget } from './_shared'

const submenusCode = `
<script setup lang="ts">
import { h } from 'vue'
import { PhGear, PhImage, PhShareNetwork } from '@phosphor-icons/vue'
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu } = useContextMenu()

const onContextMenu = showContextMenu([
  {
    key: 'share',
    icon: h(PhShareNetwork, { size: 16 }),
    items: [
      { key: 'copyLink', onClick: () => console.log('Copy link') },
      {
        key: 'export',
        items: [
          { key: 'png', title: 'PNG image', onClick: () => console.log('PNG') },
          { key: 'pdf', title: 'PDF document', onClick: () => console.log('PDF') },
        ],
      },
    ],
  },
  {
    key: 'settings',
    icon: h(PhGear, { size: 16 }),
    iconRight: h(PhImage, { size: 16 }),
    items: [
      { key: 'preferences', onClick: () => console.log('Preferences') },
    ],
  },
])
</script>

<template>
  <div @contextmenu="onContextMenu">Right-click to open nested submenus</div>
</template>
`

const SubmenusDemo = defineComponent({
  name: 'ContextMenuSubmenusDemo',
  setup() {
    const { showContextMenu } = useContextMenu()
    const action = (message: string) => () => notifications.show({ message })

    const items: ContextMenuItemOptions[] = [
      {
        key: 'share',
        icon: h(PhShareNetwork, { size: 16 }),
        items: [
          { key: 'copyLink', onClick: action('Link copied') },
          {
            key: 'export',
            items: [
              {
                key: 'png',
                title: 'PNG image',
                icon: h(PhImage, { size: 16 }),
                onClick: action('Exported as PNG'),
              },
              {
                key: 'pdf',
                title: 'PDF document',
                icon: h(PhFileText, { size: 16 }),
                onClick: action('Exported as PDF'),
              },
            ],
          },
        ],
      },
      {
        key: 'settings',
        icon: h(PhGear, { size: 16 }),
        iconRight: h(PhImage, { size: 16 }),
        items: [
          { key: 'preferences', onClick: action('Preferences opened') },
          { key: 'account', icon: h(PhUser, { size: 16 }), onClick: action('Account opened') },
        ],
      },
    ]

    return () =>
      h(ContextMenuTarget, {
        label: 'Right-click to open nested submenus',
        color: 'grape',
        onContextmenu: showContextMenu(items),
      })
  },
})

export const submenus: MantineDemo = {
  type: 'code',
  component: SubmenusDemo,
  code: submenusCode,
  maxWidth: 520,
}

const multipleTargetsCode = `
<script setup lang="ts">
import { h } from 'vue'
import { PhCopy, PhDownloadSimple } from '@phosphor-icons/vue'
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu } = useContextMenu()
const files = ['Annual report', 'Product mockup', 'Team photo']

const handlerFor = (file: string) =>
  showContextMenu([
    {
      key: 'copy',
      icon: h(PhCopy, { size: 16 }),
      title: \`Copy "\${file}"\`,
      onClick: () => console.log('Copy', file),
    },
    {
      key: 'download',
      icon: h(PhDownloadSimple, { size: 16 }),
      onClick: () => console.log('Download', file),
    },
  ])
</script>

<template>
  <div v-for="file in files" :key="file" @contextmenu="handlerFor(file)">
    {{ file }}
  </div>
</template>
`

const MultipleTargetsDemo = defineComponent({
  name: 'ContextMenuMultipleTargetsDemo',
  setup() {
    const { showContextMenu } = useContextMenu()
    const files = ['Annual report', 'Product mockup', 'Team photo']

    const handlerFor = (file: string) =>
      showContextMenu([
        {
          key: 'copy',
          icon: h(PhCopy, { size: 16 }),
          title: `Copy "${file}"`,
          onClick: () => notifications.show({ message: `${file} copied` }),
        },
        {
          key: 'download',
          icon: h(PhDownloadSimple, { size: 16 }),
          onClick: () => notifications.show({ message: `${file} download started` }),
        },
      ])

    return () =>
      h(SimpleGrid, { cols: { base: 1, sm: 3 } }, () =>
        files.map((file, index) =>
          h(ContextMenuTarget, {
            key: file,
            label: file,
            description: 'This target has contextual actions.',
            color: ['blue', 'teal', 'orange'][index],
            onContextmenu: handlerFor(file),
          }),
        ),
      )
  },
})

export const multipleTargets: MantineDemo = {
  type: 'code',
  component: MultipleTargetsDemo,
  code: multipleTargetsCode,
}
