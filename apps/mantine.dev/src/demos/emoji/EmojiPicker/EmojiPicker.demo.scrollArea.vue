<script setup lang="ts">
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPicker
    :data="emojiData"
    :scroll-area-props="{ style: { height: '500px' }, type: 'always' }"
  />
</template>
