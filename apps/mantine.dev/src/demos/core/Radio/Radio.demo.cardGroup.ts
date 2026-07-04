import { defineComponent, h, ref } from 'vue'
import { Group, Radio, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'radio-card-group-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .radio-card-group-demo-root {
        position: relative;
        padding: var(--mantine-spacing-md);
        transition: border-color 150ms ease;
      }
      .radio-card-group-demo-root[data-checked] {
        border-color: var(--mantine-primary-color-filled);
      }
      .radio-card-group-demo-root:hover {
        background-color: var(--mantine-color-gray-0);
      }
      [data-mantine-color-scheme='dark'] .radio-card-group-demo-root:hover {
        background-color: var(--mantine-color-dark-6);
      }
      .radio-card-group-demo-label {
        font-family: var(--mantine-font-family-monospace);
        font-weight: bold;
        font-size: var(--mantine-font-size-md);
        line-height: 1.3;
        color: var(--mantine-color-bright);
      }
      .radio-card-group-demo-description {
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
import { Radio, Group, Stack, Text } from '@mantine-vue/core'
import classes from './Demo.module.css'

const data = [
  { name: '@mantine/core', description: 'Core components library: inputs, buttons, overlays, etc.' },
  { name: '@mantine/hooks', description: 'Collection of reusable hooks for Vue applications.' },
  { name: '@mantine/notifications', description: 'Notifications system' },
]

const value = ref<string | null>(null)
</script>

<template>
  <div>
    <Radio.Group
      :value="value"
      @change="(v) => (value = v)"
      label="Pick one package to install"
      description="Choose a package that you will need in your application"
    >
      <Stack pt="md" gap="xs">
        <Radio.Card
          v-for="item in data"
          :key="item.name"
          :class="classes.root"
          :value="item.name"
        >
          <Group wrap="nowrap" align="flex-start">
            <Radio.Indicator />
            <div>
              <Text :class="classes.label">{{ item.name }}</Text>
              <Text :class="classes.description">{{ item.description }}</Text>
            </div>
          </Group>
        </Radio.Card>
      </Stack>
    </Radio.Group>

    <Text fz="xs" mt="md">CurrentValue: {{ value || '–' }}</Text>
  </div>
</template>
`

const data = [
  {
    name: '@mantine/core',
    description: 'Core components library: inputs, buttons, overlays, etc.',
  },
  { name: '@mantine/hooks', description: 'Collection of reusable hooks for Vue applications.' },
  { name: '@mantine/notifications', description: 'Notifications system' },
]

const Demo = defineComponent({
  name: 'RadioCardGroupDemo',
  setup() {
    ensureStyles()
    const value = ref<string | null>(null)

    return () => {
      const cards = data.map((item) =>
        h(
          Radio.Card,
          {
            key: item.name,
            class: 'radio-card-group-demo-root',
            value: item.name,
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
                      h(
                        Text,
                        { class: 'radio-card-group-demo-label' },
                        { default: () => item.name },
                      ),
                      h(
                        Text,
                        { class: 'radio-card-group-demo-description' },
                        { default: () => item.description },
                      ),
                    ]),
                  ],
                },
              ),
          },
        ),
      )

      return h('div', null, [
        h(
          Radio.Group,
          {
            value: value.value,
            onChange: (v: string) => {
              value.value = v
            },
            label: 'Pick one package to install',
            description: 'Choose a package that you will need in your application',
          },
          {
            default: () => h(Stack, { pt: 'md', gap: 'xs' }, { default: () => cards }),
          },
        ),
        h(
          Text,
          { fz: 'xs', mt: 'md' },
          {
            default: () => `CurrentValue: ${value.value || '–'}`,
          },
        ),
      ])
    }
  },
})

export const cardGroup: MantineDemo = {
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
