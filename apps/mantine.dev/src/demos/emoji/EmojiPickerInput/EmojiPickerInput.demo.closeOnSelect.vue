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
    :close-on-select="false"
  />
</template>
