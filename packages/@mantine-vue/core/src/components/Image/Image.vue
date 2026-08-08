<script lang="ts">
import { createVarsResolver, getRadius } from '../../core'
export const varsResolver = createVarsResolver<any>((_, { radius, fit }) => ({
  root: {
    '--image-radius': radius === undefined ? undefined : getRadius(radius),
    '--image-object-fit': fit,
  },
}))
</script>
<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { ImageEmits, ImageOwnProps } from './Image.types'
import classes from './Image.module.css'
defineOptions({ name: 'Image', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ImageOwnProps>(), {
  src: undefined,
  fallbackSrc: undefined,
  radius: undefined,
  fit: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const emit = defineEmits<ImageEmits>()
const attrs = useAttrs()
const props = useProps('Image', null, rawProps)
const error = ref(!props.src)
watch(
  () => props.src,
  (src) => {
    error.value = !src
  },
)
const useFallback = computed(() => Boolean(error.value && props.fallbackSrc))
const getStyles = useStyles({
  name: 'Image',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
const onError = (event: Event) => {
  emit('error', event)
  error.value = true
}
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    component="img"
    :src="useFallback ? props.fallbackSrc : props.src"
    :mod="{ fallback: useFallback }"
    @error="onError"
  />
</template>
