<script setup lang="ts">
import { useAttrs, watch } from 'vue'
import {
  lightboxActions,
  lightboxStore,
  useLightboxStore,
  type LightboxStore,
} from '../lightbox.store'
import Lightbox from '../Lightbox.vue'
defineOptions({ name: 'LightboxProvider' })
interface RuntimeLightboxProviderProps {
  store?: LightboxStore
  loop?: boolean
}
const props = withDefaults(defineProps<RuntimeLightboxProviderProps>(), {
  store: () => lightboxStore,
  loop: undefined,
})
const attrs = useAttrs()
const state = useLightboxStore(props.store)
watch(
  () => props.loop,
  (loop) => props.store.setState({ ...props.store.getState(), loop: Boolean(loop) }),
  { immediate: true },
)
</script>
<template>
  <Lightbox
    v-bind="{ ...attrs, loop: props.loop }"
    :opened="state.opened"
    :slides="state.slides"
    :current-index="state.currentIndex"
    @close="lightboxActions.close(props.store)"
    @index-change="lightboxActions.setIndex($event, props.store)"
  />
</template>
