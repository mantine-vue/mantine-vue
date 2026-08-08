<script setup lang="ts">
import { computed, h, useAttrs } from 'vue'
import { AccordionChevron } from '../Accordion'
import MenuItem from './MenuItem.vue'
import type { MenuItemSlots, MenuSubItemProps } from './Menu.types'
import classes from './Menu.module.css'

defineOptions({
  name: 'MenuSubItem',
  inheritAttrs: false,
})

defineProps<MenuSubItemProps>()

defineSlots<MenuItemSlots>()

const attrs = useAttrs()

/** The chevron marks the item as expandable, mirroring the platform menu convention. */
const rightSection = computed(() => h(AccordionChevron, { class: classes.chevron, size: 14 }))
</script>

<template>
  <MenuItem v-bind="attrs" data-sub-menu-item="" :right-section="rightSection">
    <template v-if="$slots.leftSection" #leftSection><slot name="leftSection" /></template>
    <slot />
  </MenuItem>
</template>
