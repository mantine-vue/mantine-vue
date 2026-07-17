import dayjs from 'dayjs'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
import { Box, getThemeColor, useSafeMantineTheme } from '@mantine-vue/core'
import type { CurrentTimeIndicatorProps } from '../../component-props'
import type { AnyDateValue, DateLabelFormat } from '../../types'
import { formatDate, getCurrentTimePosition, isInTimeRange } from '../../utils'
import classes from './CurrentTimeIndicator.module.css'

export const CurrentTimeIndicator = defineComponent({
  name: 'CurrentTimeIndicator',
  inheritAttrs: false,
  props: {
    color: { type: String, default: 'red' },
    startOffset: { type: String, default: '0px' },
    endOffset: { type: String, default: '0px' },
    topOffset: { type: String, default: '0px' },
    timeBubbleStartOffset: { type: String, default: '0px' },
    withTimeBubble: { type: Boolean, default: true },
    withThumb: { type: Boolean, default: true },
    currentTimeFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'HH:mm' },
    locale: String,
    startTime: { type: String, default: '00:00:00' },
    endTime: { type: String, default: '23:59:59' },
    intervalMinutes: { type: Number, default: 60 },
    getCurrentTime: Function as PropType<() => AnyDateValue>,
  },
  setup(props, { attrs }) {
    const theme = useSafeMantineTheme()
    const tick = ref(0)
    let timer: ReturnType<typeof setInterval> | undefined
    onMounted(() => {
      timer = setInterval(() => tick.value++, 30_000)
    })
    onBeforeUnmount(() => clearInterval(timer))
    return () => {
      void tick.value
      const now = props.getCurrentTime?.() || dayjs()
      if (!isInTimeRange({ date: now, startTime: props.startTime, endTime: props.endTime }))
        return null
      const top = getCurrentTimePosition({
        now,
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      })
      const color = getThemeColor(props.color, theme.value)
      const formattedTime = props.withTimeBubble
        ? formatDate({
            date: now,
            locale: props.locale || 'en',
            format: props.currentTimeFormat,
          })
        : ''
      return h(
        Box,
        {
          ...attrs,
          class: [classes.currentTimeIndicator, attrs.class],
          style: [
            {
              '--indicator-color': color,
              '--start-offset': props.startOffset,
              '--end-offset': props.endOffset,
              '--top-offset': `calc(${top}% + ${props.topOffset})`,
              '--time-bubble-start-offset': props.timeBubbleStartOffset,
              '--time-bubble-width': formattedTime.toString().toLowerCase().includes('m')
                ? '64px'
                : '46px',
            },
            attrs.style,
          ],
        },
        () => [
          props.withTimeBubble
            ? h('div', { class: classes.currentTimeIndicatorTimeBubble }, formattedTime)
            : null,
          props.withThumb ? h('div', { class: classes.currentTimeIndicatorThumb }) : null,
          h('div', { class: classes.currentTimeIndicatorLine }),
        ],
      )
    }
  },
})

export type { CurrentTimeIndicatorProps }
export type CurrentTimeIndicatorStylesNames =
  | 'currentTimeIndicator'
  | 'currentTimeIndicatorLine'
  | 'currentTimeIndicatorThumb'
  | 'currentTimeIndicatorTimeBubble'
