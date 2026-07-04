import { defineComponent, h, ref } from 'vue'
import {
  PhArrowUp,
  PhArrowDown,
  PhArrowLeft,
  PhArrowRight,
  PhArrowUpLeft,
  PhArrowUpRight,
  PhArrowDownLeft,
  PhArrowDownRight,
  PhCircle,
} from '@phosphor-icons/vue'
import { FloatingIndicator, UnstyledButton } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import {
  PhArrowUp, PhArrowDown, PhArrowLeft, PhArrowRight,
  PhArrowUpLeft, PhArrowUpRight, PhArrowDownLeft, PhArrowDownRight,
  PhCircle,
} from '@phosphor-icons/vue'
import { FloatingIndicator, UnstyledButton } from '@mantine-vue/core'
import classes from './Demo.module.css'

const rootRef = ref<HTMLElement | null>(null)
const controlsRefs = ref<Record<string, HTMLElement | null>>({})
const active = ref('center')

function setControlRef(name: string) {
  return (el: any) => { controlsRefs.value[name] = el?.$el ?? el }
}
</script>

<template>
  <div :ref="(el: any) => rootRef = el?.$el ?? el" :class="classes.root" dir="ltr">
    <FloatingIndicator
      :target="controlsRefs[active]"
      :parent="rootRef"
      :class="classes.indicator"
    />

    <div :class="classes.controlsGroup">
      <UnstyledButton :class="classes.control" :ref="setControlRef('up-left')" :mod="{ active: active === 'up-left' }" @click="active = 'up-left'">
        <PhArrowUpLeft :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('up')" :mod="{ active: active === 'up' }" @click="active = 'up'">
        <PhArrowUp :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('up-right')" :mod="{ active: active === 'up-right' }" @click="active = 'up-right'">
        <PhArrowUpRight :size="26" />
      </UnstyledButton>
    </div>
    <div :class="classes.controlsGroup">
      <UnstyledButton :class="classes.control" :ref="setControlRef('left')" :mod="{ active: active === 'left' }" @click="active = 'left'">
        <PhArrowLeft :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('center')" :mod="{ active: active === 'center' }" @click="active = 'center'">
        <PhCircle :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('right')" :mod="{ active: active === 'right' }" @click="active = 'right'">
        <PhArrowRight :size="26" />
      </UnstyledButton>
    </div>
    <div :class="classes.controlsGroup">
      <UnstyledButton :class="classes.control" :ref="setControlRef('down-left')" :mod="{ active: active === 'down-left' }" @click="active = 'down-left'">
        <PhArrowDownLeft :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('down')" :mod="{ active: active === 'down' }" @click="active = 'down'">
        <PhArrowDown :size="26" />
      </UnstyledButton>
      <UnstyledButton :class="classes.control" :ref="setControlRef('down-right')" :mod="{ active: active === 'down-right' }" @click="active = 'down-right'">
        <PhArrowDownRight :size="26" />
      </UnstyledButton>
    </div>
  </div>
</template>
`

const cssCode = `.root {
  position: relative;
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8));
  width: fit-content;
  padding: var(--mantine-spacing-sm);
  border-radius: var(--mantine-radius-md);
}

.indicator {
  background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-6));
  border-radius: var(--mantine-radius-md);
  box-shadow: var(--mantine-shadow-md);
  border: 1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4));
}

.controlsGroup {
  display: flex;
}

.control {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2));
  border-radius: var(--mantine-radius-md);

  &[data-active] {
    color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
  }

  @mixin hover {
    color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
    background-color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7));
  }

  & svg {
    display: block;
    position: relative;
    z-index: 1;
  }
}`

const buttons = [
  { name: 'up-left', icon: PhArrowUpLeft },
  { name: 'up', icon: PhArrowUp },
  { name: 'up-right', icon: PhArrowUpRight },
  { name: 'left', icon: PhArrowLeft },
  { name: 'center', icon: PhCircle },
  { name: 'right', icon: PhArrowRight },
  { name: 'down-left', icon: PhArrowDownLeft },
  { name: 'down', icon: PhArrowDown },
  { name: 'down-right', icon: PhArrowDownRight },
]
const rows = [
  ['up-left', 'up', 'up-right'],
  ['left', 'center', 'right'],
  ['down-left', 'down', 'down-right'],
]

const cellStyle = {
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--mantine-radius-md)',
}

const iconMap: Record<string, any> = Object.fromEntries(buttons.map((b) => [b.name, b.icon]))

const Demo = defineComponent({
  name: 'FloatingIndicatorDirectionDemo',
  setup() {
    const rootRef = ref<HTMLElement | null>(null)
    const controlsRefs = ref<Record<string, HTMLElement | null>>({})
    const active = ref('center')

    function setControlRef(name: string) {
      return (el: any) => {
        controlsRefs.value[name] = el?.$el ?? el
      }
    }

    const rootStyle = {
      position: 'relative',
      backgroundColor: 'var(--mantine-color-default)',
      width: 'fit-content',
      padding: 'var(--mantine-spacing-sm)',
      borderRadius: 'var(--mantine-radius-md)',
    }
    const indicatorStyle = {
      backgroundColor: 'var(--mantine-color-body)',
      borderRadius: 'var(--mantine-radius-md)',
      boxShadow: 'var(--mantine-shadow-md)',
      border: '1px solid var(--mantine-color-default-border)',
    }
    const rowStyle = { display: 'flex' }

    return () =>
      h(
        'div',
        {
          ref: (el: any) => {
            rootRef.value = el?.$el ?? el
          },
          style: rootStyle,
          dir: 'ltr',
        },
        [
          h(FloatingIndicator, {
            target: controlsRefs.value[active.value],
            parent: rootRef.value,
            style: indicatorStyle,
          }),
          ...rows.map((row) =>
            h(
              'div',
              { style: rowStyle },
              row.map((name) =>
                h(
                  UnstyledButton,
                  {
                    ref: setControlRef(name),
                    mod: { active: active.value === name },
                    style: cellStyle,
                    onClick: () => {
                      active.value = name
                    },
                  },
                  () =>
                    h(iconMap[name], {
                      size: 26,
                      style: { display: 'block', position: 'relative', zIndex: 1 },
                    }),
                ),
              ),
            ),
          ),
        ],
      )
  },
})

export const direction: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
