<script setup lang="ts">
import { ref } from 'vue'
import { Group, Stack, Switch } from '@mantine-vue/core'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
const withSearch = ref(true)
const withCategoryNav = ref(true)
const withPreview = ref(true)
const withSkinToneSelector = ref(true)
</script>

<template>
  <Group align="flex-start">
    <Stack>
      <Switch v-model:checked="withSearch" label="withSearch" />
      <Switch v-model:checked="withCategoryNav" label="withCategoryNav" />
      <Switch v-model:checked="withPreview" label="withPreview" />
      <Switch v-model:checked="withSkinToneSelector" label="withSkinToneSelector" />
    </Stack>
    <EmojiPicker
      :data="emojiData"
      :with-search="withSearch"
      :with-category-nav="withCategoryNav"
      :with-preview="withPreview"
      :with-skin-tone-selector="withSkinToneSelector"
    />
  </Group>
</template>
