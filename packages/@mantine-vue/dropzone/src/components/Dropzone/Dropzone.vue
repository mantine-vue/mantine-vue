<script lang="ts">
import { createVarsResolver, getRadius } from '@mantine-vue/core'
const varsResolver = createVarsResolver<any>(
  (theme, { radius, variant, acceptColor, rejectColor }) => {
    const acceptColors = theme.variantColorResolver({
      color: acceptColor || theme.primaryColor,
      theme,
      variant,
    })
    const rejectColors = theme.variantColorResolver({ color: rejectColor || 'red', theme, variant })
    return {
      root: {
        '--dropzone-radius': getRadius(radius),
        '--dropzone-accept-color': acceptColors.color,
        '--dropzone-accept-bg': acceptColors.background,
        '--dropzone-reject-color': rejectColors.color,
        '--dropzone-reject-bg': rejectColors.background,
      },
    }
  },
)
export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue'
import { Box, LoadingOverlay, useProps, useStyles } from '@mantine-vue/core'
import { assignRef } from '@mantine-vue/hooks'
import { provideDropzoneContext } from '../../Dropzone.context'
import { useDropzone } from '../../use-dropzone'
import type { Accept } from '../../types'
import type { DropzoneEmits, DropzoneProps } from './Dropzone.types'
import classes from '../../Dropzone.module.css'

defineOptions({ name: 'Dropzone', inheritAttrs: false })
const rawProps = withDefaults(defineProps<DropzoneProps>(), {
  disabled: false,
  loading: false,
  multiple: true,
  maxSize: Infinity,
  activateOnClick: true,
  activateOnDrag: true,
  dragEventsBubbling: true,
  activateOnKeyboard: true,
  useFsAccessApi: false,
  preventDropOnDocument: true,
  enablePointerEvents: false,
  variant: 'light',
  rejectColor: 'red',
})
const emit = defineEmits<DropzoneEmits>()
const props = useProps('Dropzone', null, rawProps)
const attrs = useAttrs()
const getStyles = useStyles({
  name: 'Dropzone',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  vars: props.vars,
  varsResolver,
  unstyled: props.unstyled,
})
const dz = useDropzone({
  accept: () =>
    Array.isArray(props.accept)
      ? props.accept.reduce((result: Accept, key: string) => ({ ...result, [key]: [] }), {})
      : (props.accept as Accept | undefined),
  disabled: () => props.disabled || props.loading,
  multiple: () => props.multiple,
  maxSize: () => props.maxSize,
  maxFiles: () => props.maxFiles,
  autoFocus: () => props.autoFocus,
  noClick: () => !props.activateOnClick,
  noDrag: () => !props.activateOnDrag,
  noDragEventsBubbling: () => !props.dragEventsBubbling,
  noKeyboard: () => !props.activateOnKeyboard,
  preventDropOnDocument: () => props.preventDropOnDocument,
  useFsAccessApi: () => props.useFsAccessApi,
  validator: () => props.validator,
  getFilesFromEvent: () => props.getFilesFromEvent,
  onDrop: (files, rejected) => emit('drop-any', files, rejected),
  onDropAccepted: (files) => emit('drop', files),
  onDropRejected: (rejected) => emit('reject', rejected),
  onDragEnter: (event) => emit('drag-enter', event),
  onDragLeave: (event) => emit('drag-leave', event),
  onDragOver: (event) => emit('drag-over', event),
  onFileDialogCancel: () => emit('file-dialog-cancel'),
  onFileDialogOpen: () => emit('file-dialog-open'),
})
watch(
  () => props.openRef,
  (value) => assignRef(value, dz.open),
  { immediate: true },
)
const accepted = computed(() => dz.isDragActive.value && dz.isDragAccept.value)
const rejected = computed(() => dz.isDragActive.value && dz.isDragReject.value)
const idle = computed(() => !accepted.value && !rejected.value)
provideDropzoneContext({
  get accept() {
    return accepted.value
  },
  get reject() {
    return rejected.value
  },
  get idle() {
    return idle.value
  },
})
const rootAttrs = (): any => ({
  ...dz.getRootProps(),
  ...getStyles('root'),
  ...attrs,
  mod: [
    {
      accept: accepted.value,
      reject: rejected.value,
      idle: idle.value,
      disabled: props.disabled,
      loading: props.loading,
      'activate-on-click': props.activateOnClick,
    },
    attrs.mod,
  ],
})
const inputAttrs = (): any => ({ ...dz.getInputProps(props.inputProps), name: props.name })
</script>

<template>
  <Box v-bind="rootAttrs()">
    <LoadingOverlay
      :visible="props.loading"
      :overlay-props="{ radius: props.radius }"
      :unstyled="props.unstyled"
      :loader-props="props.loaderProps"
    />
    <input v-bind="inputAttrs()" />
    <div
      v-bind="getStyles('inner')"
      :data-enable-pointer-events="props.enablePointerEvents || undefined"
    >
      <slot />
    </div>
  </Box>
</template>
