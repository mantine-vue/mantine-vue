<script setup lang="ts">
import { PhoneInput } from '@mantine-vue/core'
</script>

<template>
  <PhoneInput
    label="Phone number"
    placeholder="Your phone number"
    default-country="us"
    :preferred-countries="['us', 'gb', 'ca']"
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
