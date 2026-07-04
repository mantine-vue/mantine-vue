import { defineComponent, h, ref } from 'vue'
import { Box, Button, FocusTrap, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FocusTrap, TextInput, Button, Box } from '@mantine-vue/core'

const active = ref(false)
</script>

<template>
  <Box :maw="400" mx="auto">
    <Button @click="active = !active">
      {{ active ? 'Deactivate' : 'Activate' }} focus trap
    </Button>

    <FocusTrap :active="active">
      <div>
        <TextInput mt="sm" label="First input" placeholder="First input" />
        <TextInput mt="sm" label="Second input" placeholder="Second input" data-autofocus />
        <TextInput mt="sm" label="Third input" placeholder="Third input" />
      </div>
    </FocusTrap>
  </Box>
</template>
`

const Demo = defineComponent({
  name: 'FocusTrapInitialDemo',
  setup() {
    const active = ref(false)
    return () =>
      h(
        Box,
        { maw: 400, mx: 'auto' },
        {
          default: () => [
            h(
              Button,
              {
                onClick: () => {
                  active.value = !active.value
                },
              },
              {
                default: () => (active.value ? 'Deactivate' : 'Activate') + ' focus trap',
              },
            ),
            h(
              FocusTrap,
              { active: active.value },
              {
                default: () =>
                  h('div', null, [
                    h(TextInput, { mt: 'sm', label: 'First input', placeholder: 'First input' }),
                    h(TextInput, {
                      mt: 'sm',
                      label: 'Second input',
                      placeholder: 'Second input',
                      'data-autofocus': true,
                    }),
                    h(TextInput, { mt: 'sm', label: 'Third input', placeholder: 'Third input' }),
                  ]),
              },
            ),
          ],
        },
      )
  },
})

export const initial: MantineDemo = { type: 'code', component: Demo, code }
