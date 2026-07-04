import { defineComponent, h, ref } from 'vue'
import { Combobox, TextInput, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Combobox, TextInput, useCombobox } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const combobox = useCombobox()
const value = ref('')

const filteredOptions = computed(() => {
  const shouldFilterOptions = !groceries.some((item) => item === value.value)
  return shouldFilterOptions
    ? groceries.filter((item) => item.toLowerCase().includes(value.value.toLowerCase().trim()))
    : groceries
})
</script>

<template>
  <Combobox
    :store="combobox"
    @option-submit="(optionValue) => {
      value = optionValue
      combobox.closeDropdown()
    }"
  >
    <Combobox.Target>
      <TextInput
        label="Pick value or type anything"
        placeholder="Pick value or type anything"
        :value="value"
        @input="(event) => {
          value = event.currentTarget.value
          combobox.openDropdown()
          combobox.updateSelectedOptionIndex()
        }"
        @click="combobox.openDropdown()"
        @focus="combobox.openDropdown()"
        @blur="combobox.closeDropdown()"
      />
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Options>
        <Combobox.Empty v-if="filteredOptions.length === 0">Nothing found</Combobox.Empty>
        <Combobox.Option v-for="item in filteredOptions" :key="item" :value="item">
          {{ item }}
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxAutocompleteDemo',
  setup() {
    const combobox = useCombobox()
    const value = ref('')

    return () => {
      const shouldFilterOptions = !groceries.some((item) => item === value.value)
      const filteredOptions = shouldFilterOptions
        ? groceries.filter((item) => item.toLowerCase().includes(value.value.toLowerCase().trim()))
        : groceries

      return h(
        Combobox,
        {
          store: combobox,
          onOptionSubmit: (optionValue: string) => {
            value.value = optionValue
            combobox.closeDropdown()
          },
        },
        {
          default: () => [
            h(Combobox.Target, null, {
              default: () =>
                h(TextInput, {
                  label: 'Pick value or type anything',
                  placeholder: 'Pick value or type anything',
                  value: value.value,
                  onInput: (event: Event) => {
                    value.value = (event.currentTarget as HTMLInputElement).value
                    combobox.openDropdown()
                    combobox.updateSelectedOptionIndex()
                  },
                  onClick: () => combobox.openDropdown(),
                  onFocus: () => combobox.openDropdown(),
                  onBlur: () => combobox.closeDropdown(),
                }),
            }),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () =>
                    filteredOptions.length === 0
                      ? h(Combobox.Empty, null, () => 'Nothing found')
                      : filteredOptions.map((item) =>
                          h(Combobox.Option, { value: item, key: item }, () => item),
                        ),
                }),
            }),
          ],
        },
      )
    }
  },
})

export const autocomplete: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  defaultExpanded: false,
  code,
}
