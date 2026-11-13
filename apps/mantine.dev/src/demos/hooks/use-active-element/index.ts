import { computed, defineComponent, h, ref } from 'vue'
import { Badge, Code, Group, Kbd, Stack, Text, Textarea, TextInput } from '@mantine-vue/core'
import { useActiveElement, useWindowEvent } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { Code, Group, Text, Textarea, TextInput } from '@mantine-vue/core'
import { useActiveElement } from '@mantine-vue/hooks'

const activeElement = useActiveElement()

function describe(element: Element | null) {
  if (!element) {
    return 'null'
  }

  return element.id ? \`\${element.tagName.toLowerCase()}#\${element.id}\` : element.tagName.toLowerCase()
}
</script>

<template>
  <Text>
    Focused element: <Code>{{ describe(activeElement) }}</Code>
  </Text>

  <Group grow mt="md">
    <TextInput id="first-name" label="First name" placeholder="First name" />
    <TextInput id="last-name" label="Last name" placeholder="Last name" />
  </Group>

  <Textarea id="message" mt="md" label="Message" placeholder="Your message" />
</template>`

function describeElement(element: Element | null) {
  if (!element) {
    return 'null'
  }

  return element.id
    ? `${element.tagName.toLowerCase()}#${element.id}`
    : element.tagName.toLowerCase()
}

const UsageDemo = defineComponent({
  name: 'UseActiveElementUsageDemo',
  setup() {
    const activeElement = useActiveElement()

    return () => [
      h(Text, null, () => [
        'Focused element: ',
        h(Code, null, () => describeElement(activeElement.value)),
      ]),
      h(Group, { grow: true, mt: 'md' }, () => [
        h(TextInput, { id: 'first-name', label: 'First name', placeholder: 'First name' }),
        h(TextInput, { id: 'last-name', label: 'Last name', placeholder: 'Last name' }),
      ]),
      h(Textarea, { id: 'message', mt: 'md', label: 'Message', placeholder: 'Your message' }),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code: usageCode,
  component: UsageDemo,
}

const hotkeyCode = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Group, Kbd, Stack, Text, Textarea, TextInput } from '@mantine-vue/core'
import { useActiveElement, useWindowEvent } from '@mantine-vue/hooks'

const searchRef = ref<HTMLInputElement | null>(null)
const activeElement = useActiveElement()

const isEditing = computed(
  () =>
    activeElement.value?.tagName === 'INPUT' ||
    activeElement.value?.tagName === 'TEXTAREA' ||
    (activeElement.value as HTMLElement | null)?.isContentEditable === true,
)

useWindowEvent('keydown', (event) => {
  // Ignore the shortcut while the user is typing in a field
  if (event.key === '/' && !isEditing.value) {
    event.preventDefault()
    searchRef.value?.focus()
  }
})
</script>

<template>
  <Stack>
    <Group>
      <Text size="sm">Press <Kbd>/</Kbd> to focus the search field</Text>
      <Badge :color="isEditing ? 'gray' : 'teal'" variant="default">
        {{ isEditing ? 'Shortcut disabled' : 'Shortcut active' }}
      </Badge>
    </Group>

    <TextInput :root-ref="searchRef" label="Search" placeholder="Press / to focus" />
    <Textarea label="Notes" placeholder="Typing here disables the shortcut" />
  </Stack>
</template>`

const HotkeyDemo = defineComponent({
  name: 'UseActiveElementHotkeyDemo',
  setup() {
    const searchRef = ref<HTMLInputElement | null>(null)
    const activeElement = useActiveElement()

    const isEditing = computed(
      () =>
        activeElement.value?.tagName === 'INPUT' ||
        activeElement.value?.tagName === 'TEXTAREA' ||
        (activeElement.value as HTMLElement | null)?.isContentEditable === true,
    )

    useWindowEvent('keydown', (event) => {
      if (event.key === '/' && !isEditing.value) {
        event.preventDefault()
        searchRef.value?.focus()
      }
    })

    return () =>
      h(Stack, null, () => [
        h(Group, null, () => [
          h(Text, { size: 'sm' }, () => [
            'Press ',
            h(Kbd, null, () => '/'),
            ' to focus the search field',
          ]),
          h(Badge, { color: isEditing.value ? 'gray' : 'teal', variant: 'default' }, () =>
            isEditing.value ? 'Shortcut disabled' : 'Shortcut active',
          ),
        ]),
        h(TextInput, { rootRef: searchRef, label: 'Search', placeholder: 'Press / to focus' }),
        h(Textarea, { label: 'Notes', placeholder: 'Typing here disables the shortcut' }),
      ])
  },
})

export const hotkey: MantineDemo = {
  type: 'code',
  code: hotkeyCode,
  component: HotkeyDemo,
}

export const UseActiveElementDemos = { usage, hotkey }
