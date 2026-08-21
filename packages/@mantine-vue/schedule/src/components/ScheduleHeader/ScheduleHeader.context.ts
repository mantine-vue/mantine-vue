import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { ScheduleLabelsOverride } from '../../labels'

const ScheduleHeaderLabelsKey: InjectionKey<() => ScheduleLabelsOverride | undefined> = Symbol(
  'mantine-schedule-header-labels',
)

/**
 * Shares the header's `labels` with the compound components rendered inside it.
 * A getter is provided rather than the value so the labels stay reactive.
 */
export function provideScheduleHeaderLabels(labels: () => ScheduleLabelsOverride | undefined) {
  provide(ScheduleHeaderLabelsKey, labels)
}

/**
 * Merges a control's own `labels` over the ones provided by the surrounding `ScheduleHeader`,
 * so overriding a single key does not drop the rest. Must be called during `setup`.
 */
export function useScheduleHeaderLabels(
  override: () => ScheduleLabelsOverride | undefined,
): ComputedRef<ScheduleLabelsOverride | undefined> {
  const contextLabels = inject(ScheduleHeaderLabelsKey, undefined)

  return computed(() => {
    const inherited = contextLabels?.()
    const own = override()

    if (!own) {
      return inherited
    }

    if (!inherited) {
      return own
    }

    return { ...inherited, ...own }
  })
}
