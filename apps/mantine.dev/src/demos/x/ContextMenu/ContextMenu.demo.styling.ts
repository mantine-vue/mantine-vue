import { defineComponent, h } from 'vue'
import { DirectionProvider, Text } from '@mantine-vue/core'
import {
  ContextMenuProvider,
  useContextMenu,
  type ContextMenuItemOptions,
} from '@mantine-vue/contextmenu'
import { PhCopy, PhDownloadSimple, PhFileText, PhShareNetwork, PhTrash } from '@phosphor-icons/vue'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'
import { ContextMenuTarget } from './_shared'

const stylingCode = `
<script setup lang="ts">
import { h } from 'vue'
import { PhCopy, PhDownloadSimple } from '@phosphor-icons/vue'
import { useContextMenu } from '@mantine-vue/contextmenu'

const { showContextMenu } = useContextMenu()

const onContextMenu = showContextMenu(
  [
    {
      key: 'copy',
      icon: h(PhCopy, { size: 16 }),
      className: 'copy-action',
      onClick: () => console.log('Copy'),
    },
    { key: 'divider', style: (theme) => ({ background: theme.colors.orange[6] }) },
    {
      key: 'download',
      icon: h(PhDownloadSimple, { size: 16 }),
      style: { color: '#0d8527', fontStyle: 'italic' },
      onClick: () => console.log('Download'),
    },
  ],
  {
    classNames: { root: 'context-menu-root' },
    styles: {
      root: { borderColor: 'var(--mantine-color-violet-5)' },
      item: { fontWeight: 500 },
    },
  },
)
</script>

<template>
  <div @contextmenu="onContextMenu">Right-click this styled target</div>
</template>
`

const StylingDemo = defineComponent({
  name: 'ContextMenuStylingDemo',
  setup() {
    const { showContextMenu } = useContextMenu()
    const notify = (message: string) => notifications.show({ message })

    return () =>
      h(ContextMenuTarget, {
        label: 'Right-click this styled target',
        color: 'orange',
        onContextmenu: showContextMenu(
          [
            {
              key: 'copy',
              icon: h(PhCopy, { size: 16 }),
              style: { color: '#7048e8' },
              onClick: () => notify('Copied'),
            },
            {
              key: 'divider',
              style: (theme) => ({ background: theme.colors.orange[6] }),
            },
            {
              key: 'download',
              icon: h(PhDownloadSimple, { size: 16 }),
              style: { color: '#0d8527', fontStyle: 'italic' },
              onClick: () => notify('Download started'),
            },
          ],
          {
            styles: {
              root: {
                borderColor: 'var(--mantine-color-violet-5)',
                borderWidth: '2px',
              },
              item: { fontWeight: 500 },
            },
          },
        ),
      })
  },
})

export const styling: MantineDemo = {
  type: 'code',
  component: StylingDemo,
  code: stylingCode,
  maxWidth: 520,
}

const providerCode = `
<script setup lang="ts">
import { ContextMenuProvider } from '@mantine-vue/contextmenu'
import ContextTarget from './ContextTarget.vue'
</script>

<template>
  <ContextMenuProvider
    shadow="xl"
    border-radius="md"
    :submenu-delay="150"
    reposition-on-repeat
  >
    <ContextTarget />
  </ContextMenuProvider>
</template>
`

const ProviderTarget = defineComponent({
  name: 'ContextMenuProviderTarget',
  setup() {
    const { showContextMenu } = useContextMenu()

    return () =>
      h(ContextMenuTarget, {
        label: 'Right-click, then right-click somewhere else',
        description: 'The menu repositions and submenus open after 150ms.',
        color: 'pink',
        onContextmenu: showContextMenu([
          {
            key: 'file',
            icon: h(PhFileText, { size: 16 }),
            items: [
              { key: 'rename', onClick: () => notifications.show({ message: 'Rename' }) },
              { key: 'duplicate', onClick: () => notifications.show({ message: 'Duplicate' }) },
            ],
          },
        ]),
      })
  },
})

const ProviderDemo = defineComponent({
  name: 'ContextMenuProviderSettingsDemo',
  setup() {
    return () =>
      h(
        ContextMenuProvider,
        {
          shadow: 'xl',
          borderRadius: 'md',
          submenuDelay: 150,
          repositionOnRepeat: true,
        },
        () => h(ProviderTarget),
      )
  },
})

export const providerSettings: MantineDemo = {
  type: 'code',
  component: ProviderDemo,
  code: providerCode,
  maxWidth: 560,
}

const rtlCode = `
<script setup lang="ts">
import { DirectionProvider } from '@mantine-vue/core'
import { ContextMenuProvider } from '@mantine-vue/contextmenu'
import RtlTarget from './RtlTarget.vue'
</script>

<template>
  <DirectionProvider initial-direction="rtl">
    <ContextMenuProvider>
      <RtlTarget />
    </ContextMenuProvider>
  </DirectionProvider>
</template>
`

const RtlTarget = defineComponent({
  name: 'ContextMenuRtlTarget',
  setup() {
    const { showContextMenu } = useContextMenu()
    const action = (message: string) => () => notifications.show({ message })
    const items: ContextMenuItemOptions[] = [
      {
        key: 'copy',
        title: 'نسخ',
        icon: h(PhCopy, { size: 16 }),
        onClick: action('تم النسخ'),
      },
      {
        key: 'share',
        title: 'مشاركة',
        icon: h(PhShareNetwork, { size: 16 }),
        items: [
          { key: 'email', title: 'البريد الإلكتروني', onClick: action('البريد الإلكتروني') },
          { key: 'document', title: 'مستند', onClick: action('مستند') },
        ],
      },
      { key: 'divider' },
      {
        key: 'delete',
        title: 'حذف',
        color: 'red',
        icon: h(PhTrash, { size: 16 }),
        onClick: action('تم الحذف'),
      },
    ]

    return () =>
      h('div', { dir: 'rtl' }, [
        h(
          Text,
          { mb: 'sm', ta: 'right' },
          () => 'تدعم القائمة اتجاه الكتابة من اليمين إلى اليسار.',
        ),
        h(ContextMenuTarget, {
          label: 'انقر بزر الفأرة الأيمن هنا',
          description: 'تفتح القوائم الفرعية إلى اليسار.',
          color: 'teal',
          onContextmenu: showContextMenu(items),
        }),
      ])
  },
})

const RtlDemo = defineComponent({
  name: 'ContextMenuRtlDemo',
  setup() {
    return () =>
      h(DirectionProvider, { initialDirection: 'rtl' }, () =>
        h(ContextMenuProvider, null, () => h(RtlTarget)),
      )
  },
})

export const rtl: MantineDemo = {
  type: 'code',
  component: RtlDemo,
  code: rtlCode,
  maxWidth: 560,
}
