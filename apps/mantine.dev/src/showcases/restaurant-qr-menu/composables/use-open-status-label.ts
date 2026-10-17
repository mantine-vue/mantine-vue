import { computed } from 'vue'
import { useQrMenu } from '../app/use-qr-menu'
import { getZonedTime } from '../domain/availability'

/** Human readable open / closed label for the active restaurant. */
export function useOpenStatusLabel() {
  const { openState, t, format, data, clock } = useQrMenu()

  return computed(() => {
    const state = openState.value
    if (state.open) {
      const time = format.clock(state.closesAt)
      return {
        open: true,
        closingSoon: state.closingSoon,
        label: t('status.open'),
        detail: Number.isFinite(state.closesInMinutes)
          ? state.closingSoon
            ? t('status.closingSoon', { time })
            : t('status.closesAt', { time })
          : '',
      }
    }

    let detail = ''
    const restaurant = data.restaurant.value
    if (state.opensAt && state.opensDay !== null && restaurant) {
      const today = getZonedTime(clock.value, restaurant.timeZone).day
      const time = format.clock(state.opensAt)
      detail =
        state.opensDay === today && (state.opensInMinutes ?? 0) < 24 * 60
          ? t('status.opensToday', { time })
          : state.opensDay === (today + 1) % 7
            ? t('status.opensTomorrow', { time })
            : t('status.opensAt', { day: format.weekday(state.opensDay), time })
    }

    return { open: false, closingSoon: false, label: t('status.closed'), detail }
  })
}
