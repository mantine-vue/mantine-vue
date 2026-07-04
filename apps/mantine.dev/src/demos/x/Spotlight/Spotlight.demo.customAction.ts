import { defineComponent, h, ref } from 'vue'
import { Badge, Button, Center, Group, Text } from '@mantine-vue/core'
import { createSpotlight, Spotlight } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { Badge, Button, Center, Group, Text } from '@mantine-vue/core'
import { Spotlight, spotlight } from '@mantine-vue/spotlight'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'

const data = [
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    title: 'Bender Bending Rodríguez',
    description: 'Fascinated with cooking, though has no sense of taste',
    new: true,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    title: 'Carol Miller',
    description: 'One of the richest people on Earth',
    new: false,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    title: 'Homer Simpson',
    description: 'Overweight, lazy, and often ignorant',
    new: false,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png',
    title: 'Spongebob Squarepants',
    description: 'Not just a sponge',
    new: false,
  },
]

const query = ref('')
const items = computed(() =>
  data.filter((item) => item.title.toLowerCase().includes(query.value.toLowerCase().trim())),
)
</script>

<template>
  <Button @click="spotlight.open()">Open spotlight</Button>

  <Spotlight.Root :query="query" @query-change="(value) => (query = value)">
    <Spotlight.Search placeholder="Search..." :left-section="h(PhMagnifyingGlass)" />
    <Spotlight.ActionsList>
      <template v-if="items.length > 0">
        <Spotlight.Action
          v-for="item in items"
          :key="item.title"
          @click="() => console.log(item)"
        >
          <Group wrap="nowrap" w="100%">
            <Center v-if="item.image">
              <img :src="item.image" :alt="item.title" width="50" height="50" />
            </Center>

            <div style="flex: 1">
              <Text>{{ item.title }}</Text>
              <Text v-if="item.description" :opacity="0.6" size="xs">
                {{ item.description }}
              </Text>
            </div>

            <Badge v-if="item.new" variant="default">new</Badge>
          </Group>
        </Spotlight.Action>
      </template>
      <Spotlight.Empty v-else>Nothing found...</Spotlight.Empty>
    </Spotlight.ActionsList>
  </Spotlight.Root>
</template>
`

const data = [
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    title: 'Bender Bending Rodríguez',
    description: 'Fascinated with cooking, though has no sense of taste',
    new: true,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    title: 'Carol Miller',
    description: 'One of the richest people on Earth',
    new: false,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    title: 'Homer Simpson',
    description: 'Overweight, lazy, and often ignorant',
    new: false,
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png',
    title: 'Spongebob Squarepants',
    description: 'Not just a sponge',
    new: false,
  },
]

const Demo = defineComponent({
  name: 'SpotlightCustomActionDemo',
  setup() {
    const [store, spotlightInstance] = createSpotlight()
    const query = ref('')

    return () => {
      const items = data.filter((item) =>
        item.title.toLowerCase().includes(query.value.toLowerCase().trim()),
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
                ? items.map((item) =>
                    h(Spotlight.Action, { key: item.title, onClick: () => console.log(item) }, () =>
                      h(Group, { wrap: 'nowrap', w: '100%' }, () => [
                        item.image
                          ? h(Center, null, () =>
                              h('img', {
                                src: item.image,
                                alt: item.title,
                                width: 50,
                                height: 50,
                              }),
                            )
                          : null,
                        h('div', { style: { flex: 1 } }, [
                          h(Text, null, () => item.title),
                          item.description
                            ? h(Text, { opacity: 0.6, size: 'xs' }, () => item.description)
                            : null,
                        ]),
                        item.new ? h(Badge, { variant: 'default' }, () => 'new') : null,
                      ]),
                    ),
                  )
                : h(Spotlight.Empty, null, () => 'Nothing found...'),
            ),
          ],
        ),
      ]
    }
  },
})

export const customAction: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
