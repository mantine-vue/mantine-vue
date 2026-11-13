<script setup lang="ts">
import { PhoneInput } from '@mantine-vue/core'
</script>

<template>
  <PhoneInput
    label="Phone number"
    placeholder="Type +44 to switch to UK"
    default-country="us"
    with-country-auto-detect
  >
    <template #flag="{ country }">
      <img
        :src="`https://hatscripts.github.io/circle-flags/flags/${country?.iso2 ?? 'xx'}.svg`"
        :alt="country?.name ?? 'Select country'"
        style="width: 20px; height: 20px; border-radius: 20px"
      />
    </template>
  </PhoneInput>
</template>
