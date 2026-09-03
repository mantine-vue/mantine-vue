import { defineComponent, h, ref } from 'vue'
import { PhArchive, PhFolder, PhTrash } from '@phosphor-icons/vue'
import { ActionBar, ActionIcon, Button, Checkbox, Group, Text, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
]

function selectionTable(selection: number[], update: (value: number[]) => void) {
  const toggle = (position: number) =>
    update(
      selection.includes(position)
        ? selection.filter((item) => item !== position)
        : [...selection, position],
    )
  const all = selection.length === elements.length
  const cellStyle = {
    padding: '8px',
    borderBottom: '1px solid var(--mantine-color-default-border)',
  }

  return h('table', { style: { width: '100%', borderCollapse: 'collapse' } }, [
    h('thead', [
      h('tr', [
        h('th', { style: cellStyle }, [
          h(Checkbox, {
            ariaLabel: 'Select all rows',
            modelValue: all,
            indeterminate: selection.length > 0 && !all,
            'onUpdate:modelValue': () =>
              update(all ? [] : elements.map((element) => element.position)),
          }),
        ]),
        ...['Position', 'Name', 'Symbol', 'Atomic mass'].map((value) =>
          h('th', { style: { ...cellStyle, textAlign: 'left' } }, value),
        ),
      ]),
    ]),
    h(
      'tbody',
      elements.map((element) =>
        h(
          'tr',
          {
            style: selection.includes(element.position)
              ? { background: 'var(--mantine-color-blue-light)' }
              : undefined,
          },
          [
            h('td', { style: cellStyle }, [
              h(Checkbox, {
                ariaLabel: `Select ${element.name}`,
                modelValue: selection.includes(element.position),
                'onUpdate:modelValue': () => toggle(element.position),
              }),
            ]),
            ...[element.position, element.name, element.symbol, element.mass].map((value) =>
              h('td', { style: cellStyle }, String(value)),
            ),
          ],
        ),
      ),
    ),
  ])
}

function selectionDemo(withActions: boolean): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name: withActions ? 'ActionBarActionsDemo' : 'ActionBarUsageDemo',
      setup() {
        const selection = ref<number[]>([])
        return () => [
          selectionTable(selection.value, (value) => (selection.value = value)),
          h(
            ActionBar,
            {
              opened: selection.value.length > 0,
              shadow: 'md',
              ariaLabel: 'Selected row actions',
              'onUpdate:opened': (value: boolean) => {
                if (!value) selection.value = []
              },
            },
            () => [
              h(Text, { size: 'sm', fw: 500 }, () => `${selection.value.length} rows selected`),
              h(ActionBar.Divider),
              ...(withActions
                ? [
                    h(Group, { gap: 'xs' }, () =>
                      (
                        [
                          ['Delete', PhTrash, 'red'],
                          ['Move to folder', PhFolder, undefined],
                          ['Archive', PhArchive, undefined],
                        ] as Array<[string, any, string | undefined]>
                      ).map(([label, icon, color]) =>
                        h(Tooltip, { label }, () =>
                          h(ActionIcon, { variant: 'default', size: 'lg', color }, () =>
                            h(icon as any, { size: 16 }),
                          ),
                        ),
                      ),
                    ),
                  ]
                : ['Delete', 'Move', 'Archive'].map((label) =>
                    h(Button, { variant: 'default', size: 'compact-sm' }, () => label),
                  )),
              h(ActionBar.CloseButton),
            ],
          ),
        ]
      },
    }),
    code: `<script setup lang="ts">
import { ref } from 'vue'
import { ActionBar, Button, Checkbox, Text } from '@mantine-vue/core'

const selection = ref<number[]>([])
</script>

<template>
  <!-- Render selectable rows and update selection -->
  <ActionBar :opened="selection.length > 0" @close="selection = []" aria-label="Selected row actions">
    <Text size="sm">{{ selection.length }} rows selected</Text>
    <ActionBar.Divider />
    <Button variant="default" size="compact-sm">Delete</Button>
    <ActionBar.CloseButton />
  </ActionBar>
</template>`,
  }
}

export const usage = selectionDemo(false)
export const withActions = selectionDemo(true)

export const placement: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'ActionBarPlacementDemo',
    setup() {
      const opened = ref<'center' | 'left' | 'right' | null>(null)
      const bar = (position: 'center' | 'left' | 'right', props: Record<string, unknown> = {}) =>
        h(
          ActionBar,
          {
            opened: opened.value === position,
            ...props,
            'onUpdate:opened': (value: boolean) => {
              if (!value) opened.value = null
            },
          },
          () => [h(Text, { size: 'sm' }, () => `${position} position`), h(ActionBar.CloseButton)],
        )
      return () => [
        h(Group, { justify: 'center' }, () =>
          (['center', 'left', 'right'] as const).map((value) =>
            h(Button, { onClick: () => (opened.value = value) }, () => value),
          ),
        ),
        bar('center'),
        bar('left', {
          position: { bottom: 30, left: 30 },
          styles: { root: { marginInline: 0 } },
        }),
        bar('right', {
          position: { bottom: 30, right: 30 },
          styles: { root: { marginInline: 0 } },
        }),
      ]
    },
  }),
  code: `<script setup lang="ts">
import { ref } from 'vue'
import { ActionBar, Button, Group, Text } from '@mantine-vue/core'
const opened = ref(false)
</script>
<template>
  <Button @click="opened = true">Open left action bar</Button>
  <ActionBar v-model:opened="opened" :position="{ bottom: 30, left: 30 }" :styles="{ root: { marginInline: 0 } }">
    <Text size="sm">Left position</Text><ActionBar.CloseButton />
  </ActionBar>
</template>`,
}

export const closeOnEscape: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'ActionBarEscapeDemo',
    setup() {
      const opened = ref(false)
      return () => [
        h(Group, { justify: 'center' }, () =>
          h(Button, { onClick: () => (opened.value = !opened.value) }, () => 'Toggle action bar'),
        ),
        h(
          ActionBar,
          {
            opened: opened.value,
            closeOnEscape: true,
            'onUpdate:opened': (value: boolean) => (opened.value = value),
          },
          () => [
            h(Text, { size: 'sm' }, () => 'Press Escape to close this bar'),
            h(ActionBar.Divider),
            h(
              Button,
              { variant: 'default', size: 'compact-sm', onClick: () => (opened.value = false) },
              () => 'Close',
            ),
          ],
        ),
      ]
    },
  }),
  code: `<script setup lang="ts">
import { ref } from 'vue'
import { ActionBar, Button, Text } from '@mantine-vue/core'
const opened = ref(false)
</script>
<template>
  <Button @click="opened = !opened">Toggle action bar</Button>
  <ActionBar v-model:opened="opened" close-on-escape>
    <Text size="sm">Press Escape to close this bar</Text>
    <ActionBar.Divider />
    <Button variant="default" size="compact-sm" @click="opened = false">Close</Button>
  </ActionBar>
</template>`,
}

export const ActionBarDemos = { usage, withActions, placement, closeOnEscape }
