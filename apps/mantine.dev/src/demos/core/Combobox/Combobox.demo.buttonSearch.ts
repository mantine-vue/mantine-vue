import { defineComponent, h, ref } from 'vue'
import { Box, Button, Combobox, Text, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Combobox, useCombobox, Text, Box } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const search = ref('')
const selectedItem = ref<string | null>(null)
const combobox = useCombobox({
  onDropdownClose: () => {
    combobox.resetSelectedOption()
    combobox.focusTarget()
    search.value = ''
  },
  onDropdownOpen: () => {
    combobox.focusSearchInput()
  },
})

const options = computed(() =>
  groceries.filter((item) => item.toLowerCase().includes(search.value.toLowerCase().trim())),
)
</script>

<template>
  <Box mb="xs">
    <Text span size="sm" c="dimmed">Selected item: </Text>
    <Text span size="sm">{{ selectedItem || 'Nothing selected' }}</Text>
  </Box>

  <Combobox
    :store="combobox"
    :width="250"
    position="bottom-start"
    with-arrow
    @option-submit="(val) => {
      selectedItem = val
      combobox.closeDropdown()
    }"
  >
    <Combobox.Target :with-aria-attributes="false">
      <Button @click="combobox.toggleDropdown()">Pick item</Button>
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Search
        :value="search"
        @input="(event) => (search = event.currentTarget.value)"
        placeholder="Search groceries"
      />
      <Combobox.Options>
        <Combobox.Empty v-if="options.length === 0">Nothing found</Combobox.Empty>
        <Combobox.Option v-for="item in options" :key="item" :value="item">
          {{ item }}
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxButtonSearchDemo',
  setup() {
    const search = ref('')
    const selectedItem = ref<string | null>(null)
    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption()
        combobox.focusTarget()
        search.value = ''
      },
      onDropdownOpen: () => {
        combobox.focusSearchInput()
      },
    })

    return () => {
      const options = groceries.filter((item) =>
        item.toLowerCase().includes(search.value.toLowerCase().trim()),
      )

      return h('div', [
        h(Box, { mb: 'xs' }, () => [
          h(Text, { span: true, size: 'sm', c: 'dimmed' }, () => 'Selected item: '),
          h(Text, { span: true, size: 'sm' }, () => selectedItem.value || 'Nothing selected'),
        ]),
        h(
          Combobox,
          {
            store: combobox,
            width: 250,
            position: 'bottom-start',
            withArrow: true,
            onOptionSubmit: (val: string) => {
              selectedItem.value = val
              combobox.closeDropdown()
            },
          },
          {
            default: () => [
              h(
                Combobox.Target,
                { withAriaAttributes: false },
                {
                  default: () =>
                    h(Button, { onClick: () => combobox.toggleDropdown() }, () => 'Pick item'),
                },
              ),
              h(Combobox.Dropdown, null, {
                default: () => [
                  h(Combobox.Search, {
                    value: search.value,
                    onInput: (event: Event) => {
                      search.value = (event.currentTarget as HTMLInputElement).value
                    },
                    placeholder: 'Search groceries',
                  }),
                  h(Combobox.Options, null, {
                    default: () =>
                      options.length > 0
                        ? options.map((item) =>
                            h(Combobox.Option, { value: item, key: item }, () => item),
                          )
                        : h(Combobox.Empty, null, () => 'Nothing found'),
                  }),
                ],
              }),
            ],
          },
        ),
      ])
    }
  },
})

export const buttonSearch: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
