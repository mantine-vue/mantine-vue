<script setup lang="ts">
import { onUnmounted, ref, useAttrs, watch } from 'vue'
import { getDefaultZIndex, OptionalPortal, useProps, useStyles } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import DropzoneComponent from '../Dropzone/Dropzone.vue'
import type { DropzoneFullScreenEmits, DropzoneFullScreenProps } from './DropzoneFullScreen.types'
import classes from '../../Dropzone.module.css'

defineOptions({ name: 'DropzoneFullScreen', inheritAttrs: false })
const rawProps = withDefaults(defineProps<DropzoneFullScreenProps>(), {
  maxSize: Infinity,
  activateOnDrag: true,
  dragEventsBubbling: true,
  activateOnKeyboard: true,
  active: true,
  zIndex: getDefaultZIndex('max'),
  withinPortal: true,
})
const emit = defineEmits<DropzoneFullScreenEmits>()
const props = useProps('DropzoneFullScreen', null, rawProps)
const attrs = useAttrs()
const getStyles = useStyles({
  name: 'DropzoneFullScreen',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
  rootSelector: 'fullScreen',
})
const counter = ref(0)
const [visible, { open, close }] = useDisclosure(false)
function reset() {
  close()
  counter.value = 0
}
function handleDragEnter(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files')) {
    counter.value += 1
    open()
  }
}
function handleDragLeave() {
  counter.value = Math.max(0, counter.value - 1)
}
watch(counter, (value) => {
  if (value === 0) close()
})
let attached = false
function attach() {
  if (attached) return
  document.addEventListener('dragenter', handleDragEnter, false)
  document.addEventListener('dragleave', handleDragLeave, false)
  attached = true
}
function detach() {
  if (!attached) return
  document.removeEventListener('dragenter', handleDragEnter, false)
  document.removeEventListener('dragleave', handleDragLeave, false)
  attached = false
}
watch(
  () => props.active,
  (active) => {
    detach()
    if (active) attach()
    else reset()
  },
  { immediate: true },
)
onUnmounted(detach)
const dropzoneAttrs = () => {
  const rest = Object.fromEntries(
    Object.entries(props).filter(
      ([key]) =>
        !['active', 'zIndex', 'withinPortal', 'portalProps', 'classNames', 'styles'].includes(key),
    ),
  )
  const { classNames, styles } = props
  return {
    ...rest,
    ...attrs,
    activateOnClick: false,
    classNames,
    styles,
    class: classes.dropzone,
    onDrop: (files: any[]) => {
      emit('drop', files)
      reset()
    },
    onReject: (rejections: any[]) => {
      emit('reject', rejections)
      reset()
    },
    onDropAny: (files: any[], rejections: any[]) => emit('drop-any', files, rejections),
    onDragEnter: (event: DragEvent) => emit('drag-enter', event),
    onDragLeave: (event: DragEvent) => emit('drag-leave', event),
    onDragOver: (event: DragEvent) => emit('drag-over', event),
    onFileDialogCancel: () => emit('file-dialog-cancel'),
    onFileDialogOpen: () => emit('file-dialog-open'),
  }
}
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <div
      v-bind="
        getStyles('fullScreen', {
          style: {
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'all' : 'none',
            zIndex: props.zIndex,
          },
        })
      "
    >
      <DropzoneComponent v-bind="dropzoneAttrs()"><slot /></DropzoneComponent>
    </div>
  </OptionalPortal>
</template>
