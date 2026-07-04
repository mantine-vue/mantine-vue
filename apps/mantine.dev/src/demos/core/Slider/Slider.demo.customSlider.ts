import { defineComponent, h, ref } from 'vue'
import { PhDotsSixVertical } from '@phosphor-icons/vue'
import { useMove } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'slider-custom-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .slider-custom-demo-root { padding-top: 20px; }
      .slider-custom-demo-track {
        --thumb-width: 20px;
        --thumb-offset: 10px;
        position: relative;
        height: 60px;
        display: flex;
      }
      .slider-custom-demo-filled {
        height: 100%;
        margin-right: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
        border-radius: var(--mantine-radius-md);
        background-color: var(--mantine-color-blue-filled);
        display: flex;
        align-items: center;
        padding-inline: 10px;
      }
      .slider-custom-demo-empty {
        height: 100%;
        margin-left: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
        border-radius: var(--mantine-radius-md);
        background-color: var(--mantine-color-gray-1);
        display: flex;
        align-items: center;
        padding-inline: 10px;
        justify-content: flex-end;
      }
      [data-mantine-color-scheme='dark'] .slider-custom-demo-empty {
        background-color: var(--mantine-color-dark-6);
      }
      .slider-custom-demo-thumb {
        position: absolute;
        background-color: var(--mantine-color-white);
        border: 1px solid var(--mantine-color-gray-2);
        border-radius: var(--mantine-radius-md);
        height: 100%;
        width: var(--thumb-width);
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--mantine-color-gray-5);
      }
      [data-mantine-color-scheme='dark'] .slider-custom-demo-thumb {
        background-color: var(--mantine-color-dark-6);
        border-color: var(--mantine-color-dark-4);
        color: var(--mantine-color-dark-0);
      }
      .slider-custom-demo-label {
        font-size: var(--mantine-font-size-xl);
        font-weight: 700;
        transition: transform 100ms ease, color 100ms ease;
      }
      .slider-custom-demo-label[data-filled] { color: var(--mantine-color-white); }
      .slider-custom-demo-label[data-floating] {
        transform: translateY(-44px) translateX(-10px);
        color: var(--mantine-color-black);
      }
      .slider-custom-demo-label[data-floating]:not([data-filled]) {
        transform: translateY(-44px) translateX(10px);
      }
      [data-mantine-color-scheme='dark'] .slider-custom-demo-label[data-floating] {
        color: var(--mantine-color-white);
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `
.root { padding-top: 20px; }

.track {
  --thumb-width: 20px;
  --thumb-offset: 10px;
  position: relative;
  height: 60px;
  display: flex;
}

.filled {
  height: 100%;
  margin-right: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
  border-radius: var(--mantine-radius-md);
  background-color: var(--mantine-color-blue-filled);
  display: flex;
  align-items: center;
  padding-inline: 10px;
}

.empty {
  height: 100%;
  margin-left: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
  border-radius: var(--mantine-radius-md);
  background-color: var(--mantine-color-gray-1);
  display: flex;
  align-items: center;
  padding-inline: 10px;
  justify-content: flex-end;

  @mixin dark { background-color: var(--mantine-color-dark-6); }
}

.thumb {
  position: absolute;
  background-color: var(--mantine-color-white);
  border: 1px solid var(--mantine-color-gray-2);
  border-radius: var(--mantine-radius-md);
  height: 100%;
  width: var(--thumb-width);
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mantine-color-gray-5);

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
    border-color: var(--mantine-color-dark-4);
    color: var(--mantine-color-dark-0);
  }
}

.label {
  font-size: var(--mantine-font-size-xl);
  font-weight: 700;
  transition: transform 100ms ease, color 100ms ease;

  &[data-filled] { color: var(--mantine-color-white); }

  &[data-floating] {
    transform: translateY(-44px) translateX(-10px);
    color: var(--mantine-color-black);

    &:not([data-filled]) { transform: translateY(-44px) translateX(10px); }

    @mixin dark { color: var(--mantine-color-white); }
  }
}`

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhDotsSixVertical } from '@phosphor-icons/vue'
import { useMove } from '@mantine-vue/hooks'
import classes from './Demo.module.css'

const value = ref(0.3)
const { ref: trackRef } = useMove(({ x }) => {
  value.value = Math.min(Math.max(x, 0.1), 0.9)
})
const labelFloating = computed(() => value.value < 0.2 || value.value > 0.8)
</script>

<template>
  <div :class="classes.root">
    <div :class="classes.track" :ref="trackRef">
      <div
        :class="classes.filled"
        :style="{ width: \`calc(\${value * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)\` }"
      >
        <span :class="classes.label" :data-floating="labelFloating || undefined" data-filled>
          {{ (value * 100).toFixed(0) }}
        </span>
      </div>

      <div
        :class="classes.empty"
        :style="{ width: \`calc(\${(1 - value) * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)\` }"
      >
        <span :class="classes.label" :data-floating="labelFloating || undefined">
          {{ ((1 - value) * 100).toFixed(0) }}
        </span>
      </div>

      <div
        :class="classes.thumb"
        :style="{ left: \`calc(\${value * 100}% - var(--thumb-width) / 2)\` }"
      >
        <PhDotsSixVertical />
      </div>
    </div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'SliderCustomSliderDemo',
  setup() {
    ensureStyles()
    const value = ref(0.3)
    const { ref: trackRef } = useMove(({ x }: { x: number }) => {
      value.value = Math.min(Math.max(x, 0.1), 0.9)
    })

    return () => {
      const labelFloating = value.value < 0.2 || value.value > 0.8
      return h('div', { class: 'slider-custom-demo-root' }, [
        h('div', { class: 'slider-custom-demo-track', ref: trackRef }, [
          h(
            'div',
            {
              class: 'slider-custom-demo-filled',
              style: {
                width: `calc(${value.value * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
              },
            },
            [
              h(
                'span',
                {
                  class: 'slider-custom-demo-label',
                  'data-floating': labelFloating || undefined,
                  'data-filled': true,
                },
                (value.value * 100).toFixed(0),
              ),
            ],
          ),
          h(
            'div',
            {
              class: 'slider-custom-demo-empty',
              style: {
                width: `calc(${(1 - value.value) * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
              },
            },
            [
              h(
                'span',
                {
                  class: 'slider-custom-demo-label',
                  'data-floating': labelFloating || undefined,
                },
                ((1 - value.value) * 100).toFixed(0),
              ),
            ],
          ),
          h(
            'div',
            {
              class: 'slider-custom-demo-thumb',
              style: { left: `calc(${value.value * 100}% - var(--thumb-width) / 2)` },
            },
            [h(PhDotsSixVertical)],
          ),
        ]),
      ])
    }
  },
})

export const customSlider: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
  maxWidth: 500,
  centered: true,
}
