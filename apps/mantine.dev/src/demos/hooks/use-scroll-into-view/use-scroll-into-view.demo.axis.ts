import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { useScrollIntoView } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useScrollIntoView } from '@mantine-vue/hooks'
import { Button, Group } from '@mantine-vue/core'

const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
  HTMLDivElement,
  HTMLDivElement
>({ axis: 'x' })
</script>

<template>
  <Group justify="center">
    <!-- Bind the hook's refs to plain native elements, not Mantine
         Vue components -- components don't forward refs to their root DOM node. -->
    <div ref="scrollableRef" style="height: 150px; width: 300px; overflow-x: scroll; border: 1px solid var(--mantine-color-default-border); border-radius: var(--mantine-radius-sm)">
      <div style="padding-left: 260px; padding-right: 450px">
        <div
          ref="targetRef"
          style="padding: var(--mantine-spacing-md); background-color: var(--mantine-color-blue-light); width: max-content"
        >
          <p style="margin: 0">Scroll me into view</p>
        </div>
      </div>
    </div>
    <Button @click="scrollIntoView()">Scroll to target</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseScrollIntoViewAxisDemo',
  setup() {
    const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
      HTMLDivElement,
      HTMLDivElement
    >({ axis: 'x' })

    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(
              'div',
              {
                ref: scrollableRef,
                style: {
                  height: '150px',
                  width: '300px',
                  overflowX: 'scroll',
                  border: '1px solid var(--mantine-color-default-border)',
                  borderRadius: 'var(--mantine-radius-sm)',
                },
              },
              [
                h('div', { style: { paddingLeft: '260px', paddingRight: '450px' } }, [
                  h(
                    'div',
                    {
                      ref: targetRef,
                      style: {
                        padding: 'var(--mantine-spacing-md)',
                        backgroundColor: 'var(--mantine-color-blue-light)',
                        width: 'max-content',
                      },
                    },
                    [h('p', { style: { margin: 0 } }, 'Scroll me into view')],
                  ),
                ]),
              ],
            ),
            h(Button, { onClick: () => scrollIntoView() }, { default: () => 'Scroll to target' }),
          ],
        },
      )
  },
})

export const axis: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
