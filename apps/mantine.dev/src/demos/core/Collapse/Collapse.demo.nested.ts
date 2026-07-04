import { defineComponent, h, ref } from 'vue'
import { Box, Button, Collapse, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Box, Button, Collapse, Text } from '@mantine-vue/core'
</script>

<template>
  <!-- Nested Collapse example -->
  <NestedCollapse label="Root collapse">
    <Text mt="md" size="lg" fw="700">This collapse contains another collapse</Text>
    <Text mt="xs">{{ lorem }}</Text>
    <NestedCollapse label="Inner collapse" variant="outline">
      <Text mt="md" size="lg" fw="700">This collapse is inside another collapse</Text>
      <Text mt="xs">{{ lorem }}</Text>
    </NestedCollapse>
  </NestedCollapse>
</template>
`

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea atque in est quaerat dolore odio! Quibusdam, a nihil modi, maiores consequuntur ex quod suscipit illum ducimus doloribus odit commodi tenetur.'

const NestedCollapse = defineComponent({
  name: 'NestedCollapse',
  props: {
    label: { type: String, required: true },
    variant: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const opened = ref(false)
    return () =>
      h(Box, { maw: 400, mx: 'auto', mt: 'md' }, () => [
        h(
          Button,
          {
            mb: 5,
            variant: props.variant,
            onClick: () => {
              opened.value = !opened.value
            },
          },
          () => props.label,
        ),
        h(Collapse, { expanded: opened.value }, () => slots.default?.()),
      ])
  },
})

const Demo = defineComponent({
  name: 'CollapseNestedDemo',
  setup() {
    return () =>
      h(NestedCollapse, { label: 'Root collapse' }, () => [
        h(Text, { mt: 'md', size: 'lg', fw: 700 }, () => 'This collapse contains another collapse'),
        h(Text, { mt: 'xs' }, () => lorem),
        h(NestedCollapse, { label: 'Inner collapse', variant: 'outline' }, () => [
          h(
            Text,
            { mt: 'md', size: 'lg', fw: 700 },
            () => 'This collapse is inside another collapse',
          ),
          h(Text, { mt: 'xs' }, () => lorem),
        ]),
      ])
  },
})

export const nested: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
