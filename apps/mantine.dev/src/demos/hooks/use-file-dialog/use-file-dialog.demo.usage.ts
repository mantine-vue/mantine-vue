import { defineComponent, h } from 'vue'
import { Button, Group, List } from '@mantine-vue/core'
import { useFileDialog } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, List } from '@mantine-vue/core'
import { useFileDialog } from '@mantine-vue/hooks'

const fileDialog = useFileDialog()
</script>

<template>
  <div>
    <Group>
      <Button @click="fileDialog.open">Pick files</Button>
      <Button v-if="fileDialog.files.value?.length" variant="default" @click="fileDialog.reset">
        Reset
      </Button>
    </Group>
    <List v-if="fileDialog.files.value?.length" mt="lg">
      <List.Item v-for="file in Array.from(fileDialog.files.value)" :key="file.name">
        {{ file.name }}
      </List.Item>
    </List>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseFileDialogUsageDemo',
  setup() {
    const fileDialog = useFileDialog()

    return () => {
      const pickedFiles = Array.from(fileDialog.files.value || []).map((file) =>
        h(List.Item, { key: file.name }, { default: () => file.name }),
      )

      return h('div', [
        h(Group, () => [
          h(Button, { onClick: fileDialog.open }, { default: () => 'Pick files' }),
          pickedFiles.length > 0
            ? h(
                Button,
                { variant: 'default', onClick: fileDialog.reset },
                { default: () => 'Reset' },
              )
            : null,
        ]),
        pickedFiles.length > 0 ? h(List, { mt: 'lg' }, () => pickedFiles) : null,
      ])
    }
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
