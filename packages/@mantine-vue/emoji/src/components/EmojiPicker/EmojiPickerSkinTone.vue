<script setup lang="ts">
import { ref } from 'vue'
import { Popover, UnstyledButton } from '@mantine-vue/core'
import { useEmojiPickerContext } from './EmojiPicker.context'

defineOptions({ name: 'EmojiPickerSkinTone' })

const props = defineProps<{ skinTone: number }>()
const emit = defineEmits<{ skinToneChange: [skinTone: number] }>()

const SKIN_TONE_EMOJIS = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿']

const SKIN_TONE_LABEL_KEYS = [
  'skinToneDefault',
  'skinToneLight',
  'skinToneMediumLight',
  'skinToneMedium',
  'skinToneMediumDark',
  'skinToneDark',
] as const

const ctx = useEmojiPickerContext()
const opened = ref(false)

function select(index: number) {
  emit('skinToneChange', index)
  opened.value = false
}
</script>

<template>
  <Popover
    v-model:opened="opened"
    position="top"
    with-arrow
    :within-portal="false"
    trap-focus
    return-focus
  >
    <Popover.Target>
      <UnstyledButton
        v-bind="ctx.getStyles('skinToneButton')"
        :aria-label="ctx.labels.skinTone"
        :title="ctx.labels.skinTone"
        @click="opened = !opened"
        >{{ SKIN_TONE_EMOJIS[props.skinTone] }}</UnstyledButton
      >
    </Popover.Target>
    <Popover.Dropdown v-bind="ctx.getStyles('skinToneDropdown')">
      <div v-bind="ctx.getStyles('skinToneSelector')">
        <UnstyledButton
          v-for="(emoji, index) in SKIN_TONE_EMOJIS"
          :key="index"
          v-bind="ctx.getStyles('skinToneButton')"
          :aria-label="ctx.labels[SKIN_TONE_LABEL_KEYS[index]]"
          :title="ctx.labels[SKIN_TONE_LABEL_KEYS[index]]"
          :aria-pressed="props.skinTone === index"
          :data-active="props.skinTone === index || undefined"
          :data-autofocus="props.skinTone === index || undefined"
          @click="select(index)"
          >{{ emoji }}</UnstyledButton
        >
      </div>
    </Popover.Dropdown>
  </Popover>
</template>
