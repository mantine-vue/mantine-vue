import { defineComponent, h, ref } from 'vue'
import {
  PhLinkSimple,
  PhTextAlignCenter,
  PhTextAlignLeft,
  PhTextAlignRight,
  PhTextB,
  PhTextItalic,
  PhTextUnderline,
} from '@phosphor-icons/vue'
import { Stack, Toolbar } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const icon = (component: any) => h(component, { weight: 'bold', size: '100%' })

function toolbarContent(
  formatting: string[] | undefined = undefined,
  alignment: string | null | undefined = undefined,
  handlers?: {
    formatting: (value: string | string[] | null) => void
    alignment: (value: string | string[] | null) => void
  },
  options: { link?: boolean; disabled?: boolean } = {},
) {
  return [
    h(
      Toolbar.ToggleGroup,
      {
        type: 'multiple' as const,
        modelValue: formatting,
        defaultValue: formatting === undefined ? [] : undefined,
        'onUpdate:modelValue': handlers?.formatting,
      },
      () => [
        h(Toolbar.ToggleItem, { value: 'bold', 'aria-label': 'Bold' }, () => icon(PhTextB)),
        h(
          Toolbar.ToggleItem,
          { value: 'italic', 'aria-label': 'Italic', disabled: options.disabled },
          () => icon(PhTextItalic),
        ),
        h(Toolbar.ToggleItem, { value: 'underline', 'aria-label': 'Underline' }, () =>
          icon(PhTextUnderline),
        ),
      ],
    ),
    h(Toolbar.Divider),
    h(
      Toolbar.ToggleGroup,
      {
        type: 'single' as const,
        modelValue: alignment,
        defaultValue: alignment === undefined ? 'left' : undefined,
        disabled: options.disabled,
        'onUpdate:modelValue': handlers?.alignment,
      },
      () => [
        h(Toolbar.ToggleItem, { value: 'left', 'aria-label': 'Align left' }, () =>
          icon(PhTextAlignLeft),
        ),
        h(Toolbar.ToggleItem, { value: 'center', 'aria-label': 'Align center' }, () =>
          icon(PhTextAlignCenter),
        ),
        h(Toolbar.ToggleItem, { value: 'right', 'aria-label': 'Align right' }, () =>
          icon(PhTextAlignRight),
        ),
      ],
    ),
    ...(options.link
      ? [
          h(Toolbar.Divider),
          h(
            Toolbar.Toggle,
            {
              component: 'a',
              href: 'https://mantine.dev',
              target: '_blank',
              'aria-label': 'Mantine website',
            },
            () => icon(PhLinkSimple),
          ),
        ]
      : []),
  ]
}

const ControlledToolbar = defineComponent({
  props: { withLink: Boolean },
  setup(props) {
    const formatting = ref<string[]>([])
    const alignment = ref<string | null>('left')
    return () =>
      h(Toolbar, null, () =>
        toolbarContent(
          formatting.value,
          alignment.value,
          {
            formatting: (value) => (formatting.value = value as string[]),
            alignment: (value) => (alignment.value = value as string | null),
          },
          { link: props.withLink },
        ),
      )
  },
})

