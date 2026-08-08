<script setup lang="ts">
import CodeHighlightControl from '../CodeHighlightControl/CodeHighlightControl.vue'
import ExpandIcon from './ExpandIcon.vue'

export interface ExpandCodeButtonProps {
  expanded: boolean
  collapseCodeLabel?: string
  expandCodeLabel?: string
}
export interface ExpandCodeButtonEmits {
  expand: [value: boolean]
}

defineOptions({ name: 'ExpandCodeButton' })
const props = withDefaults(defineProps<ExpandCodeButtonProps>(), {
  collapseCodeLabel: 'Collapse code',
  expandCodeLabel: 'Expand code',
})
const emit = defineEmits<ExpandCodeButtonEmits>()
</script>

<template>
  <CodeHighlightControl
    :tooltip-label="props.expanded ? props.collapseCodeLabel : props.expandCodeLabel"
    :aria-label="props.expanded ? props.collapseCodeLabel : props.expandCodeLabel"
    @click="emit('expand', !props.expanded)"
  >
    <ExpandIcon :expanded="props.expanded" />
  </CodeHighlightControl>
</template>
