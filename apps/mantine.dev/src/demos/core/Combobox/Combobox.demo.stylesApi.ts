import { defineComponent, h } from 'vue'
import { Combobox, TextInput, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Combobox, TextInput, useCombobox } from '@mantine-vue/core'

const combobox = useCombobox({ opened: true })
</script>

<template>
  <Combobox :store="combobox" :middlewares="{ flip: false, shift: false }"{{props}}>
    <Combobox.Target>
      <TextInput placeholder="Pick value" />
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Header>Combobox header</Combobox.Header>
      <Combobox.Search placeholder="Search input" />

      <Combobox.Options>
        <Combobox.Group label="First group">
          <Combobox.Option value="1">First</Combobox.Option>
          <Combobox.Option value="2">Second</Combobox.Option>
        </Combobox.Group>

        <Combobox.Group label="Second group">
          <Combobox.Option value="3">Third</Combobox.Option>
          <Combobox.Option value="4">Fourth</Combobox.Option>
        </Combobox.Group>

        <Combobox.Group label="Third group">
          <Combobox.Empty>Nothing found in this group...</Combobox.Empty>
        </Combobox.Group>
      </Combobox.Options>

      <Combobox.Footer>Combobox footer</Combobox.Footer>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const combobox = useCombobox({ opened: true })

    return () =>
      h(
        Combobox,
        {
          store: combobox,
          middlewares: { flip: false, shift: false },
          ...attrs,
        },
        {
          default: () => [
            h(Combobox.Target, null, {
              default: () => h(TextInput, { placeholder: 'Pick value' }),
            }),
            h(Combobox.Dropdown, null, {
              default: () => [
                h(Combobox.Header, null, () => 'Combobox header'),
                h(Combobox.Search, { placeholder: 'Search input' }),
                h(Combobox.Options, null, {
                  default: () => [
                    h(Combobox.Group, { label: 'First group' }, () => [
                      h(Combobox.Option, { value: '1' }, () => 'First'),
                      h(Combobox.Option, { value: '2' }, () => 'Second'),
                    ]),
                    h(Combobox.Group, { label: 'Second group' }, () => [
                      h(Combobox.Option, { value: '3' }, () => 'Third'),
                      h(Combobox.Option, { value: '4' }, () => 'Fourth'),
                    ]),
                    h(Combobox.Group, { label: 'Third group' }, () =>
                      h(Combobox.Empty, null, () => 'Nothing found in this group...'),
                    ),
                  ],
                }),
                h(Combobox.Footer, null, () => 'Combobox footer'),
              ],
            }),
          ],
        },
      )
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      options: '`Combobox.Options` component',
      dropdown: '`Combobox.Dropdown` component',
      option: '`Combobox.Option` component',
      search: '`Combobox.Search` input',
      empty: '`Combobox.Empty` component',
      header: '`Combobox.Header` component',
      footer: '`Combobox.Footer` component',
      group: '`Combobox.Group` component',
      groupLabel: 'Label of `Combobox.Group` component',
    },
  },
  component: Demo,
  code,
}
