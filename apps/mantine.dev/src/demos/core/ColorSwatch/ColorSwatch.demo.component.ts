import { defineComponent, h, ref } from 'vue'
import { ColorSwatch } from '@mantine-vue/core'
import { PhCheck } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ColorSwatch } from '@mantine-vue/core'
import { PhCheck } from '@phosphor-icons/vue'

const checked = ref(true)
</script>

<template>
  <ColorSwatch
    component="button"
    color="var(--mantine-color-grape-6)"
    @click="checked = !checked"
    c="white"
    :style="{ cursor: 'pointer' }"
  >
    <PhCheck v-if="checked" :size="12" />
  </ColorSwatch>
</template>
`

const Demo = defineComponent({
  name: 'ColorSwatchComponentDemo',
  setup() {
    const checked = ref(true)
    return () =>
      h(
        ColorSwatch,
        {
          component: 'button',
          color: 'var(--mantine-color-grape-6)',
          onClick: () => {
            checked.value = !checked.value
          },
          c: 'white',
          style: { cursor: 'pointer' },
        },
        { default: () => (checked.value ? h(PhCheck, { size: 12 }) : null) },
      )
  },
})

export const component: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
