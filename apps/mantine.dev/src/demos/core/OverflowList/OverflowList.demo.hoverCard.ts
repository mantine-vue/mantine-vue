import { defineComponent, h } from 'vue'
import { Badge, Center, HoverCard, OverflowList } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const data = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Indian Fig',
  'Jackfruit',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
]

const code = `
<script setup lang="ts">
import { Badge, Center, HoverCard, OverflowList } from '@mantine-vue/core'

const data = ['Apple', 'Banana', /* ... */]
</script>

<template>
  <div style="resize: horizontal; overflow: auto; max-width: 100%">
    <OverflowList
      :data="data"
      :gap="4"
      :renderItem="(item, index) => h(Badge, { key: index }, { default: () => item })"
      :renderOverflow="(items) => h(Center, {}, {
        default: () => h(HoverCard, {}, {
          default: () => [
            h(HoverCard.Target, {}, {
              default: () => h(Badge, {}, { default: () => \`+\${items.length} more\` })
            }),
            h(HoverCard.Dropdown, {}, {
              default: () => items.map((item, i) => h('div', { key: i }, item))
            }),
          ]
        })
      })"
    />
  </div>
</template>
`

const Demo = defineComponent({
  name: 'OverflowListHoverCardDemo',
  setup() {
    return () =>
      h('div', { style: { resize: 'horizontal', overflow: 'auto', maxWidth: '100%' } }, [
        h(OverflowList, {
          data,
          gap: 4,
          renderItem: (item: string, index: number) =>
            h(Badge, { key: index }, { default: () => item }),
          renderOverflow: (items: string[]) =>
            h(
              Center,
              {},
              {
                default: () =>
                  h(
                    HoverCard,
                    {},
                    {
                      default: () => [
                        h(
                          HoverCard.Target,
                          {},
                          {
                            default: () => h(Badge, {}, { default: () => `+${items.length} more` }),
                          },
                        ),
                        h(
                          HoverCard.Dropdown,
                          {},
                          {
                            default: () => items.map((item, i) => h('div', { key: i }, item)),
                          },
                        ),
                      ],
                    },
                  ),
              },
            ),
        }),
      ])
  },
})

export const hoverCard: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
