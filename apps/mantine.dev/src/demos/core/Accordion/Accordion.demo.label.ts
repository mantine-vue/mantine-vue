import { defineComponent, h } from 'vue'
import { Accordion, Avatar, Flex, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const charactersList = [
  {
    id: 'bender',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    label: 'Bender Bending Rodríguez',
    description: 'Fascinated with cooking, though has no sense of taste',
    content:
      "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
  },
  {
    id: 'carol',
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Carol Miller',
    description: 'One of the richest people on Earth',
    content:
      "Carol Miller (born January 30, 2880), better known as Mom, is the evil chief executive officer and shareholder of 99.7% of Momcorp, one of the largest industrial conglomerates in the universe and the source of most of Earth's robots. She is also one of the main antagonists of the Futurama series.",
  },
  {
    id: 'homer',
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    label: 'Homer Simpson',
    description: 'Overweight, lazy, and often ignorant',
    content:
      'Homer Jay Simpson (born May 12) is the main protagonist and one of the five main characters of The Simpsons series(or show). He is the spouse of Marge Simpson and father of Bart, Lisa and Maggie Simpson.',
  },
]

const code = `
<script setup lang="ts">
import { Flex, Avatar, Text, Accordion } from '@mantine-vue/core'

const charactersList = [/* ... */]
</script>

<template>
  <Accordion chevronPosition="right" variant="contained" :order="3">
    <Accordion.Item v-for="item in charactersList" :key="item.id" :value="item.id">
      <Accordion.Control :aria-label="item.label">
        <Flex component="span" gap="md" align="center" wrap="nowrap">
          <Avatar :src="item.image" radius="xl" size="lg" :alt="item.label" />
          <div>
            <Text span>{{ item.label }}</Text>
            <Text span display="block" size="sm" c="dimmed" :fw="400">{{ item.description }}</Text>
          </div>
        </Flex>
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{{ item.content }}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

const Demo = defineComponent({
  name: 'AccordionLabelDemo',
  setup() {
    return () => {
      const items = charactersList.map((item) =>
        h(
          Accordion.Item,
          { key: item.id, value: item.id },
          {
            default: () => [
              h(
                Accordion.Control,
                { 'aria-label': item.label },
                {
                  default: () =>
                    h(
                      Flex,
                      { component: 'span', gap: 'md', align: 'center', wrap: 'nowrap' },
                      {
                        default: () => [
                          h(Avatar, { src: item.image, radius: 'xl', size: 'lg', alt: item.label }),
                          h('div', {}, [
                            h(Text, { span: true }, { default: () => item.label }),
                            h(
                              Text,
                              { span: true, display: 'block', size: 'sm', c: 'dimmed', fw: 400 },
                              { default: () => item.description },
                            ),
                          ]),
                        ],
                      },
                    ),
                },
              ),
              h(
                Accordion.Panel,
                {},
                {
                  default: () => h(Text, { size: 'sm' }, { default: () => item.content }),
                },
              ),
            ],
          },
        ),
      )
      return h(
        Accordion,
        { chevronPosition: 'right', variant: 'contained', order: 3 },
        {
          default: () => items,
        },
      )
    }
  },
})

export const label: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 540,
  centered: true,
  defaultExpanded: false,
}
