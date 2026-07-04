import { defineComponent, h } from 'vue'
import { Box, Spoiler, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Spoiler } from '@mantine-vue/core'
</script>

<template>
  <Spoiler :maxHeight="120" showLabel="Show more" hideLabel="Hide" :transitionDuration="0">
    <!-- Content here -->
  </Spoiler>
</template>
`

const imgSrc =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Rock_in_caputh-WBTBWB-47.jpg/600px-Rock_in_caputh-WBTBWB-47.jpg'

const Demo = defineComponent({
  name: 'SpoilerTransitionsDemo',
  setup() {
    return () =>
      h(
        Box,
        { maw: 520, mx: 'auto' },
        {
          default: () =>
            h(
              Spoiler,
              { maxHeight: 120, showLabel: 'Show more', hideLabel: 'Hide', transitionDuration: 0 },
              {
                default: () =>
                  h('div', {}, [
                    h(Box, {
                      component: 'img',
                      h: 150,
                      ml: 20,
                      mb: 0,
                      mt: 5,
                      maw: '100%',
                      style: { float: 'right' },
                      src: imgSrc,
                      alt: 'We Butter the Bread with Butter',
                    }),
                    h(
                      Text,
                      {},
                      {
                        default: () =>
                          'We Butter the Bread with Butter was founded in 2007 by Marcel Neumann, who was originally ' +
                          "guitarist for Martin Kesici's band, and Tobias Schultka. The band was originally meant as " +
                          'a joke, but progressed into being a more serious musical duo. The name for the band has no ' +
                          'particular meaning, although its origins were suggested from when the two original members ' +
                          'were driving in a car operated by Marcel Neumann and an accident almost occurred. Neumann ' +
                          'found Schultka "so funny that he briefly lost control of the vehicle." Many of their ' +
                          'songs from this point were covers of German folk tales and nursery rhymes.',
                      },
                    ),
                  ]),
              },
            ),
        },
      )
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
