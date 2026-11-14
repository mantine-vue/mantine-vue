<script setup lang="ts">
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPicker :data="emojiData" @emoji-select="(emoji) => console.log(emoji)" />
</template>
