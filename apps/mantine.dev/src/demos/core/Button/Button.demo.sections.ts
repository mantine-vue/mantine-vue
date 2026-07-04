import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { PhImage, PhDownloadSimple } from '@phosphor-icons/vue'

const code = `
<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { PhImage, PhDownloadSimple } from '@phosphor-icons/vue'
</script>

<template>
  <Group justify="center">
    <Button>
      <template #leftSection>
        <PhImage :size="14" />
      </template>
      Gallery
    </Button>

    <Button>
      <template #rightSection>
        <PhDownloadSimple :size="14" />
      </template>
      Download
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ButtonSectionsDemo',
  setup: () => () =>
    h(
      Group,
      { justify: 'center' },
      {
        default: () => [
          h(Button, { leftSection: () => h(PhImage) }, { default: () => 'Gallery' }),
          h(Button, { rightSection: () => h(PhDownloadSimple) }, { default: () => 'Download' }),
        ],
      },
    ),
})

export const sections: MantineDemo = { type: 'code', component: Demo, code }
