# @mantine-vue/tiptap

Advanced rich text editor for Vue, built on top of [Tiptap](https://tiptap.dev/), equivalent to `@mantine/tiptap`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/tiptap @mantine-vue/core @mantine-vue/hooks @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-link @floating-ui/dom

# or with npm
npm i @mantine-vue/tiptap @mantine-vue/core @mantine-vue/hooks @tiptap/core @tiptap/vue-3 @tiptap/pm @tiptap/extension-link @floating-ui/dom
```

## Usage

```vue
<script setup>
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '@mantine-vue/tiptap'
import '@mantine-vue/tiptap/styles.css'

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Hello world!</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.Bold />
      <RichTextEditor.Italic />
    </RichTextEditor.Toolbar>
    <RichTextEditor.Content />
  </RichTextEditor>
</template>
```

## Documentation

Full API and examples: [mantine-vue.dev/x/tiptap](https://mantine-vue.dev/x/tiptap)

## Peer dependencies

- `vue` ^3.5.0
- `@mantine-vue/core`
- `@mantine-vue/hooks`
- `@tiptap/core`, `@tiptap/vue-3`, `@tiptap/pm`, `@tiptap/extension-link` >=3.3.0
- `@floating-ui/dom` ^1.0.0

## License

MIT
