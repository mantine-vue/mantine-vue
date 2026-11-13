# @mantine-vue/emoji

Emoji picker components for Mantine Vue: `EmojiPicker`, `EmojiPickerPopover` and `EmojiPickerInput`.
The picker works with any emoji data source through adapters, `emoji-mart` and `emojibase-data`
adapters are included.

## Installation

```bash
yarn add @mantine-vue/emoji @mantine-vue/core @mantine-vue/hooks
```

Import styles after core styles:

```ts
import '@mantine-vue/core/styles.css'
import '@mantine-vue/emoji/styles.css'
```

## Usage

```vue
<script setup lang="ts">
import data from '@emoji-mart/data'
import { EmojiPicker, emojiMartAdapter } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPicker :data="emojiData" @emoji-select="(emoji) => console.log(emoji)" />
</template>
```

See the Mantine Vue documentation for all options.
