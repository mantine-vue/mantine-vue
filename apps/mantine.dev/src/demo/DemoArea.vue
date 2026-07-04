<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  centered?: boolean
  withPadding?: boolean
  maxWidth?: number | string
  minHeight?: number | string
}>()

const toLength = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value

const innerStyle = computed(() => ({
  width: props.maxWidth ? '100%' : props.centered ? 'auto' : undefined,
  flex: props.maxWidth ? '1' : undefined,
  maxWidth: toLength(props.maxWidth) ?? '100%',
  marginLeft: props.maxWidth && props.centered ? 'auto' : undefined,
  marginRight: props.maxWidth && props.centered ? 'auto' : undefined,
}))
</script>

<template>
  <div
    class="area"
    :class="{ centered }"
    :style="{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }"
  >
    <div class="inner" :class="{ pad: withPadding !== false }" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.area {
  background: var(--mantine-color-body);
  display: flex;
  flex: 1;
  min-width: 0;
}
.area.centered {
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
.inner {
  width: 100%;
}
.inner.pad {
  padding: 32px;
}
</style>
