import { defineComponent, h, ref } from 'vue'
import { Loader, Text, TextInput } from '@mantine-vue/core'
import { useDebouncedCallback } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Loader, Text, TextInput } from '@mantine-vue/core'
import { useDebouncedCallback } from '@mantine-vue/hooks'

function getSearchResults(query: string): Promise<{ id: number; title: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        query.trim() === ''
          ? []
          : Array(5)
              .fill(0)
              .map((_, index) => ({ id: index, title: \`\${query} \${index + 1}\` })),
      )
    }, 1000)
  })
}

const search = ref('')
const searchResults = ref<{ id: number; title: string }[]>([])
const loading = ref(false)

const handleSearch = useDebouncedCallback(async (query: string) => {
  loading.value = true
  searchResults.value = await getSearchResults(query)
  loading.value = false
}, 500)

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  search.value = value
  handleSearch(value)
}
</script>

<template>
  <TextInput
    :model-value="search"
    placeholder="Search..."
    @input="handleChange"
  >
    <template v-if="loading" #rightSection>
      <Loader :size="20" />
    </template>
  </TextInput>
  <Text v-for="result in searchResults" :key="result.id" size="sm">
    {{ result.title }}
  </Text>
</template>
`

function getSearchResults(query: string): Promise<{ id: number; title: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        query.trim() === ''
          ? []
          : Array(5)
              .fill(0)
              .map((_, index) => ({ id: index, title: `${query} ${index + 1}` })),
      )
    }, 1000)
  })
}

const Demo = defineComponent({
  name: 'UseDebouncedCallbackUsageDemo',
  setup() {
    const search = ref('')
    const searchResults = ref<{ id: number; title: string }[]>([])
    const loading = ref(false)

    const handleSearch = useDebouncedCallback(async (query: string) => {
      loading.value = true
      searchResults.value = await getSearchResults(query)
      loading.value = false
    }, 500)

    const handleChange = (event: Event) => {
      const value = (event.target as HTMLInputElement).value
      search.value = value
      handleSearch(value)
    }

    return () =>
      h('div', [
        h(
          TextInput,
          {
            value: search.value,
            placeholder: 'Search...',
            onInput: handleChange,
          },
          loading.value ? { rightSection: () => h(Loader, { size: 20 }) } : {},
        ),
        ...searchResults.value.map((result) =>
          h(Text, { key: result.id, size: 'sm' }, { default: () => result.title }),
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
