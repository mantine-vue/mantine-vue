<script setup lang="ts">
import { ref } from 'vue'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import { Button, Center, Stack, Text } from '@mantine-vue/core'
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
const search = ref('')
</script>

<template>
  <EmojiPicker v-model:search-value="search" :data="emojiData">
    <template #empty>
      <Center h="100%">
        <Stack align="center" gap="xs">
          <PhMagnifyingGlass :size="32" />
          <Text size="sm" c="dimmed" ta="center">No emojis match your search</Text>
          <Button variant="light" size="compact-sm" @click="search = ''">Clear search</Button>
        </Stack>
      </Center>
    </template>
  </EmojiPicker>
</template>
