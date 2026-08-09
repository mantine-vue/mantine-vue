<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Paper, px, useMantineTheme, type MantineRadius } from '@mantine-vue/core'
import { useResizeObserver } from '@mantine-vue/hooks'
import ContextMenuDivider from '../ContextMenuDivider/ContextMenuDivider.vue'
import ContextMenuItem from '../ContextMenuItem/ContextMenuItem.vue'
import { useContextMenuSettings } from '../../context'
import { humanize, resolveContextMenuStyle, resolveContextMenuStyles } from '../../utils'
import type { ContextMenuEmits, ContextMenuItemOptions, ContextMenuProps } from '../../types'
import '../../ContextMenu.css'

defineOptions({ name: 'ContextMenu' })
const props = withDefaults(defineProps<ContextMenuProps>(), { dir: 'ltr' })
const emit = defineEmits<ContextMenuEmits>()
const settings = useContextMenuSettings()
const theme = useMantineTheme()
const { ref: menuRef, rect } = useResizeObserver<HTMLElement>()
const mounted = ref(false)
let frameId = 0

watch(
  () => [rect.value.width, rect.value.height],
  ([width, height]) => {
    if (width > 0 && height > 0) {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => (mounted.value = true))
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => cancelAnimationFrame(frameId))

const position = computed(() => {
  const spacing = px(theme.value.spacing.md)
  const windowWidth = typeof window === 'undefined' ? 0 : window.innerWidth
  const windowHeight = typeof window === 'undefined' ? 0 : window.innerHeight
  const top =
    props.y + rect.value.height + spacing > windowHeight
      ? windowHeight - rect.value.height - spacing
      : props.y
  const left =
    props.dir === 'rtl'
      ? props.x - rect.value.width < spacing
        ? spacing
        : props.x - rect.value.width
      : props.x + rect.value.width + spacing > windowWidth
        ? windowWidth - rect.value.width - spacing
        : props.x
  return { zIndex: props.zIndex, top: `${top}px`, left: `${left}px` }
})
const resolvedStyles = computed(() => resolveContextMenuStyles(props.styles, theme.value))
const rootStyle = computed(() => ({
  ...position.value,
  ...resolveContextMenuStyle(props.style, theme.value),
  ...resolveContextMenuStyle(resolvedStyles.value?.root, theme.value),
}))
const submenuProps = computed(() => ({
  className: props.className,
  style: props.style,
  classNames: props.classNames,
  styles: props.styles,
  dir: props.dir,
}))

function itemClass(item: ContextMenuItemOptions, part: 'item' | 'divider') {
  return [props.classNames?.[part], item.className].filter(Boolean).join(' ')
}
function itemStyle(item: ContextMenuItemOptions, part: 'item' | 'divider') {
  return {
    ...resolveContextMenuStyle(resolvedStyles.value?.[part], theme.value),
    ...resolveContextMenuStyle(item.style, theme.value),
  }
}
const renderCustomContent = () =>
  typeof props.content === 'function' ? props.content(() => emit('hide')) : null
</script>

<template>
  <Paper
    :ref="(node: any) => (menuRef = node?.$el ?? node ?? null)"
    :shadow="settings.shadow"
    :radius="settings.borderRadius as MantineRadius"
    :dir="props.dir"
    :class="[
      'mantine-contextmenu',
      mounted && 'mantine-contextmenu-mounted',
      props.className,
      props.classNames?.root,
    ]"
    :style="rootStyle"
  >
    <component v-if="typeof props.content === 'function'" :is="renderCustomContent" />
    <template v-else>
      <template v-for="item in props.content" :key="item.key">
        <ContextMenuItem
          v-if="!item.hidden && (item.onClick || item.items)"
          :class-name="itemClass(item, 'item')"
          :style="itemStyle(item, 'item')"
          :title="item.title ?? humanize(item.key)"
          :icon="item.icon"
          :icon-right="item.iconRight"
          :color="item.color"
          :disabled="item.disabled"
          :on-click="item.onClick"
          :items="item.items"
          :submenu-props="submenuProps"
          @hide="emit('hide')"
        />
        <ContextMenuDivider
          v-else-if="!item.hidden"
          :class-name="itemClass(item, 'divider')"
          :style="itemStyle(item, 'divider')"
        />
      </template>
    </template>
  </Paper>
</template>
