<script setup lang="ts">
import { ref } from 'vue'
import { Text } from '@mantine-vue/core'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
const skinTone = ref(0)
</script>

<template>
  <div>
    <EmojiPicker v-model:skin-tone="skinTone" :data="emojiData" />
    <Text mt="md">Current skin tone: {{ skinTone }}</Text>
  </div>
</template>
