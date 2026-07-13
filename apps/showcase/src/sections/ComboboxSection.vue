<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { Combobox, InputBase, Stack, Text, useCombobox } from '@mantine-vue/core'
import DemoCard from '../components/DemoCard.vue'

const groceries = [
  '🍎 Apples',
  '🍌 Bananas',
  '🥦 Broccoli',
  '🥕 Carrots',
  '🍫 Chocolate',
  '🧀 Cheese',
]

const combobox = useCombobox({
  onDropdownClose: () => combobox.resetSelectedOption(),
})

const value = ref<string | null>(null)
const search = ref('')

const filtered = computed(() => {
  const shouldFilter = groceries.every((item) => item !== search.value)
  return shouldFilter
    ? groceries.filter((item) => item.toLowerCase().includes(search.value.toLowerCase().trim()))
    : groceries
})

function handleSubmit(val: string) {
  value.value = val
  search.value = val
  combobox.closeDropdown()
}
</script>

<template>
  <Stack gap="lg">
    <DemoCard
      name="Combobox"
      description="Unstyled primitive for building custom Select, Autocomplete and dropdown widgets. Select, MultiSelect and Autocomplete are all built on top of it."
    >
      <Stack gap="xs" style="max-width: 340px">
        <Combobox :store="combobox" @option-submit="handleSubmit">
          <Combobox.Target>
            <InputBase
              :right-section="h(Combobox.Chevron)"
              right-section-pointer-events="none"
              placeholder="Search a grocery"
              :value="search"
              @click="combobox.openDropdown()"
              @focus="combobox.openDropdown()"
              @input="
                (event: Event) => {
                  combobox.openDropdown()
                  combobox.updateSelectedOptionIndex()
                  search = (event.currentTarget as HTMLInputElement).value
                }
              "
              @blur="
                () => {
                  combobox.closeDropdown()
                  search = value || ''
                }
              "
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              <Combobox.Option v-for="item in filtered" :key="item" :value="item">
                {{ item }}
              </Combobox.Option>
              <Combobox.Empty v-if="filtered.length === 0">Nothing found</Combobox.Empty>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <Text size="sm" c="dimmed">Selected: {{ value ?? 'none' }}</Text>
      </Stack>
    </DemoCard>
  </Stack>
</template>
