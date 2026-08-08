<script lang="ts">
import { createVarsResolver, getRadius, getThemeColor } from '../../core'

const defaultProps = { withCloseButton: true } as const
const varsResolver = createVarsResolver<any>((theme, { radius, color }) => ({
  root: {
    '--notification-radius': radius === undefined ? undefined : getRadius(radius),
    '--notification-color': color ? getThemeColor(color, theme) : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import { CloseButton } from '../CloseButton'
import { Loader } from '../Loader'
import type { NotificationOwnProps, NotificationSlots } from './Notification.types'
import classes from './Notification.module.css'

defineOptions({ name: 'Notification', inheritAttrs: false })

const rawProps = withDefaults(defineProps<NotificationOwnProps>(), {
  color: undefined,
  radius: undefined,
  icon: undefined,
  title: undefined,
  withCloseButton: undefined,
  closeButtonProps: undefined,
  loaderProps: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<NotificationSlots>()

const emit = defineEmits<{
  close: []
}>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Notification', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Notification',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const icon = computed(() => resolveNode(props.icon, slots.icon))
const title = computed(() => resolveNode(props.title, slots.title))
const renderIcon = () => icon.value
const renderTitle = () => title.value
const closeButtonAttrs = computed(() => {
  const { onClick: _onClick, ...rest } = props.closeButtonProps ?? {}
  return rest
})

function handleClose(event: MouseEvent) {
  props.closeButtonProps?.onClick?.(event)
  emit('close')
}
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :role="attrs.role || 'alert'"
    :mod="[{ withIcon: hasNode(icon) || props.loading, withBorder: props.withBorder }, props.mod]"
  >
    <div v-if="hasNode(icon) && !props.loading" v-bind="getStyles('icon')">
      <component :is="renderIcon" />
    </div>
    <Loader
      v-if="props.loading"
      v-bind="{ size: 28, color: props.color, ...getStyles('loader'), ...props.loaderProps }"
    />
    <div v-bind="getStyles('body')">
      <div v-if="hasNode(title)" v-bind="getStyles('title')">
        <component :is="renderTitle" />
      </div>
      <Box v-bind="getStyles('description')" :mod="{ withTitle: hasNode(title) }"><slot /></Box>
    </div>
    <CloseButton
      v-if="props.withCloseButton"
      v-bind="{
        iconSize: 16,
        color: 'gray',
        __staticSelector: 'Notification',
        unstyled: props.unstyled,
        ...closeButtonAttrs,
        ...getStyles('closeButton'),
      }"
      @click="handleClose"
    />
  </Box>
</template>
