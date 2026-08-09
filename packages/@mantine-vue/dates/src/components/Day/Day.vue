<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs, type VNodeChild } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import type { DayProps, RenderDaySlots } from '../../types'
import classes from '../../Dates.module.css'

defineOptions({ name: 'Day', inheritAttrs: false })

const props = withDefaults(defineProps<DayProps>(), {
  size: 'sm',
  static: false,
  weekend: false,
  outside: false,
  selected: false,
  hidden: false,
  inRange: false,
  firstInRange: false,
  lastInRange: false,
  highlightToday: false,
  fullWidth: false,
  disabled: false,
  unstyled: false,
})
const slots = defineSlots<RenderDaySlots>()
const attrs = useAttrs()

const content = computed(() => {
  if (props.renderDay) return props.renderDay(props.date)
  return (slots.renderDay ?? slots.day)?.({ date: props.date }) ?? dayjs(props.date).date()
})
const renderContent = () => content.value as VNodeChild
</script>

<template>
  <UnstyledButton
    v-bind="attrs"
    :component="props.static ? 'div' : 'button'"
    :class="[classes.day, attrs.class]"
    :disabled="props.disabled"
    :style="[{ display: props.hidden ? 'none' : undefined }, attrs.style]"
    :data-today="dayjs(props.date).isSame(new Date(), 'day') || undefined"
    :data-hidden="props.hidden || undefined"
    :data-highlight-today="props.highlightToday || undefined"
    :data-disabled="props.disabled || undefined"
    :data-weekend="(!props.disabled && !props.outside && props.weekend) || undefined"
    :data-outside="(!props.disabled && props.outside) || undefined"
    :data-selected="(!props.disabled && props.selected) || undefined"
    :data-in-range="(props.inRange && !props.disabled) || undefined"
    :data-first-in-range="(props.firstInRange && !props.disabled) || undefined"
    :data-last-in-range="(props.lastInRange && !props.disabled) || undefined"
    :data-static="props.static || undefined"
    :data-full-width="props.fullWidth || undefined"
  >
    <component :is="renderContent" />
  </UnstyledButton>
</template>
