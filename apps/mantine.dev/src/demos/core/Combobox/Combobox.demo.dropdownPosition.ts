import { defineComponent, h, ref } from 'vue'
import { Combobox, Input, InputBase, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputBase, Combobox, useCombobox } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const value = ref<string | null>(null)
</script>

<template>
  <Combobox
    :store="combobox"
    position="bottom"
    :middlewares="{ flip: false, shift: false }"
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
        <Combobox.Option v-for="item in groceries" :key="item" :value="item">
          {{ item }}
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxDropdownPositionDemo',
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
          position: 'bottom',
          middlewares: { flip: false, shift: false },
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
                  default: () =>
                    groceries.map((item) =>
                      h(Combobox.Option, { value: item, key: item }, () => item),
                    ),
                }),
            }),
          ],
        },
      )
  },
})

export const dropdownPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
