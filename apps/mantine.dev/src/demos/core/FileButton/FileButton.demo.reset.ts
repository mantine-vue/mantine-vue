import { defineComponent, h, ref } from 'vue'
import { Button, FileButton, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FileButton, Button, Group, Text } from '@mantine-vue/core'

const file = ref<File | null>(null)
const resetRef = ref<(() => void) | null>(null)

const clearFile = () => {
  file.value = null
  resetRef.value?.()
}
</script>

<template>
  <Group justify="center">
    <FileButton :resetRef="resetRef" :onChange="(f) => file = f" accept="image/png,image/jpeg">
      <template #default="{ onClick }">
        <Button @click="onClick">Upload image</Button>
      </template>
    </FileButton>
    <Button :disabled="!file" color="red" @click="clearFile">Reset</Button>
  </Group>

  <Text v-if="file" size="sm" ta="center" mt="sm">
    Picked file: {{ file.name }}
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'FileButtonResetDemo',
  setup() {
    const file = ref<File | null>(null)
    const resetRef = ref<(() => void) | null>(null)

    const clearFile = () => {
      file.value = null
      resetRef.value?.()
    }

    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () => [
              h(
                FileButton,
                {
                  resetRef,
                  onChange: (f: File | null) => {
                    file.value = f
                  },
                  accept: 'image/png,image/jpeg',
                },
                {
                  default: ({ onClick }: { onClick: () => void }) =>
                    h(Button, { onClick }, { default: () => 'Upload image' }),
                },
              ),
              h(
                Button,
                {
                  disabled: !file.value,
                  color: 'red',
                  onClick: clearFile,
                },
                { default: () => 'Reset' },
              ),
            ],
          },
        ),
        file.value
          ? h(
              Text,
              { size: 'sm', ta: 'center', mt: 'sm' },
              { default: () => `Picked file: ${file.value!.name}` },
            )
          : null,
      ])
  },
})

export const reset: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
