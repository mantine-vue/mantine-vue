import { defineComponent, h, ref } from 'vue'
import { Combobox, Input, InputBase, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { longGroceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputBase, Combobox, useCombobox } from '@mantine-vue/core'

const groceries = [
  '🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate', '🍇 Grapes',
  '🍋 Lemon', '🥬 Lettuce', '🍄 Mushrooms', '🍊 Oranges', '🥔 Potatoes', '🍅 Tomatoes',
  '🥚 Eggs', '🥛 Milk', '🍞 Bread', '🍗 Chicken', '🍔 Hamburger', '🧀 Cheese', '🥩 Steak',
  '🍟 French Fries', '🍕 Pizza', '🥦 Cauliflower', '🥜 Peanuts', '🍦 Ice Cream', '🍯 Honey',
  '🥖 Baguette', '🍣 Sushi', '🥝 Kiwi', '🍓 Strawberries',
]

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
      <Combobox.Options :mah="200" style="overflow-y: auto">
        <Combobox.Option v-for="item in groceries" :key="item" :value="item">
          {{ item }}
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxNativeScrollDemo',
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
                h(
                  Combobox.Options,
                  { mah: 200, style: { overflowY: 'auto' } },
                  {
                    default: () =>
                      longGroceries.map((item) =>
                        h(Combobox.Option, { value: item, key: item }, () => item),
                      ),
                  },
                ),
            }),
          ],
        },
      )
  },
})

export const nativeScroll: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
