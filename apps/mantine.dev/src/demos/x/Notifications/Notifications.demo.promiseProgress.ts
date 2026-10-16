import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import type { MantineDemo } from '@/demo'

function saveDocument(shouldFail: boolean) {
  return new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Network error'))
      else resolve({ name: 'report.pdf' })
    }, 2000)
  })
}

const save = (shouldFail: boolean) =>
  notifications.promise(saveDocument(shouldFail), {
    loading: { title: 'Saving document', message: 'Please wait, it will take a couple of seconds' },
    success: (value) => ({
      title: 'Document saved',
      message: `${value.name} was saved successfully`,
    }),
    error: (error) => ({ title: 'Failed to save document', message: (error as Error).message }),
  })

export const promise: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        h(Button, { onClick: () => save(false) }, () => 'Save document'),
        h(Button, { color: 'red', onClick: () => save(true) }, () => 'Save document (fails)'),
      ]),
  }),
  code: `<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'

function saveDocument(shouldFail: boolean) {
  return new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => shouldFail ? reject(new Error('Network error')) : resolve({ name: 'report.pdf' }), 2000)
  })
}

const save = (shouldFail: boolean) => notifications.promise(saveDocument(shouldFail), {
  loading: { title: 'Saving document', message: 'Please wait, it will take a couple of seconds' },
  success: (value) => ({ title: 'Document saved', message: \`\${value.name} was saved successfully\` }),
  error: (error) => ({ title: 'Failed to save document', message: (error as Error).message }),
})
</script>
<template>
  <Group justify="center">
    <Button @click="save(false)">Save document</Button>
    <Button color="red" @click="save(true)">Save document (fails)</Button>
  </Group>
</template>`,
}

export const autoCloseProgress: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        h(
          Button,
          {
            onClick: () =>
              notifications.show({
                title: 'Auto close progress',
                message: 'This notification will close in 5 seconds',
                withAutoCloseProgress: true,
                autoClose: 5000,
              }),
          },
          () => 'Show notification with progress',
        ),
        h(
          Button,
          {
            color: 'red',
            onClick: () =>
              notifications.show({
                title: 'Something went wrong',
                message: 'Progress line uses notification color',
                color: 'red',
                withAutoCloseProgress: true,
                autoClose: 8000,
              }),
          },
          () => 'Red notification with progress',
        ),
      ]),
  }),
  code: `<script setup lang="ts">
import { Button, Group } from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
</script>
<template>
  <Group justify="center">
    <Button @click="notifications.show({ title: 'Auto close progress', message: 'This notification will close in 5 seconds', withAutoCloseProgress: true, autoClose: 5000 })">
      Show notification with progress
    </Button>
    <Button color="red" @click="notifications.show({ title: 'Something went wrong', message: 'Progress line uses notification color', color: 'red', withAutoCloseProgress: true, autoClose: 8000 })">
      Red notification with progress
    </Button>
  </Group>
</template>`,
}
