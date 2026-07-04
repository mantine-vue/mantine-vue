import { defineComponent, h, ref } from 'vue'
import { Combobox, InputBase, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { InputBase, Combobox, useCombobox } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const value = ref<string | null>(null)
const search = ref('')

const filteredOptions = computed(() => {
  const shouldFilterOptions = groceries.every((item) => item !== search.value)
  return shouldFilterOptions
    ? groceries.filter((item) => item.toLowerCase().includes(search.value.toLowerCase().trim()))
    : groceries
})
</script>

<template>
  <Combobox
    :store="combobox"
    @option-submit="(val) => {
      value = val
      search = val
      combobox.closeDropdown()
    }"
  >
    <Combobox.Target>
      <InputBase
        :right-section="h(Combobox.Chevron)"
        right-section-pointer-events="none"
        @click="combobox.openDropdown()"
        @focus="combobox.openDropdown()"
        @blur="() => {
          combobox.closeDropdown()
          search = value || ''
        }"
        placeholder="Search value"
        :value="search"
        @input="(event) => {
          combobox.updateSelectedOptionIndex()
          search = event.currentTarget.value
        }"
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
  name: 'ComboboxSearchableSelectDemo',
  setup() {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    })
    const value = ref<string | null>(null)
    const search = ref('')

    return () => {
      const shouldFilterOptions = groceries.every((item) => item !== search.value)
      const filteredOptions = shouldFilterOptions
        ? groceries.filter((item) => item.toLowerCase().includes(search.value.toLowerCase().trim()))
        : groceries

      return h(
        Combobox,
        {
          store: combobox,
          onOptionSubmit: (val: string) => {
            value.value = val
            search.value = val
            combobox.closeDropdown()
          },
        },
        {
          default: () => [
            h(Combobox.Target, null, {
              default: () =>
                h(InputBase, {
                  rightSection: h(Combobox.Chevron),
                  rightSectionPointerEvents: 'none',
                  onClick: () => combobox.openDropdown(),
                  onFocus: () => combobox.openDropdown(),
                  onBlur: () => {
                    combobox.closeDropdown()
                    search.value = value.value || ''
                  },
                  placeholder: 'Search value',
                  value: search.value,
                  onInput: (event: Event) => {
                    combobox.updateSelectedOptionIndex()
                    search.value = (event.currentTarget as HTMLInputElement).value
                  },
                }),
            }),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () =>
                    filteredOptions.length > 0
                      ? filteredOptions.map((item) =>
                          h(Combobox.Option, { value: item, key: item }, () => item),
                        )
                      : h(Combobox.Empty, null, () => 'Nothing found'),
                }),
            }),
          ],
        },
      )
    }
  },
})

export const searchableSelect: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
