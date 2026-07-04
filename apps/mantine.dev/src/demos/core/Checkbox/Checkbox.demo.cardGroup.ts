import { defineComponent, h, ref } from 'vue'
import { Checkbox, CheckboxGroup, Group, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'checkbox-card-group-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .checkbox-card-group-demo-root {
        position: relative;
        padding: var(--mantine-spacing-md);
        transition: border-color 150ms ease;
      }
      .checkbox-card-group-demo-root[data-checked] {
        border-color: var(--mantine-primary-color-filled);
      }
      .checkbox-card-group-demo-root:hover {
        background-color: var(--mantine-color-gray-0);
      }
      [data-mantine-color-scheme='dark'] .checkbox-card-group-demo-root:hover {
        background-color: var(--mantine-color-dark-6);
      }
      .checkbox-card-group-demo-label {
        font-weight: 600;
        font-size: var(--mantine-font-size-sm);
        line-height: 1.3;
        color: var(--mantine-color-bright);
      }
      .checkbox-card-group-demo-description {
        margin-top: 4px;
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
  font-weight: 600;
  font-size: var(--mantine-font-size-sm);
  line-height: 1.3;
  color: var(--mantine-color-bright);
}

.description {
  margin-top: 4px;
  color: var(--mantine-color-dimmed);
  font-size: var(--mantine-font-size-xs);
}`

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, CheckboxGroup, Group, Stack, Text } from '@mantine-vue/core'
import classes from './Demo.module.css'

const data = [
  { name: 'mantine/core', description: 'Core components library: inputs, buttons, overlays, etc.' },
  { name: 'mantine/hooks', description: 'Collection of reusable hooks for Vue applications.' },
  { name: 'mantine/notifications', description: 'Notifications system' },
]

const value = ref<string[]>([])
</script>

<template>
  <div>
    <CheckboxGroup
      :value="value"
      @change="value = $event"
      label="Pick packages to install"
      description="Choose all packages that you will need in your application"
    >
      <Stack pt="md" gap="xs">
        <Checkbox.Card
          v-for="item in data"
          :key="item.name"
          :class="classes.root"
          :value="item.name"
        >
          <Group wrap="nowrap" align="flex-start">
            <Checkbox.Indicator />
            <div>
              <Text :class="classes.label">{{ item.name }}</Text>
              <Text :class="classes.description">{{ item.description }}</Text>
            </div>
          </Group>
        </Checkbox.Card>
      </Stack>
    </CheckboxGroup>

    <Text fz="xs" mt="md">
      CurrentValue: {{ value.join(', ') || '–' }}
    </Text>
  </div>
</template>
`

const data = [
  { name: 'mantine/core', description: 'Core components library: inputs, buttons, overlays, etc.' },
  { name: 'mantine/hooks', description: 'Collection of reusable hooks for Vue applications.' },
  { name: 'mantine/notifications', description: 'Notifications system' },
]

const Demo = defineComponent({
  name: 'CheckboxCardGroupDemo',
  setup() {
    ensureStyles()
    const value = ref<string[]>([])

    return () => {
      const cards = data.map((item) =>
        h(
          Checkbox.Card,
          {
            key: item.name,
            class: 'checkbox-card-group-demo-root',
            value: item.name,
          },
          {
            default: () =>
              h(
                Group,
                { wrap: 'nowrap', align: 'flex-start' },
                {
                  default: () => [
                    h(Checkbox.Indicator, {}),
                    h('div', null, [
                      h(
                        Text,
                        { class: 'checkbox-card-group-demo-label' },
                        { default: () => item.name },
                      ),
                      h(
                        Text,
                        { class: 'checkbox-card-group-demo-description' },
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
          CheckboxGroup,
          {
            value: value.value,
            onChange: (v: string[]) => {
              value.value = v
            },
            label: 'Pick packages to install',
            description: 'Choose all packages that you will need in your application',
          },
          {
            default: () => h(Stack, { pt: 'md', gap: 'xs' }, { default: () => cards }),
          },
        ),
        h(
          Text,
          { fz: 'xs', mt: 'md' },
          {
            default: () => `CurrentValue: ${value.value.join(', ') || '–'}`,
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
