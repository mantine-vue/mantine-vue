import { defineComponent, h } from 'vue'
import { NavLink } from '@mantine-vue/core'
import { PhFingerprint, PhGauge } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NavLink } from '@mantine-vue/core'
import { PhGauge, PhFingerprint } from '@phosphor-icons/vue'
</script>

<template>
  <NavLink
    href="#required-for-focus"
    label="First parent link"
    :childrenOffset="28"
  >
    <template #leftSection><PhGauge :size="16" /></template>
    <NavLink href="#required-for-focus" label="First child link" />
    <NavLink href="#required-for-focus" label="Second child link" />
    <NavLink href="#required-for-focus" label="Nested parent link" :childrenOffset="28">
      <NavLink href="#required-for-focus" label="First child link" />
      <NavLink href="#required-for-focus" label="Second child link" />
      <NavLink href="#required-for-focus" label="Third child link" />
    </NavLink>
  </NavLink>

  <NavLink
    href="#required-for-focus"
    label="Second parent link"
    :childrenOffset="28"
    defaultOpened
  >
    <template #leftSection><PhFingerprint :size="16" /></template>
    <NavLink href="#required-for-focus" label="First child link" />
    <NavLink href="#required-for-focus" label="Second child link" />
    <NavLink href="#required-for-focus" label="Third child link" />
  </NavLink>
</template>
`

const Demo = defineComponent({
  name: 'NavLinkNestedDemo',
  setup() {
    return () =>
      h('div', [
        h(
          NavLink,
          {
            href: '#required-for-focus',
            label: 'First parent link',
            leftSection: h(PhGauge, { size: 16 }),
            childrenOffset: 28,
          },
          {
            default: () => [
              h(NavLink, { href: '#required-for-focus', label: 'First child link' }),
              h(NavLink, { href: '#required-for-focus', label: 'Second child link' }),
              h(
                NavLink,
                { href: '#required-for-focus', label: 'Nested parent link', childrenOffset: 28 },
                {
                  default: () => [
                    h(NavLink, { href: '#required-for-focus', label: 'First child link' }),
                    h(NavLink, { href: '#required-for-focus', label: 'Second child link' }),
                    h(NavLink, { href: '#required-for-focus', label: 'Third child link' }),
                  ],
                },
              ),
            ],
          },
        ),
        h(
          NavLink,
          {
            href: '#required-for-focus',
            label: 'Second parent link',
            leftSection: h(PhFingerprint, { size: 16 }),
            childrenOffset: 28,
            defaultOpened: true,
          },
          {
            default: () => [
              h(NavLink, { href: '#required-for-focus', label: 'First child link' }),
              h(NavLink, { href: '#required-for-focus', label: 'Second child link' }),
              h(NavLink, { href: '#required-for-focus', label: 'Third child link' }),
            ],
          },
        ),
      ])
  },
})

export const nested: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 240,
}
