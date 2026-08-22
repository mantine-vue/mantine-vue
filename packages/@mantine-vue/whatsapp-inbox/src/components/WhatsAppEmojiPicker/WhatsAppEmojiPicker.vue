<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'

const defaultProps = {
  recentLimit: 24,
  withRecent: true,
  withSearch: true,
  withTabs: true,
  withPreview: true,
  columns: 8,
} as const

function toCssLength(value: string | number | undefined) {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? `${value}px` : value
}

const varsResolver = createVarsResolver<any>((_, { columns, height, width }) => ({
  emojiPickerRoot: {
    '--wa-emoji-columns': columns === undefined ? undefined : String(columns),
    '--wa-emoji-height': toCssLength(height),
    '--wa-emoji-width': toCssLength(width),
  },
}))

export { defaultProps, toCssLength, varsResolver }
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import { Box, TextInput, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import {
  filterEmojis,
  getEmojiGroups,
  searchEmojis,
  WHATSAPP_EMOJI_GROUPS,
  WHATSAPP_EMOJIS_BY_CHAR,
  type WhatsAppEmoji,
  type WhatsAppEmojiGroupId,
} from '../../emoji'
import { WhatsAppIcon } from '../../icons'
import type {
  WhatsAppEmojiPickerEmits,
  WhatsAppEmojiPickerOwnProps,
  WhatsAppEmojiPickerSlots,
} from './WhatsAppEmojiPicker.types'
import classes from './WhatsAppEmojiPicker.module.css'

defineOptions({
  name: 'WhatsAppEmojiPicker',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppEmojiPickerOwnProps>(), {
  search: undefined,
  defaultSearch: undefined,
  recentEmojis: undefined,
  defaultRecentEmojis: undefined,
  recentLimit: undefined,
  withRecent: undefined,
  withSearch: undefined,
  withTabs: undefined,
  withPreview: undefined,
  columns: undefined,
  height: undefined,
  width: undefined,
  groups: undefined,
  excludeGroups: undefined,
  emojis: undefined,
  excludeEmojis: undefined,
  filter: undefined,
  emojiData: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppEmojiPickerEmits>()
defineSlots<WhatsAppEmojiPickerSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppEmojiPicker', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppEmojiPicker',
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
  rootSelector: 'emojiPickerRoot',
})

const [search, setSearch] = useUncontrolled<string>({
  value: () => props.search,
  defaultValue: props.defaultSearch,
  finalValue: '',
  onChange: (value) => emit('update:search', value),
})

const [recent, setRecent] = useUncontrolled<string[]>({
  value: () => props.recentEmojis,
  defaultValue: props.defaultRecentEmojis,
  finalValue: [],
  onChange: (value) => emit('update:recentEmojis', value),
})

const available = computed(() =>
  filterEmojis({
    groups: props.groups,
    excludeGroups: props.excludeGroups,
    emojis: props.emojis,
    excludeEmojis: props.excludeEmojis,
    filter: props.filter,
    emojiData: props.emojiData,
  }),
)

const availableChars = computed(() => new Set(available.value.map((entry) => entry.emoji)))

/**
 * Recently used entries, resolved back to full records.
 *
 * Filtered against what is currently available, so an emoji that a later policy change put out of
 * reach does not linger in the recent row.
 */
const recentEmojis = computed<WhatsAppEmoji[]>(() => {
  if (!props.withRecent) {
    return []
  }

  return recent.value
    .filter((char) => availableChars.value.has(char))
    .map((char) => WHATSAPP_EMOJIS_BY_CHAR.get(char))
    .filter((entry): entry is WhatsAppEmoji => entry !== undefined)
    .map((entry) => ({ ...entry, group: 'recent' as const }))
})

const matches = computed(() => searchEmojis(available.value, search.value))
const searching = computed(() => search.value.trim().length > 0)

const sections = computed(() => {
  if (searching.value) {
    return matches.value.length > 0
      ? [{ group: 'recent' as WhatsAppEmojiGroupId, emojis: matches.value, isResults: true }]
      : []
  }

  const groups = getEmojiGroups(available.value, props.groups)
  const result: { group: WhatsAppEmojiGroupId; emojis: WhatsAppEmoji[]; isResults: boolean }[] = []

  if (recentEmojis.value.length > 0) {
    result.push({ group: 'recent', emojis: recentEmojis.value, isResults: false })
  }

  for (const group of groups) {
    result.push({
      group,
      emojis: available.value.filter((entry) => entry.group === group),
      isResults: false,
    })
  }

  return result
})

const tabs = computed(() => {
  const present = new Set(sections.value.map((section) => section.group))

  return WHATSAPP_EMOJI_GROUPS.filter((group) => present.has(group.id))
})

const activeGroup = ref<WhatsAppEmojiGroupId>('smileys')
const previewEmoji = ref<WhatsAppEmoji | null>(null)

const bodyElement = ref<HTMLDivElement | null>(null)
const sectionElements = new Map<WhatsAppEmojiGroupId, HTMLElement>()

function registerSection(group: WhatsAppEmojiGroupId, element: Element | null) {
  if (element) {
    sectionElements.set(group, element as HTMLElement)
  } else {
    sectionElements.delete(group)
  }
}

function scrollToGroup(group: WhatsAppEmojiGroupId) {
  const body = bodyElement.value
  const section = sectionElements.get(group)

  if (body && section) {
    body.scrollTop = section.offsetTop
  }

  activeGroup.value = group
  emit('groupChange', group)
}

/** Synchronizes the active tab with the scroll position. */
function handleScroll() {
  const body = bodyElement.value

  if (!body || searching.value) {
    return
  }

  let current = sections.value[0]?.group

  for (const section of sections.value) {
    const element = sectionElements.get(section.group)

    if (element && element.offsetTop - body.scrollTop <= 8) {
      current = section.group
    }
  }

  if (current && current !== activeGroup.value) {
    activeGroup.value = current
    emit('groupChange', current)
  }
}

watch(sections, () => {
  const first = sections.value[0]?.group

  if (first && !sections.value.some((section) => section.group === activeGroup.value)) {
    activeGroup.value = first
  }
})

/**
 * Flat list of every rendered emoji, used by the arrow keys.
 *
 * The grid uses roving tabindex so only one emoji button is in the tab order.
 */
const flatEmojis = computed(() => sections.value.flatMap((section) => section.emojis))

const activeIndex = ref(0)

watch(flatEmojis, () => {
  activeIndex.value = 0
})

function focusIndex(index: number) {
  const clamped = Math.max(0, Math.min(index, flatEmojis.value.length - 1))
  activeIndex.value = clamped

  void nextTick(() => {
    const target = bodyElement.value?.querySelectorAll<HTMLElement>('[data-emoji-index]')[clamped]

    target?.focus()
    previewEmoji.value = flatEmojis.value[clamped] ?? null
  })
}

function handleItemFocus(index: number, entry: WhatsAppEmoji) {
  activeIndex.value = index
  previewEmoji.value = entry
}

function handleGridKeydown(event: KeyboardEvent) {
  const columns = props.columns ?? defaultProps.columns
  const keys: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: columns,
    ArrowUp: -columns,
  }

  if (event.key in keys) {
    event.preventDefault()
    focusIndex(activeIndex.value + keys[event.key])
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusIndex(0)
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusIndex(flatEmojis.value.length - 1)
  }
}

function select(emoji: WhatsAppEmoji) {
  const next = [emoji.emoji, ...recent.value.filter((char) => char !== emoji.emoji)].slice(
    0,
    props.recentLimit ?? defaultProps.recentLimit,
  )

  setRecent(next)
  emit('select', emoji)
}

function indexOf(section: number, item: number) {
  let offset = 0

  for (let index = 0; index < section; index += 1) {
    offset += sections.value[index].emojis.length
  }

  return offset + item
}

function groupLabel(group: WhatsAppEmojiGroupId, isResults: boolean) {
  if (isResults) {
    return config.labels.emojiPickerSearchResults
  }

  const meta = WHATSAPP_EMOJI_GROUPS.find((entry) => entry.id === group)

  return meta ? config.labels[meta.labelKey] : group
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('emojiPickerRoot') }"
    role="group"
    :aria-label="config.labels.emojiPickerLabel"
  >
    <TextInput
      v-if="props.withSearch"
      v-bind="getStyles('emojiPickerSearch')"
      size="xs"
      type="search"
      :model-value="search"
      :placeholder="config.labels.emojiPickerSearchPlaceholder"
      :aria-label="config.labels.emojiPickerSearchPlaceholder"
      @update:model-value="setSearch($event)"
    >
      <template #leftSection>
        <WhatsAppIcon name="search" size="14" />
      </template>
    </TextInput>

    <Box
      v-if="props.withTabs && !searching && tabs.length > 1"
      v-bind="getStyles('emojiPickerTabs')"
      role="tablist"
      :aria-label="config.labels.emojiPickerLabel"
    >
      <UnstyledButton
        v-for="tab in tabs"
        :key="tab.id"
        v-bind="getStyles('emojiPickerTab')"
        type="button"
        role="tab"
        :aria-selected="tab.id === activeGroup"
        :aria-label="config.labels[tab.labelKey] as string"
        :title="config.labels[tab.labelKey] as string"
        :data-active="tab.id === activeGroup ? '' : undefined"
        @click="scrollToGroup(tab.id)"
      >
        {{ tab.icon }}
      </UnstyledButton>
    </Box>

    <div ref="bodyElement" v-bind="getStyles('emojiPickerBody')" @scroll="handleScroll">
      <Box v-if="sections.length === 0" v-bind="getStyles('emojiPickerEmpty')">
        <slot v-if="slots.emptyEmojis" name="emptyEmojis" :search="search" />
        <template v-else>{{ config.labels.emojiPickerNoResults }}</template>
      </Box>

      <Box
        v-for="(section, sectionIndex) in sections"
        :key="section.group + (section.isResults ? '-results' : '')"
        :root-ref="(node: Element | null) => registerSection(section.group, node)"
        v-bind="getStyles('emojiPickerGroup')"
      >
        <Box v-bind="getStyles('emojiPickerGroupLabel')">
          {{ groupLabel(section.group, section.isResults) }}
        </Box>

        <Box v-bind="getStyles('emojiPickerGrid')" role="group" @keydown="handleGridKeydown">
          <UnstyledButton
            v-for="(entry, itemIndex) in section.emojis"
            :key="entry.emoji"
            v-bind="getStyles('emojiPickerItem')"
            type="button"
            :data-emoji-index="indexOf(sectionIndex, itemIndex)"
            :tabindex="indexOf(sectionIndex, itemIndex) === activeIndex ? 0 : -1"
            :aria-label="entry.name"
            :title="entry.name"
            @click="select(entry)"
            @focus="handleItemFocus(indexOf(sectionIndex, itemIndex), entry)"
            @mouseenter="previewEmoji = entry"
          >
            {{ entry.emoji }}
          </UnstyledButton>
        </Box>
      </Box>
    </div>

    <Box v-if="props.withPreview" v-bind="getStyles('emojiPickerPreview')">
      <slot v-if="slots.emojiPickerFooter" name="emojiPickerFooter" :emoji="previewEmoji" />
      <template v-else-if="previewEmoji">
        <Box component="span" v-bind="getStyles('emojiPickerPreviewEmoji')">
          {{ previewEmoji.emoji }}
        </Box>
        <Box component="span" v-bind="getStyles('emojiPickerPreviewName')">
          {{ previewEmoji.name }}
        </Box>
      </template>
    </Box>
  </Box>
</template>
