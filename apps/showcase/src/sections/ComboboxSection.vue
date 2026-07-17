<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  Button,
  Combobox,
  ComboboxPopover,
  InputBase,
  Stack,
  Text,
  useCombobox,
} from '@mantine-vue/core'
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

const popoverValue = ref<string | null>(null)
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

    <DemoCard
      name="ComboboxPopover"
      description="Attach a searchable, selectable dropdown to any button target without rendering an input."
    >
      <Stack gap="xs" style="max-width: 340px">
        <ComboboxPopover
          :data="['React', 'Angular', 'Vue', 'Svelte']"
          :value="popoverValue"
          searchable
          nothing-found-message="Nothing found..."
          @change="popoverValue = $event"
        >
          <ComboboxPopover.Target>
            <Button variant="default" :miw="200">{{ popoverValue || 'Select framework' }}</Button>
          </ComboboxPopover.Target>
        </ComboboxPopover>

        <Text size="sm" c="dimmed">Selected: {{ popoverValue ?? 'none' }}</Text>
      </Stack>
    </DemoCard>
  </Stack>
</template>
