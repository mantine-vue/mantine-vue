import type { DayPositionedEventData } from '../../../types'

export function getOverlapClusters(events: DayPositionedEventData[]): DayPositionedEventData[][] {
  const sorted = [...events].sort((a, b) => a.position.top - b.position.top)
  const clusters: DayPositionedEventData[][] = []
  let current: DayPositionedEventData[] = []
  let end = -1
  sorted.forEach((event) => {
    if (current.length && event.position.top >= end) {
      clusters.push(current)
      current = []
      end = -1
    }
    current.push(event)
    end = Math.max(end, event.position.top + event.position.height)
  })
  if (current.length) clusters.push(current)
  return clusters
}
