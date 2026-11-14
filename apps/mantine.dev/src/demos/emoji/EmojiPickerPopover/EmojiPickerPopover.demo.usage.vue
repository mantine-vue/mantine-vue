<script setup lang="ts">
import { ref } from 'vue'
import { ActionIcon } from '@mantine-vue/core'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPickerPopover, type EmojiPickerEmoji } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
const emoji = ref<string | null>(null)
const handleSelect = (selected: EmojiPickerEmoji) => (emoji.value = selected.emoji)
</script>

<template>
  <EmojiPickerPopover :data="emojiData" @emoji-select="handleSelect">
    <ActionIcon variant="default" size="lg" aria-label="Pick emoji">{{ emoji || '☺' }}</ActionIcon>
  </EmojiPickerPopover>
</template>
