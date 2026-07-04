import { defineComponent, h, ref } from 'vue'
import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  InputBase,
  useCombobox,
  type ComboboxDropdownEventSource,
} from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { groceries } from './_groceries'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Input, InputBase, Combobox, useCombobox, CheckIcon, Group } from '@mantine-vue/core'

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate']

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
  onDropdownOpen: (eventSource) => {
    if (eventSource === 'keyboard') {
      combobox.selectActiveOption()
    } else {
      combobox.updateSelectedOptionIndex('active')
    }
  },
})

const value = ref<string | null>('🥦 Broccoli')
</script>

<template>
  <Combobox
    :store="combobox"
    reset-selection-on-option-hover
    @option-submit="(val) => {
      value = val
      combobox.updateSelectedOptionIndex('active')
    }"
  >
    <Combobox.Target target-type="button">
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
        <Combobox.Option
          v-for="item in groceries"
          :key="item"
          :value="item"
          :active="item === value"
        >
          <Group gap="xs">
            <CheckIcon v-if="item === value" :size="12" />
            <span>{{ item }}</span>
          </Group>
        </Combobox.Option>
      </Combobox.Options>
    </Combobox.Dropdown>
  </Combobox>
</template>
`

const Demo = defineComponent({
  name: 'ComboboxActiveOptionDemo',
  setup() {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
      onDropdownOpen: (eventSource: ComboboxDropdownEventSource) => {
        if (eventSource === 'keyboard') combobox.selectActiveOption()
        else combobox.updateSelectedOptionIndex('active')
      },
    })
    const value = ref<string | null>('🥦 Broccoli')

    return () =>
      h(
        Combobox,
        {
          store: combobox,
          resetSelectionOnOptionHover: true,
          onOptionSubmit: (val: string) => {
            value.value = val
            combobox.updateSelectedOptionIndex('active')
          },
        },
        {
          default: () => [
            h(
              Combobox.Target,
              { targetType: 'button' },
              {
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
                      default: () => value.value || h(Input.Placeholder, null, () => 'Pick value'),
                    },
                  ),
              },
            ),
            h(Combobox.Dropdown, null, {
              default: () =>
                h(Combobox.Options, null, {
                  default: () =>
                    groceries.map((item) =>
                      h(
                        Combobox.Option,
                        { value: item, key: item, active: item === value.value },
                        () =>
                          h(Group, { gap: 'xs' }, () => [
                            item === value.value ? h(CheckIcon, { size: 12 }) : null,
                            h('span', item),
                          ]),
                      ),
                    ),
                }),
            }),
          ],
        },
      )
  },
})

export const activeOption: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  defaultExpanded: false,
  code,
}
