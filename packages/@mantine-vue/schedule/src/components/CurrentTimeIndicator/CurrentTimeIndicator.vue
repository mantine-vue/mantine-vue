<script lang="ts">
import { createVarsResolver, getThemeColor } from '@mantine-vue/core'

const defaultProps = {
  color: 'red',
  startOffset: '0px',
  endOffset: '0px',
  topOffset: '0px',
  timeBubbleStartOffset: '0px',
  withTimeBubble: true,
  withThumb: true,
  currentTimeFormat: 'HH:mm',
  startTime: '00:00:00',
  endTime: '23:59:59',
  intervalMinutes: 60,
} as const

// Time-dependent values reach the module-scoped resolver through the styles context.
const varsResolver = createVarsResolver<any>(
  (theme, { color, startOffset, endOffset, topOffset, timeBubbleStartOffset }, ctx) => ({
    currentTimeIndicator: {
      '--indicator-color': getThemeColor(color, theme),
      '--start-offset': startOffset,
      '--end-offset': endOffset,
      '--top-offset': `calc(${ctx.offsetPercent}% + ${topOffset})`,
      '--time-bubble-start-offset': timeBubbleStartOffset,
      // A format with AM/PM needs a wider bubble than a 24h one.
      '--time-bubble-width': ctx.hasMeridiem ? '64px' : '46px',
    },
  }),
)

const TICK_INTERVAL = 30_000

export { defaultProps, varsResolver, TICK_INTERVAL }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { formatDate, getCurrentTimePosition, isInTimeRange } from '../../utils'
import type { CurrentTimeIndicatorOwnProps } from './CurrentTimeIndicator.types'
import classes from './CurrentTimeIndicator.module.css'

defineOptions({
  name: 'CurrentTimeIndicator',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CurrentTimeIndicatorOwnProps>(), {
  color: undefined,
  startOffset: undefined,
  endOffset: undefined,
  topOffset: undefined,
  timeBubbleStartOffset: undefined,
  withTimeBubble: undefined,
  withThumb: undefined,
  currentTimeFormat: undefined,
  locale: undefined,
  startTime: undefined,
  endTime: undefined,
  intervalMinutes: undefined,
  getCurrentTime: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const attrs = useAttrs()

const props = useProps('CurrentTimeIndicator', defaultProps, rawProps)

/** Bumped on every tick so the computed values below re-evaluate. */
const tick = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    tick.value += 1
  }, TICK_INTERVAL)
})

onBeforeUnmount(() => clearInterval(timer))

const now = computed(() => {
  void tick.value
  return props.getCurrentTime ? dayjs(props.getCurrentTime()) : dayjs()
})

const visible = computed(() =>
  isInTimeRange({ date: now.value, startTime: props.startTime, endTime: props.endTime }),
)

const offsetPercent = computed(() =>
  getCurrentTimePosition({
    now: now.value,
    startTime: props.startTime,
    endTime: props.endTime,
    intervalMinutes: props.intervalMinutes,
  }),
)

const formattedTime = computed(() =>
  props.withTimeBubble
    ? formatDate({
        date: now.value,
        locale: props.locale || 'en',
        format: props.currentTimeFormat!,
      })
    : '',
)

const getStyles = useStyles({
  name: 'CurrentTimeIndicator',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  rootSelector: 'currentTimeIndicator',
  // Getters keep the context live without re-creating the styles resolver on every tick.
  stylesCtx: {
    get offsetPercent() {
      return offsetPercent.value
    },
    get hasMeridiem() {
      return String(formattedTime.value).toLowerCase().includes('m')
    },
  },
})
</script>

<template>
  <Box v-if="visible" v-bind="{ ...attrs, ...getStyles('currentTimeIndicator') }">
    <div v-if="props.withTimeBubble" v-bind="getStyles('currentTimeIndicatorTimeBubble')">
      {{ formattedTime }}
    </div>
    <div v-if="props.withThumb" v-bind="getStyles('currentTimeIndicatorThumb')" />
    <div v-bind="getStyles('currentTimeIndicatorLine')" />
  </Box>
</template>
