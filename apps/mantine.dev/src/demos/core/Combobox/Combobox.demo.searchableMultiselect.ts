import { defineComponent, h, ref } from 'vue'
import { CheckIcon, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { PillsInput, Pill, Combobox, CheckIcon, Group, useCombobox } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
  onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
})

const search = ref('')
const value = ref<string[]>([])

function handleValueSelect(val: string) {
  value.value = value.value.includes(val)
    ? value.value.filter((v) => v !== val)
    : [...value.value, val]
}

function handleValueRemove(val: string) {
  value.value = value.value.filter((v) => v !== val)
}

const filteredOptions = computed(() =>
  groceries.filter((item) => item.toLowerCase().includes(search.value.trim().toLowerCase())),
)
</script>

<template>
  <Combobox :store="combobox" @option-submit="handleValueSelect">
    <Combobox.DropdownTarget>
      <PillsInput @click="combobox.openDropdown()">
        <Pill.Group>
          <Pill v-for="item in value" :key="item" with-remove-button @remove="handleValueRemove(item)">
            {{ item }}
          </Pill>

          <Combobox.EventsTarget>
            <PillsInput.Field
              @focus="combobox.openDropdown()"
              @blur="combobox.closeDropdown()"
              :value="search"
              placeholder="Search values"
              @input="(event) => {
                combobox.updateSelectedOptionIndex()
                search = event.currentTarget.value
              }"
              @keydown="(event) => {
                if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                  event.preventDefault()
                  handleValueRemove(value[value.length - 1])
                }
              }"
            />
          </Combobox.EventsTarget>
        </Pill.Group>
      </PillsInput>
    </Combobox.DropdownTarget>

    <Combobox.Dropdown>
      <Combobox.Options>
        <Combobox.Empty v-if="filteredOptions.length === 0">Nothing found...</Combobox.Empty>
        <Combobox.Option
          v-for="item in filteredOptions"
          :key="item"
          :value="item"
          :active="value.includes(item)"
        >
          <Group gap="sm">
            <CheckIcon v-if="value.includes(item)" :size="12" />
            <span>{{ item }}</span>
          </Group>
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxSearchableMultiselectDemo',
  setup() {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
      onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    })
    const search = ref('')
    const value = ref<string[]>([])

    const handleValueSelect = (val: string) => {
      value.value = value.value.includes(val)
        ? value.value.filter((v) => v !== val)
        : [...value.value, val]
    }
    const handleValueRemove = (val: string) => {
      value.value = value.value.filter((v) => v !== val)
    }

    return () => {
      const filteredOptions = groceries.filter((item) =>
        item.toLowerCase().includes(search.value.trim().toLowerCase()),
      )

      return h(
        Combobox,
        { store: combobox, onOptionSubmit: handleValueSelect },
        {
          default: () => [
            h(Combobox.DropdownTarget, null, {
              default: () =>
                h(
                  PillsInput,
                  { onClick: () => combobox.openDropdown() },
                  {
                    default: () =>
                      h(Pill.Group, null, {
                        default: () => [
                          ...value.value.map((item) =>
                            h(
                              Pill,
                              {
                                key: item,
                                withRemoveButton: true,
                                onRemove: () => handleValueRemove(item),
                              },
                              () => item,
                            ),
                          ),
                          h(Combobox.EventsTarget, null, {
                            default: () =>
                              h(PillsInput.Field, {
                                onFocus: () => combobox.openDropdown(),
                                onBlur: () => combobox.closeDropdown(),
                                value: search.value,
                                placeholder: 'Search values',
                                onInput: (event: Event) => {
                                  combobox.updateSelectedOptionIndex()
                                  search.value = (event.currentTarget as HTMLInputElement).value
                                },
                                onKeydown: (event: KeyboardEvent) => {
                                  if (
                                    event.key === 'Backspace' &&
                                    search.value.length === 0 &&
                                    value.value.length > 0
                                  ) {
                                    event.preventDefault()
                                    handleValueRemove(value.value[value.value.length - 1])
                                  }
                                },
                              }),
                          }),
                        ],
                      }),
                  },
                ),
            }),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () =>
                    filteredOptions.length > 0
                      ? filteredOptions.map((item) =>
                          h(
                            Combobox.Option,
                            { value: item, key: item, active: value.value.includes(item) },
                            () =>
                              h(Group, { gap: 'sm' }, () => [
                                value.value.includes(item) ? h(CheckIcon, { size: 12 }) : null,
                                h('span', item),
                              ]),
                          ),
                        )
                      : h(Combobox.Empty, null, () => 'Nothing found...'),
                }),
            }),
          ],
        },
      )
    }
  },
})

export const searchableMultiselect: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
  maxWidth: 340,
}
