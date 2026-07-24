import { defineComponent, h, watch } from 'vue'
import { ActionIcon, Button, Flex, Group, Stack, Text } from '@mantine-vue/core'
import { useHotkeys, useTimeout } from '@mantine-vue/hooks'
import { useContextMenu } from '@mantine-vue/contextmenu'
import { PhCopy, PhDownloadSimple, PhGear, PhInfo, PhX } from '@phosphor-icons/vue'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'
import { ContextMenuTarget } from './_shared'

const customContentCode = `
<script setup lang="ts">
import { h } from 'vue'
import { ActionIcon, Flex, Text } from '@mantine-vue/core'
import { PhCopy, PhDownloadSimple, PhGear } from '@phosphor-icons/vue'
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu } = useContextMenu()

const onContextMenu = showContextMenu((close) =>
  h(Flex, { p: 'xs', gap: 'xs', align: 'center' }, () => [
    h(Text, { size: 'sm', fw: 600, px: 'xs' }, () => 'Quick actions'),
    h(ActionIcon, {
      variant: 'light',
      'aria-label': 'Copy',
      onClick: () => {
        close()
        console.log('Copy')
      },
    }, () => h(PhCopy, { size: 18 })),
    h(ActionIcon, {
      variant: 'light',
      'aria-label': 'Download',
      onClick: () => {
        close()
        console.log('Download')
      },
    }, () => h(PhDownloadSimple, { size: 18 })),
  ]),
)
</script>

<template>
  <div @contextmenu="onContextMenu">Right-click for custom content</div>
</template>
`

const CustomContentDemo = defineComponent({
  name: 'ContextMenuCustomContentDemo',
  setup() {
    const { showContextMenu } = useContextMenu()
    const action = (close: () => void, message: string) => {
      close()
      notifications.show({ message })
    }

    return () =>
      h(ContextMenuTarget, {
        label: 'Right-click for custom content',
        color: 'cyan',
        onContextmenu: showContextMenu((close) =>
          h(Flex, { p: 'xs', gap: 'xs', align: 'center' }, () => [
            h(Text, { size: 'sm', fw: 600, px: 'xs' }, () => 'Quick actions'),
            h(
              ActionIcon,
              {
                variant: 'light',
                'aria-label': 'Copy',
                onClick: () => action(close, 'Copied'),
              },
              () => h(PhCopy, { size: 18 }),
            ),
            h(
              ActionIcon,
              {
                variant: 'light',
                'aria-label': 'Download',
                onClick: () => action(close, 'Download started'),
              },
              () => h(PhDownloadSimple, { size: 18 }),
            ),
            h(
              ActionIcon,
              {
                variant: 'light',
                'aria-label': 'Settings',
                onClick: () => action(close, 'Settings opened'),
              },
              () => h(PhGear, { size: 18 }),
            ),
          ]),
        ),
      })
  },
})

export const customContent: MantineDemo = {
  type: 'code',
  component: CustomContentDemo,
  code: customContentCode,
  maxWidth: 520,
}

const imperativeCode = `
<script setup lang="ts">
import { watch } from 'vue'
import { useHotkeys, useTimeout } from '@mantine-vue/hooks'
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu, hideContextMenu, isContextMenuVisible } = useContextMenu()
const timeout = useTimeout(hideContextMenu, 5000)

watch(isContextMenuVisible, (visible) => {
  if (visible) timeout.start()
  else timeout.clear()
})

useHotkeys([['H', hideContextMenu]])

const onContextMenu = showContextMenu([
  { key: 'details', onClick: () => console.log('Details') },
])
</script>

<template>
  <div @contextmenu="onContextMenu">Right-click this area</div>
  <Button :disabled="!isContextMenuVisible" @click="hideContextMenu">
    Hide context menu
  </Button>
</template>
`

const ImperativeDemo = defineComponent({
  name: 'ContextMenuImperativeDemo',
  setup() {
    const { showContextMenu, hideContextMenu, isContextMenuVisible } = useContextMenu()
    const timeout = useTimeout(hideContextMenu, 5000)

    watch(isContextMenuVisible, (visible) => {
      if (visible) {
        timeout.start()
      } else {
        timeout.clear()
      }
    })

    useHotkeys([['H', hideContextMenu]])

    return () =>
      h(Stack, null, () => [
        h(ContextMenuTarget, {
          label: 'Open a menu, then press H or use the button',
          description: 'The menu also closes automatically after five seconds.',
          color: 'lime',
          onContextmenu: showContextMenu([
            {
              key: 'details',
              icon: h(PhInfo, { size: 16 }),
              onClick: () => notifications.show({ message: 'Details opened' }),
            },
          ]),
        }),
        h(Group, { justify: 'space-between' }, () => [
          h(Text, { size: 'sm', c: isContextMenuVisible.value ? 'green' : 'dimmed' }, () =>
            isContextMenuVisible.value ? 'Menu is open' : 'Menu is closed',
          ),
          h(
            Button,
            {
              variant: 'light',
              leftSection: h(PhX, { size: 16 }),
              disabled: !isContextMenuVisible.value,
              onClick: hideContextMenu,
            },
            () => 'Hide context menu',
          ),
        ]),
      ])
  },
})

export const imperative: MantineDemo = {
  type: 'code',
  component: ImperativeDemo,
  code: imperativeCode,
}
