<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import {
  Box,
  getRadius,
  getThemeColor,
  hasNode,
  resolveNode,
  useMantineTheme,
  useProps,
} from '../../../core'
import { useTimelineContext } from '../Timeline.context'
import type { TimelineItemOwnProps, TimelineItemSlots } from './TimelineItem.types'

defineOptions({
  name: 'TimelineItem',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<TimelineItemOwnProps>(), {
  __active: false,
  __lineActive: false,
  __align: undefined,
  // Intentionally undefined to preserve downstream defaults.
  active: undefined,
  lineActive: undefined,
  title: undefined,
  bullet: undefined,
  opposite: undefined,
  alternate: false,
  radius: undefined,
  color: undefined,
  lineVariant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  className: undefined,
  style: undefined,
})

defineSlots<TimelineItemSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('TimelineItem', null, rawProps)
const ctx = useTimelineContext()
const theme = useMantineTheme()

const active = computed(() => props.active ?? props.__active)
const lineActive = computed(() => props.lineActive ?? props.__lineActive)

const bullet = computed(() => resolveNode(props.bullet, slots.bullet))
const title = computed(() => resolveNode(props.title, slots.title))
const opposite = computed(() => resolveNode(props.opposite, slots.opposite))

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderBullet = () => bullet.value
const renderTitle = () => title.value
const renderOpposite = () => opposite.value

const stylesApiProps = computed(() => ({
  classNames: props.classNames,
  styles: props.styles,
  props,
}))

/**
 * `.item` becomes a three-column grid when the parent `Timeline` contains opposite
 * content, so DOM order decides which grid cell each child lands in.
 */
const parts = computed<('body' | 'bullet' | 'opposite')[]>(() => {
  const bodyFirst =
    (props.__align === 'left' && !!props.alternate) ||
    (props.__align === 'right' && !props.alternate)

  return bodyFirst ? ['body', 'bullet', 'opposite'] : ['opposite', 'bullet', 'body']
})

const rootStyles = computed(() =>
  ctx.getStyles('item', {
    ...stylesApiProps.value,
    className: props.className ?? attrs.class,
    style: {
      '--tli-radius': props.radius !== undefined ? getRadius(props.radius) : undefined,
      '--tli-color': props.color ? getThemeColor(props.color, theme.value) : undefined,
      '--tli-border-style': props.lineVariant || undefined,
      ...(props.style as Record<string, any>),
      ...(attrs.style as Record<string, any>),
    },
  }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...rootStyles }"
    :mod="[{ lineActive, active, alternate: props.alternate }, props.mod]"
  >
    <template v-for="part in parts" :key="part">
      <Box
        v-if="part === 'bullet'"
        component="span"
        v-bind="ctx.getStyles('itemBullet', stylesApiProps)"
        :mod="{ withChild: hasNode(bullet), align: props.__align, active }"
      >
        <component :is="renderBullet" />
      </Box>

      <div
        v-else-if="part === 'opposite' && hasNode(opposite)"
        v-bind="ctx.getStyles('itemOpposite', stylesApiProps)"
      >
        <component :is="renderOpposite" />
      </div>

      <div v-else-if="part === 'body'" v-bind="ctx.getStyles('itemBody', stylesApiProps)">
        <div v-if="hasNode(title)" v-bind="ctx.getStyles('itemTitle', stylesApiProps)">
          <component :is="renderTitle" />
        </div>

        <div v-bind="ctx.getStyles('itemContent', stylesApiProps)">
          <slot />
        </div>
      </div>
    </template>
  </Box>
</template>
