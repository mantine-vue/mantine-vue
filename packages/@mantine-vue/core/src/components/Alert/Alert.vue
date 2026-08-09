<script lang="ts">
import { createVarsResolver, getRadius } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { radius, color, variant, autoContrast }) => {
  const colors = theme.variantColorResolver({
    color: color || theme.primaryColor,
    theme,
    variant: variant || 'light',
    autoContrast,
  })

  return {
    root: {
      '--alert-radius': radius === undefined ? undefined : getRadius(radius),
      '--alert-bg': color || variant ? colors.background : undefined,
      '--alert-color': colors.color,
      '--alert-bd': color || variant ? colors.border : undefined,
    },
  }
})

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import { CloseButton } from '../CloseButton'
import type { AlertOwnProps, AlertSlots } from './Alert.types'
import classes from './Alert.module.css'

defineOptions({
  name: 'Alert',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<AlertOwnProps>(), {
  id: undefined,
  radius: undefined,
  color: undefined,
  // Intentionally undefined to preserve downstream defaults.
  title: undefined,
  icon: undefined,
  autoContrast: undefined,
  closeButtonLabel: undefined,
  variant: undefined,
  role: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<AlertSlots>()

const emit = defineEmits<{
  close: []
}>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Alert', null, rawProps)
const rootId = useId(props.id)

const getStyles = useStyles({
  name: 'Alert',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

const title = computed(() => resolveNode(props.title, slots.title))
const icon = computed(() => resolveNode(props.icon, slots.icon))
const message = computed(() => slots.default?.())

/** Stable functional components: `MantineNode` values are arbitrary VNode children. */
const renderTitle = () => title.value
const renderIcon = () => icon.value

const id = computed(() => rootId.value || undefined)
const titleId = computed(() => (hasNode(title.value) && id.value ? `${id.value}-title` : undefined))
const bodyId = computed(() => (id.value ? `${id.value}-body` : undefined))
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :id="id"
    :variant="props.variant"
    :role="props.role || 'alert'"
    :aria-describedby="hasNode(message) ? bodyId : undefined"
    :aria-labelledby="hasNode(title) ? titleId : undefined"
  >
    <div v-bind="getStyles('wrapper')">
      <div v-if="hasNode(icon)" v-bind="getStyles('icon')">
        <component :is="renderIcon" />
      </div>

      <div v-bind="getStyles('body')">
        <div
          v-if="hasNode(title)"
          v-bind="getStyles('title')"
          :data-with-close-button="props.withCloseButton ? '' : undefined"
        >
          <span :id="titleId" v-bind="getStyles('label')">
            <component :is="renderTitle" />
          </span>
        </div>

        <div
          v-if="hasNode(message)"
          :id="bodyId"
          v-bind="getStyles('message')"
          :data-variant="props.variant"
        >
          <slot />
        </div>
      </div>

      <CloseButton
        v-if="props.withCloseButton"
        v-bind="getStyles('closeButton')"
        variant="transparent"
        :size="16"
        :icon-size="16"
        :aria-label="props.closeButtonLabel"
        :unstyled="props.unstyled"
        @click="emit('close')"
      />
    </div>
  </Box>
</template>
