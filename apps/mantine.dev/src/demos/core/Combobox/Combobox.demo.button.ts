import { defineComponent, h, ref } from 'vue'
import { Box, Button, Combobox, Text, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Combobox, useCombobox, Text, Box } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const selectedItem = ref<string | null>(null)
const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})
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
    <Combobox.Target>
      <Button @click="combobox.toggleDropdown()">Pick item</Button>
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
  name: 'ComboboxButtonDemo',
  setup() {
    const selectedItem = ref<string | null>(null)
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    })

    return () =>
      h('div', [
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
              h(Combobox.Target, null, {
                default: () =>
                  h(Button, { onClick: () => combobox.toggleDropdown() }, () => 'Pick item'),
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
        ),
      ])
  },
})

export const button: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
