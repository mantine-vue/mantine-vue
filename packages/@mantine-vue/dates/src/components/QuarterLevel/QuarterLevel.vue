<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import QuarterLevelGroup from '../QuarterLevelGroup/QuarterLevelGroup.vue'
import { useForwardedProps } from '../../utils/use-forwarded-props'
import type { QuarterLevelProps } from './QuarterLevel.types'
import type { QuarterLevelGroupEmits } from '../QuarterLevelGroup/QuarterLevelGroup.types'

defineOptions({ name: 'QuarterLevel', inheritAttrs: false })

const props = defineProps<QuarterLevelProps>()
const emit = defineEmits<QuarterLevelGroupEmits>()
const attrs = useAttrs()
const forwardedProps = useForwardedProps(props)
const group = ref<any>(null)

defineExpose({ focusTabControl: () => group.value?.focusTabControl() })
</script>

<template>
  <QuarterLevelGroup
    ref="group"
    v-bind="{ ...attrs, ...forwardedProps }"
    :number-of-columns="1"
    @quarter-select="emit('quarter-select', $event)"
    @quarter-mouse-enter="emit('quarter-mouse-enter', $event)"
    @next="emit('next')"
    @previous="emit('previous')"
    @level-click="emit('level-click')"
    @date-change="emit('date-change', $event)"
  />
</template>
