<script setup lang="ts">
import { onBeforeUnmount, useAttrs, watch } from 'vue'
import { OptionalPortal, Progress, getDefaultZIndex } from '@mantine-vue/core'
import { nprogressStore, resetNavigationProgressAction, useNprogress } from '../../nprogress.store'
import type { NavigationProgressProps } from './NavigationProgress.types'
import classes from '../../NavigationProgress.module.css'

defineOptions({ name: 'NavigationProgress', inheritAttrs: false })

const props = withDefaults(defineProps<NavigationProgressProps>(), {
  store: () => nprogressStore,
  initialProgress: 0,
  size: 3,
  stepInterval: 500,
  withinPortal: true,
  zIndex: () => getDefaultZIndex('max'),
})
const attrs = useAttrs()
const state = useNprogress(props.store)

watch(
  () => [props.initialProgress, props.stepInterval, props.store] as const,
  () => {
    props.store.setState((current) => ({
      ...current,
      progress: props.initialProgress,
      stepInterval: props.stepInterval,
    }))
  },
  { immediate: true },
)

onBeforeUnmount(() => resetNavigationProgressAction(props.store))
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Progress
      v-bind="attrs"
      :radius="0"
      :value="state.progress"
      :size="props.size"
      :color="props.color"
      :class-names="classes"
      :data-mounted="state.mounted || undefined"
      :vars="{ root: { '--nprogress-z-index': props.zIndex?.toString() } }"
    />
  </OptionalPortal>
</template>
