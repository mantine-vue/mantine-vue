<script setup lang="ts">
import { ref } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { BackgroundImage, Center, Group, Stack, Text, Title } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'
import { CodeHighlight, CodeHighlightTabs } from '@mantine-vue/code-highlight'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import { RichTextEditor } from '@mantine-vue/tiptap'
import { PhImage, PhUploadSimple, PhX } from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const editor = useEditor({
  extensions: [StarterKit],
  content: `
    <h2>Welcome to the editor 👋</h2>
    <p>
      This is a fully featured <strong>rich text editor</strong> built on top of
      <em>Tiptap</em>. Try the toolbar to format text, or create a
      <a href="https://mantine-vue.dev">link</a>.
    </p>
    <ul>
      <li>Bulleted lists</li>
      <li>Ordered lists</li>
    </ul>
    <blockquote>Blockquotes are supported too.</blockquote>
  `,
})

const droppedFiles = ref<string[]>([])
function handleDrop(files: File[]) {
  droppedFiles.value = files.map((file) => file.name)
}

const demoImage =
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'
const slides = ['Fjords', 'Mountains', 'Aurora', 'Coastline']

const vueSnippet = `<script setup lang="ts">
import { Button } from '@mantine-vue/core'
<${'/'}script>

<template>
  <Button variant="light">Click me</Button>
</template>`

const tabsCode = [
  {
    fileName: 'main.ts',
    code: "import { createApp } from 'vue'\n\ncreateApp(App).mount('#app')",
    language: 'ts',
  },
  { fileName: 'theme.ts', code: "export const theme = { primaryColor: 'blue' }", language: 'ts' },
]
</script>

<template>
  <Stack gap="lg">
    <DemoCard
      name="RichTextEditor"
      description="Tiptap-based WYSIWYG editor with a Mantine toolbar."
      pkg="tiptap"
    >
      <RichTextEditor :editor="editor">
        <RichTextEditor.Toolbar sticky stickyOffset="0">
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Code />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </DemoCard>

    <DemoCard
      name="CodeHighlight & CodeHighlightTabs"
      description="Syntax-highlighted code with copy button."
      pkg="code-highlight"
    >
      <Stack gap="md">
        <CodeHighlight :code="vueSnippet" language="vue" radius="md" />
        <CodeHighlightTabs :code="tabsCode" radius="md" />
      </Stack>
    </DemoCard>

    <DemoCard
      name="Carousel"
      description="Embla-powered slideshow with indicators and controls."
      pkg="carousel"
    >
      <Carousel
        withIndicators
        :height="220"
        :slideSize="{ base: '100%', sm: '50%' }"
        slideGap="md"
        :emblaOptions="{ loop: true, align: 'start' }"
      >
        <Carousel.Slide v-for="label in slides" :key="label">
          <BackgroundImage :src="demoImage" style="height: 100%">
            <Center style="height: 100%">
              <Title :order="3" c="white">{{ label }}</Title>
            </Center>
          </BackgroundImage>
        </Carousel.Slide>
      </Carousel>
    </DemoCard>

    <DemoCard name="Dropzone" description="Drag-and-drop file upload area." pkg="dropzone">
      <Stack gap="sm">
        <Dropzone :on-drop="handleDrop" :maxSize="5 * 1024 ** 2" :accept="IMAGE_MIME_TYPE">
          <Group justify="center" gap="xl" :mih="160" style="pointer-events: none">
            <Dropzone.Accept
              ><PhUploadSimple :size="48" color="var(--mantine-color-blue-6)"
            /></Dropzone.Accept>
            <Dropzone.Reject><PhX :size="48" color="var(--mantine-color-red-6)" /></Dropzone.Reject>
            <Dropzone.Idle
              ><PhImage :size="48" color="var(--mantine-color-dimmed)"
            /></Dropzone.Idle>
            <div>
              <Text size="xl" inline>Drag images here or click to select files</Text>
              <Text size="sm" c="dimmed" inline :mt="7"
                >Attach as many files as you like, up to 5 MB each</Text
              >
            </div>
          </Group>
        </Dropzone>
        <Text v-if="droppedFiles.length" size="sm">Accepted: {{ droppedFiles.join(', ') }}</Text>
      </Stack>
    </DemoCard>
  </Stack>
</template>
