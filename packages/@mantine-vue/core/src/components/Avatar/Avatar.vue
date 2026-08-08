<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'
import { getInitialsColor } from './get-initials-color/get-initials-color'
export const varsResolver = createVarsResolver<any>(
  (
    theme,
    { size, radius, variant, gradient, color, autoContrast, name, allowedInitialsColors },
  ) => {
    const resolvedColor =
      color === 'initials' && typeof name === 'string'
        ? getInitialsColor(name, allowedInitialsColors)
        : color
    const colors = theme.variantColorResolver({
      color: resolvedColor || 'gray',
      theme,
      gradient,
      variant: variant || 'light',
      autoContrast,
    })
    return {
      root: {
        '--avatar-size': getSize(size, 'avatar-size'),
        '--avatar-radius': radius === undefined ? undefined : getRadius(radius),
        '--avatar-bg': resolvedColor || variant ? colors.background : undefined,
        '--avatar-color': resolvedColor || variant ? colors.color : undefined,
        '--avatar-bd': resolvedColor || variant ? colors.border : undefined,
      },
    }
  },
)
</script>
<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { useAvatarGroupContext } from './AvatarGroup/AvatarGroup'
import { AvatarPlaceholderIcon } from './AvatarPlaceholderIcon'
import { getInitials } from './get-initials/get-initials'
import type { AvatarOwnProps, AvatarSlots } from './Avatar.types'
import classes from './Avatar.module.css'
defineOptions({ name: 'Avatar', inheritAttrs: false })
const rawProps = withDefaults(defineProps<AvatarOwnProps>(), {
  component: 'div',
  size: undefined,
  radius: undefined,
  color: undefined,
  gradient: undefined,
  src: undefined,
  alt: undefined,
  imageProps: undefined,
  autoContrast: undefined,
  name: undefined,
  allowedInitialsColors: undefined,
  variant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<AvatarSlots>()
const attrs = useAttrs()
const props = useProps('Avatar', null, rawProps)
const groupCtx = useAvatarGroupContext()
const imageError = ref(!rawProps.src)
const getStyles = useStyles({
  name: 'Avatar',
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
watch(
  () => rawProps.src,
  (src) => {
    imageError.value = !src
  },
)
const forwardedImageProps = computed(() => {
  const { onError: _, ...rest } = rawProps.imageProps ?? {}
  return rest
})
const handleImageError = (event: Event) => {
  imageError.value = true
  rawProps.imageProps?.onError?.(event)
}
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :mod="[{ withinGroup: groupCtx.withinGroup }, props.mod]"
  >
    <span
      v-if="imageError || !rawProps.src"
      v-bind="getStyles('placeholder')"
      :title="rawProps.alt"
    >
      <slot
        ><template v-if="rawProps.name">{{ getInitials(rawProps.name) }}</template
        ><AvatarPlaceholderIcon v-else
      /></slot>
    </span>
    <img
      v-else
      v-bind="{ ...forwardedImageProps, ...getStyles('image') }"
      :src="rawProps.src"
      :alt="rawProps.alt"
      @error="handleImageError"
    />
  </Box>
</template>
