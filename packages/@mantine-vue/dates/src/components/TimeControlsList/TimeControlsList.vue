<script setup lang="ts">
import { computed } from 'vue'
import { ScrollArea, UnstyledButton } from '@mantine-vue/core'
import { padTime } from '../../utils'
import type { TimeControlsListEmits, TimeControlsListProps } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'TimeControlsList' })
const props = withDefaults(defineProps<TimeControlsListProps>(), { step: 1, value: null })
const emit = defineEmits<TimeControlsListEmits>()
const items = computed(() =>
  Array.from(
    { length: Math.floor((props.max - props.min) / props.step) + 1 },
    (_, index) => props.min + index * props.step,
  ),
)
</script>

<template>
  <ScrollArea :h="200"
    ><div :class="classes.timePickerControlsList">
      <UnstyledButton
        v-for="item in items"
        :key="item"
        :class="classes.timePickerControl"
        :data-active="item === props.value || undefined"
        @click="emit('select', item)"
        >{{ props.formatValue ? props.formatValue(item) : padTime(item) }}</UnstyledButton
      >
    </div></ScrollArea
  >
</template>
