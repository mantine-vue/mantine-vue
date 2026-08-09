<script setup lang="ts">
import { useAttrs } from 'vue'
import { InputBase } from '@mantine-vue/core'
import type { TimeInputProps } from '../../types'

defineOptions({ name: 'TimeInput', inheritAttrs: false })
const props = withDefaults(defineProps<TimeInputProps>(), { withSeconds: false })
const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string] }>()
const attrs = useAttrs()
</script>

<template>
  <InputBase
    v-bind="attrs"
    type="time"
    :step="props.withSeconds ? 1 : 60"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>
