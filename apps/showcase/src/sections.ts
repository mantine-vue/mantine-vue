import type { Component } from 'vue'
import {
  PhArrowRight,
  PhArrowsLeftRight,
  PhCalendar,
  PhCalendarDots,
  PhChartScatter,
  PhChatCircle,
  PhFileText,
  PhGear,
  PhImage,
  PhMagnifyingGlass,
  PhPencilSimple,
  PhSquaresFour,
  PhTextB,
  PhWarningCircle,
} from '@phosphor-icons/vue'
import ButtonsSection from './sections/ButtonsSection.vue'
import ChartsSection from './sections/ChartsSection.vue'
import ComboboxSection from './sections/ComboboxSection.vue'
import DataDisplaySection from './sections/DataDisplaySection.vue'
import DatesSection from './sections/DatesSection.vue'
import FeedbackSection from './sections/FeedbackSection.vue'
import InputsSection from './sections/InputsSection.vue'
import LayoutSection from './sections/LayoutSection.vue'
import NavigationSection from './sections/NavigationSection.vue'
import OverlaysSection from './sections/OverlaysSection.vue'
import RichContentSection from './sections/RichContentSection.vue'
import ScheduleSection from './sections/ScheduleSection.vue'
import TypographySection from './sections/TypographySection.vue'
import UtilitiesSection from './sections/UtilitiesSection.vue'

export interface ShowcaseSection {
  id: string
  label: string
  description: string
  icon: Component
  component: Component
  count: number
}

export const sections: ShowcaseSection[] = [
  {
    id: 'inputs',
    label: 'Inputs',
    description:
      'Form controls for collecting user input — text fields, selects, checkboxes, sliders and more.',
    icon: PhPencilSimple,
    component: InputsSection,
    count: 29,
  },
  {
    id: 'buttons',
    label: 'Buttons & Actions',
    description: 'Clickable elements that trigger actions.',
    icon: PhArrowRight,
    component: ButtonsSection,
    count: 7,
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Components that help users move around your application.',
    icon: PhArrowsLeftRight,
    component: NavigationSection,
    count: 8,
  },
  {
    id: 'data-display',
    label: 'Data Display',
    description: 'Present structured information — cards, tables, badges, avatars and lists.',
    icon: PhImage,
    component: DataDisplaySection,
    count: 17,
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Communicate status: progress, loading states, alerts and notifications.',
    icon: PhWarningCircle,
    component: FeedbackSection,
    count: 8,
  },
  {
    id: 'overlays',
    label: 'Overlays',
    description: 'Floating surfaces rendered above the page — modals, drawers, menus and tooltips.',
    icon: PhChatCircle,
    component: OverlaysSection,
    count: 12,
  },
  {
    id: 'layout',
    label: 'Layout',
    description: 'Structural primitives for arranging content on the page.',
    icon: PhSquaresFour,
    component: LayoutSection,
    count: 15,
  },
  {
    id: 'typography',
    label: 'Typography',
    description: 'Text, headings and inline content helpers.',
    icon: PhTextB,
    component: TypographySection,
    count: 8,
  },
  {
    id: 'combobox',
    label: 'Combobox',
    description: 'Low-level building blocks for custom select, autocomplete and dropdown widgets.',
    icon: PhMagnifyingGlass,
    component: ComboboxSection,
    count: 1,
  },
  {
    id: 'dates',
    label: 'Dates & Calendar',
    description: 'Date and time pickers from @mantine-vue/dates.',
    icon: PhCalendar,
    component: DatesSection,
    count: 9,
  },
  {
    id: 'schedule',
    label: 'Schedule',
    description:
      'Calendar and scheduling with Day, Week, Month and Year views — drag & drop, resizing, recurring events, background events and custom rendering.',
    icon: PhCalendarDots,
    component: ScheduleSection,
    count: 5,
  },
  {
    id: 'charts',
    label: 'Charts',
    description: 'Composable, responsive charts from @mantine-vue/charts.',
    icon: PhChartScatter,
    component: ChartsSection,
    count: 11,
  },
  {
    id: 'rich-content',
    label: 'Rich Content',
    description: 'Rich text editing, code highlighting, carousels and file dropzones.',
    icon: PhFileText,
    component: RichContentSection,
    count: 4,
  },
  {
    id: 'utilities',
    label: 'Utilities',
    description: 'Behavioral helpers and low-level primitives with little or no visual output.',
    icon: PhGear,
    component: UtilitiesSection,
    count: 9,
  },
]
