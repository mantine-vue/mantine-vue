import { defineComponent, h } from 'vue'
import { BackgroundImage, Box, Center, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { BackgroundImage, Box, Center, Text } from '@mantine-vue/core'
</script>

<template>
  <Box :maw="300" mx="auto">
    <BackgroundImage
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
      {{props}}
    >
      <Center p="md">
        <Text c="white">
          BackgroundImage component can be used to add any content on image. It is useful for hero
          headers and other similar sections
        </Text>
      </Center>
    </BackgroundImage>
  </Box>
</template>
`

const Wrapper = defineComponent({
  name: 'BackgroundImageUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Box,
        { maw: 300, mx: 'auto' },
        {
          default: () =>
            h(
              BackgroundImage,
              {
                src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png',
                ...(attrs as any),
              },
              {
                default: () =>
                  h(
                    Center,
                    { p: 'md' },
                    {
                      default: () =>
                        h(
                          Text,
                          { c: 'white' },
                          {
                            default: () =>
                              'BackgroundImage component can be used to add any content on image. It is useful for hero headers and other similar sections',
                          },
                        ),
                    },
                  ),
              },
            ),
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ prop: 'radius', type: 'size', initialValue: 'md', libraryValue: null }],
}
