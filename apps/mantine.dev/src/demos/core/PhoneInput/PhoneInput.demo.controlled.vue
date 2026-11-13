<script setup lang="ts">
import { ref } from 'vue'
import {
  Code,
  PhoneInput,
  type PhoneInputChangeDetails,
  type PhoneInputCountryData,
} from '@mantine-vue/core'

const value = ref('+1')
const country = ref<PhoneInputCountryData | null>(null)
const formattedValue = ref('')

function handleChange(_rawValue: string, details: PhoneInputChangeDetails) {
  formattedValue.value = details.formattedValue
  country.value = details.country
}
</script>

<template>
  <div>
    <PhoneInput
      v-model="value"
      label="Phone number"
      placeholder="Your phone number"
      default-country="us"
      @change="handleChange"
    >
      <template #flag="{ country }">
        <img
          :src="`https://hatscripts.github.io/circle-flags/flags/${country?.iso2 ?? 'xx'}.svg`"
          :alt="country?.name ?? 'Select country'"
          style="width: 20px; height: 20px; border-radius: 20px"
        />
      </template>
    </PhoneInput>
    <Code block mt="md">{{
      [
        `Raw value: ${value}`,
        `Formatted: ${formattedValue}`,
        `Country: ${country?.iso2 ?? '–'}`,
      ].join('\n')
    }}</Code>
  </div>
</template>
