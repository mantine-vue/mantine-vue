import { defineComponent, h } from 'vue'
import { Badge, NavLink } from '@mantine-vue/core'
import { PhCaretRight, PhGauge, PhHeartbeat, PhHouse, PhProhibit } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, NavLink } from '@mantine-vue/core'
import { PhHouse, PhGauge, PhCaretRight, PhHeartbeat, PhProhibit } from '@phosphor-icons/vue'
</script>

<template>
  <NavLink href="#required-for-focus" label="With icon">
    <template #leftSection><PhHouse :size="16" /></template>
  </NavLink>
  <NavLink href="#required-for-focus" label="With right section">
    <template #leftSection><PhGauge :size="16" /></template>
    <template #rightSection><PhCaretRight :size="12" /></template>
  </NavLink>
  <NavLink href="#required-for-focus" label="Disabled" disabled>
    <template #leftSection><PhProhibit :size="16" /></template>
  </NavLink>
  <NavLink href="#required-for-focus" label="With description" description="Additional information">
    <template #leftSection>
      <Badge size="xs" color="red" circle>3</Badge>
    </template>
  </NavLink>
  <NavLink href="#required-for-focus" label="Active subtle" variant="subtle" active>
    <template #leftSection><PhHeartbeat :size="16" /></template>
    <template #rightSection><PhCaretRight :size="12" /></template>
  </NavLink>
  <NavLink href="#required-for-focus" label="Active light" active>
    <template #leftSection><PhHeartbeat :size="16" /></template>
    <template #rightSection><PhCaretRight :size="12" /></template>
  </NavLink>
  <NavLink href="#required-for-focus" label="Active filled" variant="filled" active>
    <template #leftSection><PhHeartbeat :size="16" /></template>
    <template #rightSection><PhCaretRight :size="12" /></template>
  </NavLink>
</template>
`

const Demo = defineComponent({
  name: 'NavLinkUsageDemo',
  setup() {
    return () =>
      h('div', [
        h(NavLink, {
          href: '#required-for-focus',
          label: 'With icon',
          leftSection: h(PhHouse, { size: 16 }),
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'With right section',
          leftSection: h(PhGauge, { size: 16 }),
          rightSection: h(PhCaretRight, { size: 12 }),
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'Disabled',
          leftSection: h(PhProhibit, { size: 16 }),
          disabled: true,
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'With description',
          description: 'Additional information',
          leftSection: h(Badge, { size: 'xs', color: 'red', circle: true }, { default: () => '3' }),
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'Active subtle',
          leftSection: h(PhHeartbeat, { size: 16 }),
          rightSection: h(PhCaretRight, { size: 12 }),
          variant: 'subtle',
          active: true,
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'Active light',
          leftSection: h(PhHeartbeat, { size: 16 }),
          rightSection: h(PhCaretRight, { size: 12 }),
          active: true,
        }),
        h(NavLink, {
          href: '#required-for-focus',
          label: 'Active filled',
          leftSection: h(PhHeartbeat, { size: 16 }),
          rightSection: h(PhCaretRight, { size: 12 }),
          variant: 'filled',
          active: true,
        }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 240,
}
