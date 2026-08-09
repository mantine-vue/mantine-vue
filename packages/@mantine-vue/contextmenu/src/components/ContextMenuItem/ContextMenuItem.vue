<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import {
  Box,
  UnstyledButton,
  parseThemeColor,
  resolveNode,
  rgba,
  useMantineTheme,
} from '@mantine-vue/core'
import { useMediaQuery, useTimeout } from '@mantine-vue/hooks'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import { useContextMenuSettings } from '../../context'
import { resolveContextMenuStyle } from '../../utils'
import type { ContextMenuItemEmits, ContextMenuItemProps } from '../../types'
import '../../ContextMenuItem.css'

defineOptions({ name: 'ContextMenuItem' })
const props = withDefaults(defineProps<ContextMenuItemProps>(), { disabled: false })
const emit = defineEmits<ContextMenuItemEmits>()
const slots = useSlots()
const button = ref<HTMLElement | null>(null)
const submenuPosition = ref<{ x: number; y: number } | null>(null)
const settings = useContextMenuSettings()
const theme = useMantineTheme()
const hoverAvailable = useMediaQuery('(hover: hover)')
const hasSubmenu = computed(() => Boolean(props.items && !props.disabled))
const parsedColor = computed(() =>
  props.color ? parseThemeColor({ color: props.color, theme: theme.value }) : null,
)
const itemStyle = computed(() => {
  const color = parsedColor.value?.value
  return {
    '--mantine-contextmenu-item-button-color': color ?? 'var(--mantine-color-text)',
    '--mantine-contextmenu-item-button-hover-bg-color-light': color
      ? rgba(color, 0.08)
      : rgba(theme.value.colors.gray[4], 0.25),
    '--mantine-contextmenu-item-button-hover-bg-color-dark': color
      ? rgba(color, 0.15)
      : rgba(theme.value.colors.dark[3], 0.25),
    '--mantine-contextmenu-item-button-pressed-bg-color-light': color
      ? rgba(color, 0.2)
      : rgba(theme.value.colors.gray[4], 0.5),
    '--mantine-contextmenu-item-button-pressed-bg-color-dark': color
      ? rgba(color, 0.3)
      : rgba(theme.value.colors.dark[3], 0.5),
    ...resolveContextMenuStyle(props.style, theme.value),
  }
})
const icon = computed(() => resolveNode(props.icon, slots.icon))
const title = computed(() => resolveNode(props.title, slots.title))
const iconRight = computed(() => resolveNode(props.iconRight, slots.iconRight))
const renderIcon = () => icon.value
const renderTitle = () => title.value
const renderIconRight = () => iconRight.value

const showSubmenuTimeout = useTimeout(() => {
  if (!button.value) return
  const rect = button.value.getBoundingClientRect()
  submenuPosition.value = {
    x: (props.submenuProps.dir || 'ltr') === 'ltr' ? rect.right : rect.left,
    y: rect.top,
  }
}, settings.value.submenuDelay)
const hideSubmenuTimeout = useTimeout(
  () => (submenuPosition.value = null),
  settings.value.submenuDelay,
)

function showSubmenu() {
  hideSubmenuTimeout.clear()
  showSubmenuTimeout.start()
}
function hideSubmenu() {
  showSubmenuTimeout.clear()
  hideSubmenuTimeout.start()
}
function mouseenter() {
  if (hasSubmenu.value && hoverAvailable.value) showSubmenu()
}
function mouseleave() {
  if (hasSubmenu.value && hoverAvailable.value) hideSubmenu()
}
function click(event: MouseEvent) {
  if (hasSubmenu.value) {
    event.stopPropagation()
    showSubmenu()
  } else if (props.onClick) {
    emit('hide')
    props.onClick(event)
  }
}
</script>

<template>
  <div @mouseenter="mouseenter" @mouseleave="mouseleave">
    <UnstyledButton
      :ref="(node: any) => (button = node?.$el ?? node ?? null)"
      :dir="props.submenuProps.dir || 'ltr'"
      :class="['mantine-contextmenu-item-button', props.className]"
      :disabled="props.disabled"
      :style="itemStyle"
      @click="click"
    >
      <Box v-if="icon" :fz="0" me="xs" :mt="-2"><component :is="renderIcon" /></Box>
      <div class="mantine-contextmenu-item-button-title"><component :is="renderTitle" /></div>
      <Box v-if="iconRight" :fz="0" ms="xs" :mt="-2"><component :is="renderIconRight" /></Box>
      <Box v-else-if="props.items" :mt="-1" ms="xs">
        {{ (props.submenuProps.dir || 'ltr') === 'rtl' ? '‹' : '›' }}
      </Box>
    </UnstyledButton>
    <ContextMenu
      v-if="submenuPosition && props.items"
      v-bind="props.submenuProps"
      :x="submenuPosition.x"
      :y="submenuPosition.y"
      :content="props.items"
      :dir="props.submenuProps.dir || 'ltr'"
      @hide="emit('hide')"
    />
  </div>
</template>
