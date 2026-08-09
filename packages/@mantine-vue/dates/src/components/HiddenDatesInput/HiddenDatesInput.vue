<script setup lang="ts">
import { computed } from 'vue'
import type { HiddenDatesInputProps } from '../../types'

defineOptions({ name: 'HiddenDatesInput' })
const props = defineProps<HiddenDatesInputProps>()
const serializedValue = computed(() =>
  Array.isArray(props.value) ? props.value.filter(Boolean).join(',') : props.value || '',
)
</script>

<template>
  <input type="hidden" :name="props.name" :value="serializedValue" />
</template>
