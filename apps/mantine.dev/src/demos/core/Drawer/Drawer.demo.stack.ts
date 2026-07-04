import { defineComponent, h } from 'vue'
import { Button, Drawer, Group, useDrawersStack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Drawer, useDrawersStack } from '@mantine-vue/core'

const stack = useDrawersStack(['delete-page', 'confirm-action', 'really-confirm-action'])
</script>

<template>
  <Drawer.Stack>
    <Drawer v-bind="stack.register('delete-page')" title="Delete this page?">
      Are you sure you want to delete this page? This action cannot be undone.
      <Group mt="lg" justify="flex-end">
        <Button variant="default" @click="stack.closeAll">Cancel</Button>
        <Button color="red" @click="() => stack.open('confirm-action')">Delete</Button>
      </Group>
    </Drawer>

    <Drawer v-bind="stack.register('confirm-action')" title="Confirm action">
      Are you sure you want to perform this action? This action cannot be undone.
      If you are sure, press confirm button below.
      <Group mt="lg" justify="flex-end">
        <Button variant="default" @click="stack.closeAll">Cancel</Button>
        <Button color="red" @click="() => stack.open('really-confirm-action')">Confirm</Button>
      </Group>
    </Drawer>

    <Drawer v-bind="stack.register('really-confirm-action')" title="Really confirm action">
      Jokes aside. You have confirmed this action. This is your last chance to cancel it. After
      you press confirm button below, action will be performed and cannot be undone. For real
      this time. Are you sure you want to proceed?
      <Group mt="lg" justify="flex-end">
        <Button variant="default" @click="stack.closeAll">Cancel</Button>
        <Button color="red" @click="stack.closeAll">Confirm</Button>
      </Group>
    </Drawer>
  </Drawer.Stack>

  <Button variant="default" @click="() => stack.open('delete-page')">Open drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerStackDemo',
  setup() {
    const stack = useDrawersStack(['delete-page', 'confirm-action', 'really-confirm-action'])

    return () =>
      h('div', null, [
        h(Drawer.Stack, null, {
          default: () => [
            h(
              Drawer,
              {
                ...stack.register('delete-page'),
                title: 'Delete this page?',
              },
              {
                default: () => [
                  'Are you sure you want to delete this page? This action cannot be undone.',
                  h(
                    Group,
                    { mt: 'lg', justify: 'flex-end' },
                    {
                      default: () => [
                        h(
                          Button,
                          { variant: 'default', onClick: () => stack.closeAll() },
                          () => 'Cancel',
                        ),
                        h(
                          Button,
                          { color: 'red', onClick: () => stack.open('confirm-action') },
                          () => 'Delete',
                        ),
                      ],
                    },
                  ),
                ],
              },
            ),
            h(
              Drawer,
              {
                ...stack.register('confirm-action'),
                title: 'Confirm action',
              },
              {
                default: () => [
                  'Are you sure you want to perform this action? This action cannot be undone. If you are sure, press confirm button below.',
                  h(
                    Group,
                    { mt: 'lg', justify: 'flex-end' },
                    {
                      default: () => [
                        h(
                          Button,
                          { variant: 'default', onClick: () => stack.closeAll() },
                          () => 'Cancel',
                        ),
                        h(
                          Button,
                          { color: 'red', onClick: () => stack.open('really-confirm-action') },
                          () => 'Confirm',
                        ),
                      ],
                    },
                  ),
                ],
              },
            ),
            h(
              Drawer,
              {
                ...stack.register('really-confirm-action'),
                title: 'Really confirm action',
              },
              {
                default: () => [
                  'Jokes aside. You have confirmed this action. This is your last chance to cancel it. After you press confirm button below, action will be performed and cannot be undone. For real this time. Are you sure you want to proceed?',
                  h(
                    Group,
                    { mt: 'lg', justify: 'flex-end' },
                    {
                      default: () => [
                        h(
                          Button,
                          { variant: 'default', onClick: () => stack.closeAll() },
                          () => 'Cancel',
                        ),
                        h(
                          Button,
                          { color: 'red', onClick: () => stack.closeAll() },
                          () => 'Confirm',
                        ),
                      ],
                    },
                  ),
                ],
              },
            ),
          ],
        }),
        h(
          Button,
          { variant: 'default', onClick: () => stack.open('delete-page') },
          () => 'Open drawer',
        ),
      ])
  },
})

export const stack: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
