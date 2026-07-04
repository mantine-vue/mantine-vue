import { defineComponent, h, ref } from 'vue'
import { FloatingIndicator, UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { FloatingIndicator, UnstyledButton } from '@mantine-vue/core'
import classes from './Demo.module.css'

const data = ['React', 'Vue', 'Angular', 'Svelte']
const rootRef = ref<HTMLDivElement | null>(null)
const controlsRefs = ref<Record<number, HTMLElement | null>>({})
const active = ref(0)

function setControlRef(index: number) {
  return (el: any) => { controlsRefs.value[index] = el?.$el ?? el }
}
</script>

<template>
  <div :ref="(el: any) => rootRef = el?.$el ?? el" :class="classes.root">
    <UnstyledButton
      v-for="(item, index) in data"
      :key="item"
      :class="classes.control"
      :ref="setControlRef(index)"
      :mod="{ active: active === index }"
      @click="active = index"
    >
      <span :class="classes.controlLabel">{{ item }}</span>
    </UnstyledButton>

    <FloatingIndicator
      :target="controlsRefs[active]"
      :parent="rootRef"
      :class="classes.indicator"
    />
  </div>
</template>
`

const cssCode = `.root {
  position: relative;
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8));
  width: fit-content;
  border-radius: var(--mantine-radius-md);
  padding: 5px;
  border: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4));
}

.control {
  padding: 7px 12px;
  line-height: 1;
  color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-2));
  border-radius: var(--mantine-radius-md);
  font-size: var(--mantine-font-size-sm);
  transition: color 100ms ease;
  font-weight: 600;

  @mixin hover {
    color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
    background-color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7));
  }

  &[data-active] {
    color: var(--mantine-color-white);
  }
}

.controlLabel {
  position: relative;
  z-index: 1;
}

.indicator {
  background-color: var(--mantine-primary-color-filled);
  border-radius: var(--mantine-radius-md);
}`

const cssStyles: Record<string, any> = {
  root: {
    position: 'relative',
    backgroundColor: 'var(--mantine-color-default)',
    width: 'fit-content',
    borderRadius: 'var(--mantine-radius-md)',
    padding: '5px',
    border: '1px solid var(--mantine-color-default-border)',
    display: 'flex',
  },
  control: {
    padding: '7px 12px',
    lineHeight: '1',
    borderRadius: 'var(--mantine-radius-md)',
    fontSize: 'var(--mantine-font-size-sm)',
    transition: 'color 100ms ease',
    fontWeight: '600',
    color: 'var(--mantine-color-dimmed)',
  },
  controlLabel: { position: 'relative', zIndex: 1 },
  indicator: {
    backgroundColor: 'var(--mantine-primary-color-filled)',
    borderRadius: 'var(--mantine-radius-md)',
  },
}

const data = ['React', 'Vue', 'Angular', 'Svelte']

const Demo = defineComponent({
  name: 'FloatingIndicatorSegmentedDemo',
  setup() {
    const rootRef = ref<HTMLElement | null>(null)
    const controlsRefs = ref<Record<number, HTMLElement | null>>({})
    const active = ref(0)

    function setControlRef(index: number) {
      return (el: any) => {
        controlsRefs.value[index] = el?.$el ?? el
      }
    }

    return () =>
      h(
        'div',
        {
          ref: (el: any) => {
            rootRef.value = el?.$el ?? el
          },
          style: cssStyles.root,
        },
        [
          ...data.map((item, index) =>
            h(
              UnstyledButton,
              {
                key: item,
                ref: setControlRef(index),
                mod: { active: active.value === index },
                style: {
                  ...cssStyles.control,
                  color:
                    active.value === index
                      ? 'var(--mantine-color-white)'
                      : 'var(--mantine-color-dimmed)',
                },
                onClick: () => {
                  active.value = index
                },
              },
              () => h('span', { style: cssStyles.controlLabel }, item),
            ),
          ),
          h(FloatingIndicator, {
            target: controlsRefs.value[active.value],
            parent: rootRef.value,
            style: cssStyles.indicator,
          }),
        ],
      )
  },
})

export const segmented: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
