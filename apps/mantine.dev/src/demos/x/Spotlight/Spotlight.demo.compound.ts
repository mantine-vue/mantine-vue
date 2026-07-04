import { defineComponent, h, ref } from 'vue'
import { Button } from '@mantine-vue/core'
import { createSpotlight, Spotlight } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { Button } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'

const data = ['Home', 'About us', 'Contacts', 'Blog', 'Careers', 'Terms of service']
const query = ref('')

const items = computed(() =>
  data.filter((item) => item.toLowerCase().includes(query.value.toLowerCase().trim())),
)
</script>

<template>
  <Button @click="spotlight.open()">Open spotlight</Button>

  <Spotlight.Root :query="query" @query-change="(value) => (query = value)">
    <Spotlight.Search placeholder="Search..." :left-section="h(PhMagnifyingGlass)" />
    <Spotlight.ActionsList>
      <template v-if="items.length > 0">
        <Spotlight.Action v-for="item in items" :key="item" :label="item" />
      </template>
      <Spotlight.Empty v-else>Nothing found...</Spotlight.Empty>
    </Spotlight.ActionsList>
  </Spotlight.Root>
</template>
`

const data = ['Home', 'About us', 'Contacts', 'Blog', 'Careers', 'Terms of service']

const Demo = defineComponent({
  name: 'SpotlightCompoundDemo',
  setup() {
    const [store, spotlightInstance] = createSpotlight()
    const query = ref('')

    return () => {
      const items = data.filter((item) =>
        item.toLowerCase().includes(query.value.toLowerCase().trim()),
      )

      return [
        h(Button, { onClick: spotlightInstance.open }, () => 'Open spotlight'),
        h(
          Spotlight.Root,
          {
            store,
            query: query.value,
            onQueryChange: (value: string) => (query.value = value),
            shortcut: null,
          },
          () => [
            h(Spotlight.Search, {
              placeholder: 'Search...',
              leftSection: h(PhMagnifyingGlass),
            }),
            h(Spotlight.ActionsList, null, () =>
              items.length > 0
                ? items.map((item) => h(Spotlight.Action, { key: item, label: item }))
                : h(Spotlight.Empty, null, () => 'Nothing found...'),
            ),
          ],
        ),
      ]
    }
  },
})

export const compound: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
