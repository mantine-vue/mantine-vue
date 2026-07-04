import { defineComponent, h } from 'vue'
import { NavLink } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NavLink } from '@mantine-vue/core'
</script>

<template>
  <NavLink color="lime.4" variant="filled" active label="Default" />
  <NavLink color="lime.4" variant="filled" active autoContrast label="Auto contrast" />
</template>
`

const Demo = defineComponent({
  name: 'NavLinkAutoContrastDemo',
  setup() {
    return () =>
      h('div', [
        h(NavLink, { color: 'lime.4', variant: 'filled', active: true, label: 'Default' }),
        h(NavLink, {
          color: 'lime.4',
          variant: 'filled',
          active: true,
          autoContrast: true,
          label: 'Auto contrast',
        }),
      ])
  },
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 300,
}
