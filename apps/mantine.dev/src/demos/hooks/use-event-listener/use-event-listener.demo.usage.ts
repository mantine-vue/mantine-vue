import { defineComponent, h, ref } from 'vue'
import { useEventListener } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener } from '@mantine-vue/hooks'

const count = ref(0)
const increment = () => count.value += 1
// useEventListener returns a ref that must be assigned to a native element
const elementRef = useEventListener('click', increment)
</script>

<template>
  <button ref="elementRef" type="button">Button clicks: {{ count }}</button>
</template>
`

const Demo = defineComponent({
  name: 'UseEventListenerUsageDemo',
  setup() {
    const count = ref(0)
    const increment = () => {
      count.value += 1
    }
    const elementRef = useEventListener<'click', HTMLButtonElement>('click', increment)
    return () => h('button', { ref: elementRef, type: 'button' }, `Button clicks: ${count.value}`)
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
}
