<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs } from 'vue'
import { Text } from '@mantine-vue/core'
import type { TimeValueProps } from '../../types'

defineOptions({ name: 'TimeValue', inheritAttrs: false })
const props = withDefaults(defineProps<TimeValueProps>(), { format: 'HH:mm' })
const attrs = useAttrs()
const formatted = computed(() =>
  (props.value instanceof Date ? dayjs(props.value) : dayjs(`2024-01-01 ${props.value}`))
    .locale(props.locale || 'en')
    .format(props.format),
)
</script>

<template>
  <Text v-bind="attrs">{{ formatted }}</Text>
</template>
