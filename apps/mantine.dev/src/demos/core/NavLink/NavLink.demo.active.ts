import { defineComponent, h, ref } from 'vue'
import { Box, Group, NavLink } from '@mantine-vue/core'
import { PhCaretRight, PhFingerprint, PhGauge, PhHeartbeat } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Box, NavLink } from '@mantine-vue/core'
import { PhGauge, PhFingerprint, PhHeartbeat, PhCaretRight } from '@phosphor-icons/vue'

const data = [
  { label: 'Dashboard', description: 'Item with description' },
  { label: 'Security' },
  { label: 'Activity' },
]

const active = ref(0)
</script>

<template>
  <Group justify="center">
    <Box :w="220">
      <NavLink
        v-for="(item, index) in data"
        :key="item.label"
        href="#required-for-focus"
        :active="index === active"
        :label="item.label"
        :description="item.description"
        @click="active = index"
      />
    </Box>
  </Group>
</template>
`

const data = [
  { label: 'Dashboard', description: 'Item with description', icon: PhGauge },
  { label: 'Security', icon: PhFingerprint, rightSection: h(PhCaretRight, { size: 16 }) },
  { label: 'Activity', icon: PhHeartbeat },
]

const Wrapper = defineComponent({
  name: 'NavLinkActiveDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const active = ref(0)
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () =>
            h(
              Box,
              { w: 220 },
              {
                default: () =>
                  data.map((item, index) =>
                    h(NavLink, {
                      href: '#required-for-focus',
                      key: item.label,
                      active: index === active.value,
                      label: item.label,
                      description: item.description,
                      rightSection: item.rightSection,
                      leftSection: h(item.icon, { size: 16 }),
                      onClick: () => {
                        active.value = index
                      },
                      ...(attrs as any),
                    }),
                  ),
              },
            ),
        },
      )
  },
})

export const active: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: 'blue' },
    {
      prop: 'variant',
      type: 'segmented',
      data: [
        { value: 'subtle', label: 'Subtle' },
        { value: 'light', label: 'Light' },
        { value: 'filled', label: 'Filled' },
      ],
      libraryValue: 'light',
      initialValue: 'light',
    },
  ],
}