const fullCode = (withLink: boolean) => `<script setup lang="ts">
import { ref } from 'vue'
import {
  PhLinkSimple, PhTextAlignCenter, PhTextAlignLeft, PhTextAlignRight,
  PhTextB, PhTextItalic, PhTextUnderline,
} from '@phosphor-icons/vue'
import { Toolbar } from '@mantine-vue/core'

const formatting = ref<string[]>([])
const alignment = ref<string | null>('left')
</script>

<template>
  <Toolbar>
    <Toolbar.ToggleGroup v-model="formatting" type="multiple">
      <Toolbar.ToggleItem value="bold" aria-label="Bold"><PhTextB weight="bold" size="100%" /></Toolbar.ToggleItem>
      <Toolbar.ToggleItem value="italic" aria-label="Italic"><PhTextItalic weight="bold" size="100%" /></Toolbar.ToggleItem>
      <Toolbar.ToggleItem value="underline" aria-label="Underline"><PhTextUnderline weight="bold" size="100%" /></Toolbar.ToggleItem>
    </Toolbar.ToggleGroup>
    <Toolbar.Divider />
    <Toolbar.ToggleGroup v-model="alignment" type="single">
      <Toolbar.ToggleItem value="left" aria-label="Align left"><PhTextAlignLeft weight="bold" size="100%" /></Toolbar.ToggleItem>
      <Toolbar.ToggleItem value="center" aria-label="Align center"><PhTextAlignCenter weight="bold" size="100%" /></Toolbar.ToggleItem>
      <Toolbar.ToggleItem value="right" aria-label="Align right"><PhTextAlignRight weight="bold" size="100%" /></Toolbar.ToggleItem>
    </Toolbar.ToggleGroup>${
      withLink
        ? `
    <Toolbar.Divider />
    <Toolbar.Toggle component="a" href="https://mantine.dev" target="_blank" aria-label="Mantine website">
      <PhLinkSimple weight="bold" size="100%" />
    </Toolbar.Toggle>`
        : ''
    }
  </Toolbar>
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: defineComponent({ setup: () => () => h(ControlledToolbar, { withLink: true }) }),
  code: fullCode(true),
}

export const toggleGroup: MantineDemo = {
  type: 'code',
  component: ControlledToolbar,
  code: fullCode(false),
}

const Configurator = defineComponent({
  inheritAttrs: false,
  setup:
    (_props, { attrs }) =>
    () =>
      h(Toolbar, attrs, () => toolbarContent()),
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Configurator,
  centered: true,
  code: fullCode(false).replace('<Toolbar>', '<Toolbar{{props}}>'),
  controls: [
    {
      prop: 'orientation',
      type: 'segmented',
      data: ['horizontal', 'vertical'],
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
    },
    {
      prop: 'variant',
      type: 'segmented',
      data: ['filled', 'light'],
      initialValue: 'filled',
      libraryValue: 'filled',
    },
    { prop: 'color', type: 'color', initialValue: 'blue', libraryValue: null },
    { prop: 'autoContrast', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'size', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'radius', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'withBorder', type: 'boolean', initialValue: true, libraryValue: true },
  ],
}

export const autoContrast: MantineDemo = {
  type: 'code',
  centered: true,
  component: defineComponent({
    setup: () => () =>
      h(Stack, null, () => [
        h(Toolbar, { variant: 'filled', color: 'lime.4' }, () => toolbarContent(['bold'], 'left')),
        h(Toolbar, { autoContrast: true, variant: 'filled', color: 'lime.4' }, () =>
          toolbarContent(['bold'], 'left'),
        ),
      ]),
  }),
  code: fullCode(false),
}

export const autoWidth: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Toolbar, null, () => [
        h(Toolbar.Toggle, { 'aria-label': 'Bold' }, () => icon(PhTextB)),
        h(Toolbar.Toggle, { 'aria-label': 'Italic' }, () => icon(PhTextItalic)),
        h(Toolbar.Divider),
        h(Toolbar.Toggle, { autoWidth: true }, () => 'Save'),
        h(Toolbar.Toggle, { autoWidth: true }, () => 'Cancel'),
      ]),
  }),
  code: `<script setup lang="ts">
import { PhTextB, PhTextItalic } from '@phosphor-icons/vue'
import { Toolbar } from '@mantine-vue/core'
</script>
<template>
  <Toolbar>
    <Toolbar.Toggle aria-label="Bold"><PhTextB weight="bold" size="100%" /></Toolbar.Toggle>
    <Toolbar.Toggle aria-label="Italic"><PhTextItalic weight="bold" size="100%" /></Toolbar.Toggle>
    <Toolbar.Divider />
    <Toolbar.Toggle autoWidth>Save</Toolbar.Toggle>
    <Toolbar.Toggle autoWidth>Cancel</Toolbar.Toggle>
  </Toolbar>
</template>`,
}

export const disabled: MantineDemo = {
  type: 'code',
  component: defineComponent({
    setup: () => () =>
      h(Toolbar, null, () => toolbarContent(undefined, undefined, undefined, { disabled: true })),
  }),
  code: fullCode(false),
}

export const ToolbarDemos = { usage, toggleGroup, configurator, autoContrast, autoWidth, disabled }
