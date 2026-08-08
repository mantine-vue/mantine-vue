<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getDefaultZIndex } from '../../core'
import { provideDrawerStackContext, type DrawerStackContextValue } from './Drawer.context'
import type { DrawerStackSlots } from './Drawer.types'

defineOptions({
  name: 'DrawerStack',
})

defineSlots<DrawerStackSlots>()

const stack = ref<string[]>([])
const maxZIndex = ref<string | number>(getDefaultZIndex('modal'))

const ctx: DrawerStackContextValue = reactive({
  get stack() {
    return stack.value
  },
  addModal(id: string, zIndex: string | number) {
    // A `Set` keeps the order while making a repeated open a no-op.
    stack.value = [...new Set([...stack.value, id])]

    // A drawer asking for a higher z-index raises the whole stack, so the ordering
    // between the stacked drawers is preserved.
    if (typeof zIndex === 'number' && typeof maxZIndex.value === 'number') {
      maxZIndex.value = Math.max(maxZIndex.value, zIndex)
    }
  },
  removeModal(id: string) {
    stack.value = stack.value.filter((currentId) => currentId !== id)
  },
  getZIndex(id: string) {
    return `calc(${maxZIndex.value} + ${stack.value.indexOf(id)} + 1)`
  },
  get currentId() {
    return stack.value[stack.value.length - 1] ?? ''
  },
  get maxZIndex() {
    return maxZIndex.value
  },
})

provideDrawerStackContext(ctx)
</script>

<template>
  <slot />
</template>
