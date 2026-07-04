import { defineComponent, h, ref } from 'vue'
import { Combobox, Input, InputBase, ScrollArea, useCombobox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { countries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Combobox, Input, InputBase, ScrollArea, useCombobox } from '@mantine-vue/core'

const countries = [
  'Afghanistan', 'Albania', /* ...full list, see docs page... */ 'Mongolia',
]

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const value = ref<string | null>(null)
</script>

<template>
  <Combobox
    :store="combobox"
    floating-height="viewport"
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
        <Input.Placeholder v-else>Pick a country</Input.Placeholder>
      </InputBase>
    </Combobox.Target>

    <Combobox.Dropdown>
      <Combobox.Options>
        <ScrollArea.Autosize mah="var(--combobox-floating-options-max-height)" type="scroll">
          <Combobox.Option v-for="item in countries" :key="item" :value="item">
            {{ item }}
          </Combobox.Option>
        </ScrollArea.Autosize>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxFloatingHeightDemo',
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
          floatingHeight: 'viewport',
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
                  {
                    default: () =>
                      value.value || h(Input.Placeholder, null, () => 'Pick a country'),
                  },
                ),
            }),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () =>
                    h(
                      ScrollArea.Autosize,
                      { mah: 'var(--combobox-floating-options-max-height)', type: 'scroll' },
                      {
                        default: () =>
                          countries.map((item) =>
                            h(Combobox.Option, { value: item, key: item }, () => item),
                          ),
                      },
                    ),
                }),
            }),
          ],
        },
      )
  },
})

export const floatingHeight: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
