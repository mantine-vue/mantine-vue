import { defineComponent, h, ref } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'checkbox-customize-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .checkbox-customize-demo-root {
        border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
        padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
        border-radius: var(--mantine-radius-md);
        font-weight: 600;
        transition: color 100ms ease, background-color 100ms ease, border-color 100ms ease;
        cursor: pointer;
      }
      .checkbox-customize-demo-root[data-checked] {
        background-color: var(--mantine-color-blue-filled);
        border-color: var(--mantine-color-blue-filled);
        color: var(--mantine-color-white);
      }
      .checkbox-customize-demo-root * {
        pointer-events: none;
        user-select: none;
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.root {
  border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4));
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
  border-radius: var(--mantine-radius-md);
  font-weight: 600;
  transition:
    color 100ms ease,
    background-color 100ms ease,
    border-color 100ms ease;
  cursor: pointer;

  &[data-checked] {
    background-color: var(--mantine-color-blue-filled);
    border-color: var(--mantine-color-blue-filled);
    color: var(--mantine-color-white);
  }

  & * {
    pointer-events: none;
    user-select: none;
  }
}`

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import classes from './Demo.module.css'

const checked = ref(false)
</script>

<template>
  <Checkbox
    :classNames="{ root: classes.root }"
    label="Checkbox button"
    :checked="checked"
    @change="(e) => (checked = e.target.checked)"
    :wrapperProps="{ onClick: () => (checked = !checked) }"
  />
</template>
`

const Demo = defineComponent({
  name: 'CheckboxCustomizeDemo',
  setup() {
    ensureStyles()
    const checked = ref(false)

    return () =>
      h(Checkbox, {
        classNames: { root: 'checkbox-customize-demo-root' },
        label: 'Checkbox button',
        checked: checked.value,
        onChange: (e: Event) => {
          checked.value = (e.target as HTMLInputElement).checked
        },
        wrapperProps: {
          onClick: () => {
            checked.value = !checked.value
          },
        },
      })
  },
})

export const customize: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
