import { defineComponent, h, ref } from 'vue'
import { Group, Switch } from '@mantine-vue/core'
import { useContextMenu, type ContextMenuItemOptions } from '@mantine-vue/contextmenu'
import { notifications } from '@mantine-vue/notifications'
import { PhCopy, PhDownloadSimple, PhInfo, PhTrash, PhWarningCircle } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import { ContextMenuTarget } from './_shared'

const usageCode = `
<script setup lang="ts">
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu } = useContextMenu()

const onContextMenu = showContextMenu([
  {
    key: 'copy',
    title: 'Copy to clipboard',
    onClick: () => navigator.clipboard.writeText('Mantine Vue'),
  },
  {
    key: 'download',
    title: 'Download file',
    onClick: () => console.log('Download'),
  },
])
</script>

<template>
  <div @contextmenu="onContextMenu">Right-click this area</div>
</template>
`

const UsageDemo = defineComponent({
  name: 'ContextMenuUsageDemo',
  setup() {
    const { showContextMenu } = useContextMenu()
    const notify = (message: string) => notifications.show({ message })

    return () =>
      h(ContextMenuTarget, {
        onContextmenu: showContextMenu([
          {
            key: 'copy',
            title: 'Copy to clipboard',
            onClick: () => notify('Copied to clipboard'),
          },
          {
            key: 'download',
            title: 'Download file',
            onClick: () => notify('Download started'),
          },
        ]),
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: UsageDemo,
  code: usageCode,
  maxWidth: 520,
}

const actionsCode = `
<script setup lang="ts">
import { h, ref } from 'vue'
import { PhCopy, PhDownloadSimple, PhInfo, PhTrash } from '@phosphor-icons/vue'
import { useContextMenu, type ContextMenuItemOptions } from '@mantine-vue/contextmenu'

const hideDownload = ref(false)
const disableDelete = ref(true)
const { showContextMenu } = useContextMenu()

const getItems = (): ContextMenuItemOptions[] => [
  {
    key: 'copy',
    icon: h(PhCopy, { size: 16 }),
    onClick: () => console.log('Copy'),
  },
  {
    key: 'download',
    title: 'Save to your computer',
    iconRight: h(PhDownloadSimple, { size: 16 }),
    hidden: hideDownload.value,
    onClick: () => console.log('Download'),
  },
  { key: 'divider' },
  {
    key: 'details',
    color: 'blue',
    icon: h(PhInfo, { size: 16 }),
    onClick: () => console.log('Details'),
  },
  {
    key: 'delete',
    color: 'red',
    icon: h(PhTrash, { size: 16 }),
    disabled: disableDelete.value,
    onClick: () => console.log('Delete'),
  },
]

const onContextMenu = (event: MouseEvent) => showContextMenu(getItems())(event)
</script>

<template>
  <Switch v-model="hideDownload" label="Hide download action" />
  <Switch v-model="disableDelete" label="Disable delete action" />
  <div @contextmenu="onContextMenu">Right-click this area</div>
</template>
`

const ActionsDemo = defineComponent({
  name: 'ContextMenuActionsDemo',
  setup() {
    const hideDownload = ref(false)
    const disableDelete = ref(true)
    const { showContextMenu } = useContextMenu()
    const notify = (message: string, color?: string) => notifications.show({ message, color })

    const getItems = (): ContextMenuItemOptions[] => [
      {
        key: 'copy',
        icon: h(PhCopy, { size: 16 }),
        onClick: () => notify('Copied'),
      },
      {
        key: 'download',
        title: 'Save to your computer',
        iconRight: h(PhDownloadSimple, { size: 16 }),
        hidden: hideDownload.value,
        onClick: () => notify('Download started'),
      },
      { key: 'divider' },
      {
        key: 'details',
        color: 'blue',
        icon: h(PhInfo, { size: 16 }),
        onClick: () => notify('Details opened', 'blue'),
      },
      {
        key: 'delete',
        color: 'red',
        icon: h(PhTrash, { size: 16 }),
        iconRight: h(PhWarningCircle, { size: 16 }),
        disabled: disableDelete.value,
        onClick: () => notify('Deleted', 'red'),
      },
    ]

    return () =>
      h('div', [
        h(Group, { mb: 'md' }, () => [
          h(Switch, {
            label: 'Hide download',
            modelValue: hideDownload.value,
            'onUpdate:modelValue': (value: boolean) => {
              hideDownload.value = value
            },
          }),
          h(Switch, {
            label: 'Disable delete',
            modelValue: disableDelete.value,
            'onUpdate:modelValue': (value: boolean) => {
              disableDelete.value = value
            },
          }),
        ]),
        h(ContextMenuTarget, {
          color: 'violet',
          onContextmenu: (event: MouseEvent) => showContextMenu(getItems())(event),
        }),
      ])
  },
})

export const actions: MantineDemo = {
  type: 'code',
  component: ActionsDemo,
  code: actionsCode,
}
