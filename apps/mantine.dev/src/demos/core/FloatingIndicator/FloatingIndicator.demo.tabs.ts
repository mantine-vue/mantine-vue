import { defineComponent, h, ref } from 'vue'
import { FloatingIndicator, Tabs } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FloatingIndicator, Tabs } from '@mantine-vue/core'
import classes from './Demo.module.css'

const rootRef = ref<HTMLElement | null>(null)
const value = ref<string | null>('1')
const controlsRefs = ref<Record<string, HTMLElement | null>>({})

function setControlRef(val: string) {
  return (el: any) => { controlsRefs.value[val] = el?.$el ?? el }
}
</script>

<template>
  <Tabs unstyled :value="value" @change="(v) => value = v">
    <Tabs.List :ref="(el: any) => rootRef = el?.$el ?? el" :class="classes.list">
      <Tabs.Tab value="1" :ref="setControlRef('1')" :class="classes.tab">First tab</Tabs.Tab>
      <Tabs.Tab value="2" :ref="setControlRef('2')" :class="classes.tab">Second tab</Tabs.Tab>
      <Tabs.Tab value="3" :ref="setControlRef('3')" :class="classes.tab">Third tab</Tabs.Tab>

      <FloatingIndicator
        :target="value ? controlsRefs[value] : null"
        :parent="rootRef"
        :class="classes.indicator"
      />
    </Tabs.List>

    <Tabs.Panel value="1">First tab content</Tabs.Panel>
    <Tabs.Panel value="2">Second tab content</Tabs.Panel>
    <Tabs.Panel value="3">Third tab content</Tabs.Panel>
  </Tabs>
</template>
`

const cssCode = `.list {
  position: relative;
  margin-bottom: var(--mantine-spacing-md);
}

.indicator {
  background-color: var(--mantine-color-white);
  border-radius: var(--mantine-radius-md);
  border: 1px solid var(--mantine-color-gray-2);
  box-shadow: var(--mantine-shadow-sm);

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
    border-color: var(--mantine-color-dark-4);
  }
}

.tab {
  z-index: 1;
  font-weight: 600;
  transition: color 100ms ease;
  color: var(--mantine-color-gray-7);

  &[data-active] {
    color: var(--mantine-color-black);
  }

  @mixin dark {
    color: var(--mantine-color-dark-1);

    &[data-active] {
      color: var(--mantine-color-white);
    }
  }
}`

const Demo = defineComponent({
  name: 'FloatingIndicatorTabsDemo',
  setup() {
    const rootRef = ref<HTMLElement | null>(null)
    const value = ref<string | null>('1')
    const controlsRefs = ref<Record<string, HTMLElement | null>>({})

    function setControlRef(val: string) {
      return (el: any) => {
        controlsRefs.value[val] = el?.$el ?? el
      }
    }

    const listStyle = { position: 'relative', marginBottom: 'var(--mantine-spacing-md)' }
    const indicatorStyle = {
      backgroundColor: 'var(--mantine-color-body)',
      borderRadius: 'var(--mantine-radius-md)',
      border: '1px solid var(--mantine-color-default-border)',
      boxShadow: 'var(--mantine-shadow-sm)',
    }
    const tabStyle = { zIndex: 1, fontWeight: '600', transition: 'color 100ms ease' }

    return () =>
      h(
        Tabs,
        {
          unstyled: true,
          value: value.value,
          onChange: (v: string | null) => {
            value.value = v
          },
        },
        {
          default: () => [
            h(
              Tabs.List,
              {
                ref: (el: any) => {
                  rootRef.value = el?.$el ?? el
                },
                style: listStyle,
              },
              {
                default: () => [
                  h(
                    Tabs.Tab,
                    { value: '1', ref: setControlRef('1'), style: tabStyle },
                    () => 'First tab',
                  ),
                  h(
                    Tabs.Tab,
                    { value: '2', ref: setControlRef('2'), style: tabStyle },
                    () => 'Second tab',
                  ),
                  h(
                    Tabs.Tab,
                    { value: '3', ref: setControlRef('3'), style: tabStyle },
                    () => 'Third tab',
                  ),
                  h(FloatingIndicator, {
                    target: value.value ? controlsRefs.value[value.value] : null,
                    parent: rootRef.value,
                    style: indicatorStyle,
                  }),
                ],
              },
            ),
            h(Tabs.Panel, { value: '1' }, () => 'First tab content'),
            h(Tabs.Panel, { value: '2' }, () => 'Second tab content'),
            h(Tabs.Panel, { value: '3' }, () => 'Third tab content'),
          ],
        },
      )
  },
})

export const tabs: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
