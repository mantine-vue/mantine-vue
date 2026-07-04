import { defineComponent, h } from 'vue'
import { Accordion } from '@mantine-vue/core'
import { PhCamera, PhImage, PhPrinter } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Accordion } from '@mantine-vue/core'
import { PhImage, PhPrinter, PhCamera } from '@phosphor-icons/vue'
</script>

<template>
  <Accordion variant="filled" defaultValue="photos" :order="3">
    <Accordion.Item value="photos">
      <Accordion.Control :icon="h(PhImage, { size: 22, color: 'var(--mantine-color-dimmed)' })">
        Recent photos
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="print">
      <Accordion.Control :icon="h(PhPrinter, { size: 22, color: 'var(--mantine-color-dimmed)' })">
        Print photos
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="camera">
      <Accordion.Control :icon="h(PhCamera, { size: 22, color: 'var(--mantine-color-dimmed)' })">
        Camera settings
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
</template>
`

const Demo = defineComponent({
  name: 'AccordionIconsDemo',
  setup() {
    return () =>
      h(
        Accordion,
        { variant: 'filled', defaultValue: 'photos', order: 3, mih: 200 },
        {
          default: () => [
            h(
              Accordion.Item,
              { value: 'photos' },
              {
                default: () => [
                  h(
                    Accordion.Control,
                    { icon: h(PhImage, { size: 22, color: 'var(--mantine-color-dimmed)' }) },
                    { default: () => 'Recent photos' },
                  ),
                  h(Accordion.Panel, {}, { default: () => 'Content' }),
                ],
              },
            ),
            h(
              Accordion.Item,
              { value: 'print' },
              {
                default: () => [
                  h(
                    Accordion.Control,
                    { icon: h(PhPrinter, { size: 22, color: 'var(--mantine-color-dimmed)' }) },
                    { default: () => 'Print photos' },
                  ),
                  h(Accordion.Panel, {}, { default: () => 'Content' }),
                ],
              },
            ),
            h(
              Accordion.Item,
              { value: 'camera' },
              {
                default: () => [
                  h(
                    Accordion.Control,
                    { icon: h(PhCamera, { size: 22, color: 'var(--mantine-color-dimmed)' }) },
                    { default: () => 'Camera settings' },
                  ),
                  h(Accordion.Panel, {}, { default: () => 'Content' }),
                ],
              },
            ),
          ],
        },
      )
  },
})

export const icons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 400,
  centered: true,
  defaultExpanded: false,
}
