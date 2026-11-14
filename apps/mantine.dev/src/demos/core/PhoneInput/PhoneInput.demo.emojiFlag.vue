<script setup lang="ts">
import { PhoneInput } from '@mantine-vue/core'

function getFlagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}
</script>

<template>
  <PhoneInput label="Phone number" placeholder="Your phone number" default-country="us">
    <template #flag="{ country }">
      <span style="font-size: 18px">{{ country ? getFlagEmoji(country.iso2) : '🌐' }}</span>
    </template>
  </PhoneInput>
</template>
