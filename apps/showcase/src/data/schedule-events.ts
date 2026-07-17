import type { ScheduleEventData } from '@mantine-vue/schedule'

/** Anchor date used by every schedule example (a Wednesday). */
export const SCHEDULE_DATE = '2026-07-15'

/** Fixed "now" so the current-time indicator renders deterministically. */
export const scheduleNow = () => '2026-07-15 11:20:00'

interface EventMeta {
  location?: string
  attendees?: number
  organizer?: string
}

/** Background "focus / working hours" blocks that sit behind regular events. */
const focusHours: ScheduleEventData[] = [
  {
    id: 'focus-mon',
    title: 'Focus time',
    start: '2026-07-13 08:00:00',
    end: '2026-07-13 12:00:00',
    color: 'gray',
    display: 'background',
  },
  {
    id: 'focus-wed',
    title: 'Focus time',
    start: '2026-07-15 08:00:00',
    end: '2026-07-15 09:30:00',
    color: 'gray',
    display: 'background',
  },
  {
    id: 'focus-fri',
    title: 'Deep work',
    start: '2026-07-17 13:00:00',
    end: '2026-07-17 15:00:00',
    color: 'gray',
    display: 'background',
  },
]

/** Timed meetings across the primary working week (13–17 July 2026). */
const weekMeetings: ScheduleEventData[] = [
  // Monday
  {
    id: 'sprint-planning',
    title: 'Sprint planning',
    start: '2026-07-13 10:00:00',
    end: '2026-07-13 11:30:00',
    color: 'blue',
    payload: { location: 'Nebula room', attendees: 8, organizer: 'Priya' },
  },
  {
    id: '1on1-alex',
    title: '1:1 with Alex',
    start: '2026-07-13 14:00:00',
    end: '2026-07-13 14:30:00',
    color: 'grape',
    payload: { location: 'Zoom', attendees: 2, organizer: 'You' },
  },
  // Tuesday
  {
    id: 'design-review',
    title: 'Design review',
    start: '2026-07-14 11:00:00',
    end: '2026-07-14 12:00:00',
    color: 'teal',
    payload: { location: 'Figma + Aurora room', attendees: 6, organizer: 'Maya' },
  },
  {
    id: 'customer-call',
    title: 'Customer call — Acme',
    start: '2026-07-14 13:30:00',
    end: '2026-07-14 14:30:00',
    color: 'pink',
    payload: { location: 'Zoom', attendees: 5, organizer: 'Sam' },
  },
  {
    id: 'bug-triage',
    title: 'Bug triage',
    start: '2026-07-14 13:30:00',
    end: '2026-07-14 14:00:00',
    color: 'red',
    payload: { location: 'Slack huddle', attendees: 4, organizer: 'Dev' },
  },
  // Wednesday
  {
    id: 'arch-sync',
    title: 'Architecture sync',
    start: '2026-07-15 09:30:00',
    end: '2026-07-15 10:30:00',
    color: 'indigo',
    payload: { location: 'Comet room', attendees: 5, organizer: 'Lena' },
  },
  {
    id: 'lunch-learn',
    title: 'Lunch & learn: Vue 3.5',
    start: '2026-07-15 12:00:00',
    end: '2026-07-15 13:00:00',
    color: 'lime',
    payload: { location: 'Cafeteria', attendees: 20, organizer: 'Guild' },
  },
  {
    id: 'roadmap-workshop',
    title: 'Roadmap workshop',
    start: '2026-07-15 14:00:00',
    end: '2026-07-15 16:00:00',
    color: 'orange',
    payload: { location: 'Aurora room', attendees: 10, organizer: 'Priya' },
  },
  // Thursday
  {
    id: 'interview',
    title: 'Interview — Frontend',
    start: '2026-07-16 10:00:00',
    end: '2026-07-16 11:00:00',
    color: 'violet',
    payload: { location: 'Meet', attendees: 3, organizer: 'You' },
  },
  {
    id: 'qa-signoff',
    title: 'QA sign-off',
    start: '2026-07-16 15:00:00',
    end: '2026-07-16 16:00:00',
    color: 'green',
    payload: { location: 'Comet room', attendees: 4, organizer: 'Nina' },
  },
  // Friday
  {
    id: 'demo-day',
    title: 'Demo day',
    start: '2026-07-17 11:00:00',
    end: '2026-07-17 12:00:00',
    color: 'blue',
    payload: { location: 'All-hands room', attendees: 30, organizer: 'Priya' },
  },
  {
    id: 'retro',
    title: 'Sprint retro',
    start: '2026-07-17 15:00:00',
    end: '2026-07-17 16:00:00',
    color: 'grape',
    payload: { location: 'Nebula room', attendees: 8, organizer: 'Sam' },
  },
]

