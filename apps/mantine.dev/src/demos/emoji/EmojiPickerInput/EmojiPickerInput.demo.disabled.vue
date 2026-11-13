<script setup lang="ts">
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPickerInput } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPickerInput :data="emojiData" label="Disabled" placeholder="Select emoji" disabled />
</template>
