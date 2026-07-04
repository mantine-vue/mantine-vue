import { defineComponent, h, ref } from 'vue'
import { Group, Radio, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'radio-card-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .radio-card-demo-root {
        position: relative;
        padding: var(--mantine-spacing-md);
        transition: border-color 150ms ease;
      }
      .radio-card-demo-root[data-checked] {
        border-color: var(--mantine-primary-color-filled);
      }
      .radio-card-demo-root:hover {
        background-color: var(--mantine-color-gray-0);
      }
      [data-mantine-color-scheme='dark'] .radio-card-demo-root:hover {
        background-color: var(--mantine-color-dark-6);
      }
      .radio-card-demo-label {
        font-family: var(--mantine-font-family-monospace);
        font-weight: bold;
        font-size: var(--mantine-font-size-md);
        line-height: 1.3;
        color: var(--mantine-color-bright);
      }
      .radio-card-demo-description {
        margin-top: 8px;
        color: var(--mantine-color-dimmed);
        font-size: var(--mantine-font-size-xs);
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.root {
  position: relative;
  padding: var(--mantine-spacing-md);
  transition: border-color 150ms ease;

  &[data-checked] {
    border-color: var(--mantine-primary-color-filled);
  }

  @mixin hover {
    @mixin light {
      background-color: var(--mantine-color-gray-0);
    }

    @mixin dark {
      background-color: var(--mantine-color-dark-6);
    }
  }
}

.label {
  font-family: var(--mantine-font-family-monospace);
  font-weight: bold;
  font-size: var(--mantine-font-size-md);
  line-height: 1.3;
  color: var(--mantine-color-bright);
}

.description {
  margin-top: 8px;
  color: var(--mantine-color-dimmed);
  font-size: var(--mantine-font-size-xs);
}`

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Radio, Group, Text } from '@mantine-vue/core'
import classes from './Demo.module.css'

const checked = ref(false)
</script>

<template>
  <Radio.Card
    :class="classes.root"
    :checked="checked"
    @click="checked = !checked"
  >
    <Group wrap="nowrap" align="flex-start">
      <Radio.Indicator />
      <div>
        <Text :class="classes.label">@mantine/core</Text>
        <Text :class="classes.description">
          Core components library: inputs, buttons, overlays, etc.
        </Text>
      </div>
    </Group>
  </Radio.Card>
</template>
`

const Demo = defineComponent({
  name: 'RadioCardDemo',
  setup() {
    ensureStyles()
    const checked = ref(false)

    return () =>
      h(
        Radio.Card,
        {
          class: 'radio-card-demo-root',
          checked: checked.value,
          onClick: () => {
            checked.value = !checked.value
          },
        },
        {
          default: () =>
            h(
              Group,
              { wrap: 'nowrap', align: 'flex-start' },
              {
                default: () => [
                  h(Radio.Indicator, {}),
                  h('div', null, [
                    h(Text, { class: 'radio-card-demo-label' }, { default: () => '@mantine/core' }),
                    h(
                      Text,
                      { class: 'radio-card-demo-description' },
                      {
                        default: () => 'Core components library: inputs, buttons, overlays, etc.',
                      },
                    ),
                  ]),
                ],
              },
            ),
        },
      )
  },
})

export const card: MantineDemo = {
  type: 'code',
  centered: true,
  maxWidth: 320,
  component: Demo,
  defaultExpanded: false,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
}