/** All-day and multi-day items. */
const allDayEvents: ScheduleEventData[] = [
  {
    id: 'conf-day',
    title: 'VueConf (attending)',
    start: '2026-07-16 00:00:00',
    end: '2026-07-17 00:00:00',
    color: 'cyan',
    payload: { location: 'Amsterdam' },
  },
  {
    id: 'offsite',
    title: 'Company offsite',
    start: '2026-07-20 00:00:00',
    end: '2026-07-23 00:00:00',
    color: 'orange',
    payload: { location: 'Lake house' },
  },
  {
    id: 'release-freeze',
    title: 'Release freeze',
    start: '2026-07-27 00:00:00',
    end: '2026-07-29 00:00:00',
    color: 'red',
  },
]

/** Recurring series (expanded automatically for the visible range). */
const recurringSeries: ScheduleEventData[] = [
  {
    id: 'standup',
    title: 'Daily stand-up',
    start: '2026-07-13 09:00:00',
    end: '2026-07-13 09:15:00',
    color: 'cyan',
    recurrence: { rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=20' },
    payload: { location: 'Slack huddle', attendees: 8 },
  },
  {
    id: 'weekly-1on1',
    title: 'Team 1:1s',
    start: '2026-07-14 16:00:00',
    end: '2026-07-14 16:45:00',
    color: 'grape',
    recurrence: { rrule: 'FREQ=WEEKLY;BYDAY=TU;COUNT=8' },
    payload: { attendees: 2 },
  },
]

/** Extra items scattered across July so Month / Year views feel populated. */
const monthSpread: ScheduleEventData[] = [
  {
    id: 'ml-kickoff',
    title: 'Q3 kickoff',
    start: '2026-07-01 09:30:00',
    end: '2026-07-01 11:00:00',
    color: 'blue',
  },
  {
    id: 'board-review',
    title: 'Board review',
    start: '2026-07-06 13:00:00',
    end: '2026-07-06 15:00:00',
    color: 'indigo',
  },
  {
    id: 'security-audit',
    title: 'Security audit',
    start: '2026-07-09 10:00:00',
    end: '2026-07-09 12:00:00',
    color: 'red',
  },
  {
    id: 'perf-week',
    title: 'Performance week',
    start: '2026-07-23 00:00:00',
    end: '2026-07-25 00:00:00',
    color: 'teal',
  },
  {
    id: 'ship-v2',
    title: 'Ship v2.0 🚀',
    start: '2026-07-30 16:00:00',
    end: '2026-07-30 17:00:00',
    color: 'green',
  },
]

/** Milestones across the whole year, for the Year view. */
const yearMilestones: ScheduleEventData[] = [
  {
    id: 'y-jan',
    title: 'Kickoff',
    start: '2026-01-12 09:00:00',
    end: '2026-01-12 10:00:00',
    color: 'blue',
  },
  {
    id: 'y-feb',
    title: 'Beta launch',
    start: '2026-02-18 09:00:00',
    end: '2026-02-18 10:00:00',
    color: 'grape',
  },
  {
    id: 'y-mar',
    title: 'Design system',
    start: '2026-03-24 09:00:00',
    end: '2026-03-24 10:00:00',
    color: 'teal',
  },
  {
    id: 'y-apr',
    title: 'GA release',
    start: '2026-04-15 09:00:00',
    end: '2026-04-15 10:00:00',
    color: 'green',
  },
  {
    id: 'y-may',
    title: 'Roadshow',
    start: '2026-05-20 09:00:00',
    end: '2026-05-20 10:00:00',
    color: 'orange',
  },
  {
    id: 'y-sep',
    title: 'v3 planning',
    start: '2026-09-08 09:00:00',
    end: '2026-09-08 10:00:00',
    color: 'indigo',
  },
  {
    id: 'y-oct',
    title: 'Hack week',
    start: '2026-10-19 09:00:00',
    end: '2026-10-23 00:00:00',
    color: 'violet',
  },
  {
    id: 'y-dec',
    title: 'Year in review',
    start: '2026-12-17 09:00:00',
    end: '2026-12-17 10:00:00',
    color: 'red',
  },
]

/** Clone helper so interactive demos can safely mutate their own copy. */
export function cloneEvents<T extends ScheduleEventData>(events: T[]): T[] {
  return events.map((event) => ({ ...event }))
}

/** Full working-week dataset for Day / Week / unified examples. */
export const workWeekEvents: ScheduleEventData[] = [
  ...focusHours,
  ...weekMeetings,
  ...allDayEvents,
  ...recurringSeries,
]

export const interactiveWeekEvents: ScheduleEventData[] = [
  ...focusHours,
  ...weekMeetings,
  ...allDayEvents,
]

/** Recurring-only dataset for the recurrence example. */
export const recurringWeekEvents: ScheduleEventData[] = [
  ...recurringSeries,
  ...weekMeetings.slice(0, 3),
]

/** Month-scale dataset (working week + scattered items across July). */
export const monthEvents: ScheduleEventData[] = [
  ...weekMeetings,
  ...allDayEvents,
  ...recurringSeries,
  ...monthSpread,
]

/** Year-scale dataset (per-month milestones). */
export const yearEvents: ScheduleEventData[] = [...yearMilestones, ...monthSpread]

export type { EventMeta }
