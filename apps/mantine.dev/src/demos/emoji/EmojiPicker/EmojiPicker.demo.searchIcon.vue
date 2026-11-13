<script setup lang="ts">
import { h } from 'vue'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
const searchInputProps = { leftSection: h(PhMagnifyingGlass) }
</script>

<template>
  <EmojiPicker :data="emojiData" :search-input-props="searchInputProps" />
</template>
