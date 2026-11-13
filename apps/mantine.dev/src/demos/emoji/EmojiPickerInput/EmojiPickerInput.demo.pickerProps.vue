<script setup lang="ts">
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPickerInput } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPickerInput
    :data="emojiData"
    label="Pick emoji"
    placeholder="Select emoji"
    :picker-props="{ columns: 7, withPreview: false, withCategoryNav: false }"
  />
</template>
