import { defineComponent, h, ref } from 'vue'
import { Combobox, Input, InputBase, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputBase, Combobox, useCombobox } from '@mantine-vue/core'

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const value = ref<string | null>(null)
</script>

<template>
  <Combobox
    :store="combobox"
    @option-submit="(val) => {
      value = val
      combobox.closeDropdown()
    }"
  >
    <Combobox.Target>
      <InputBase
        component="button"
        type="button"
        pointer
        :right-section="h(Combobox.Chevron)"
        right-section-pointer-events="none"
        @click="combobox.toggleDropdown()"
      >
        <template v-if="value">{{ value }}</template>
        <Input.Placeholder v-else>Pick value</Input.Placeholder>
      </InputBase>
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Options>
        <Combobox.Group label="Fruits">
          <Combobox.Option value="🍎 Apples">🍎 Apples</Combobox.Option>
          <Combobox.Option value="🍌 Bananas">🍌 Bananas</Combobox.Option>
          <Combobox.Option value="🍇 Grape">🍇 Grape</Combobox.Option>
        </Combobox.Group>

        <Combobox.Group label="Vegetables">
          <Combobox.Option value="🥦 Broccoli">🥦 Broccoli</Combobox.Option>
          <Combobox.Option value="🥕 Carrots">🥕 Carrots</Combobox.Option>
          <Combobox.Option value="🥬 Lettuce">🥬 Lettuce</Combobox.Option>
        </Combobox.Group>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxGroupsDemo',
  setup() {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const value = ref<string | null>(null)

    return () =>
      h(
        Combobox,
        {
          store: combobox,
          onOptionSubmit: (val: string) => {
            value.value = val
            combobox.closeDropdown()
          },
        },
        {
          default: () => [
            h(Combobox.Target, null, {
              default: () =>
                h(
                  InputBase,
                  {
                    component: 'button',
                    type: 'button',
                    pointer: true,
                    rightSection: h(Combobox.Chevron),
                    rightSectionPointerEvents: 'none',
                    onClick: () => combobox.toggleDropdown(),
                  },
                  { default: () => value.value || h(Input.Placeholder, null, () => 'Pick value') },
                ),
            }),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () => [
                    h(Combobox.Group, { label: 'Fruits' }, () => [
                      h(Combobox.Option, { value: '🍎 Apples' }, () => '🍎 Apples'),
                      h(Combobox.Option, { value: '🍌 Bananas' }, () => '🍌 Bananas'),
                      h(Combobox.Option, { value: '🍇 Grape' }, () => '🍇 Grape'),
                    ]),
                    h(Combobox.Group, { label: 'Vegetables' }, () => [
                      h(Combobox.Option, { value: '🥦 Broccoli' }, () => '🥦 Broccoli'),
                      h(Combobox.Option, { value: '🥕 Carrots' }, () => '🥕 Carrots'),
                      h(Combobox.Option, { value: '🥬 Lettuce' }, () => '🥬 Lettuce'),
                    ]),
                  ],
                }),
            }),
          ],
        },
      )
  },
})

export const groups: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
