<script setup lang="ts">
import { Group } from '@mantine-vue/core'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <Group align="flex-start">
    <EmojiPicker :data="emojiData" size="xs" />
    <EmojiPicker :data="emojiData" size="md" />
  </Group>
</template>
