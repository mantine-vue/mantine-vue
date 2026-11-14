<script setup lang="ts">
import { PhoneInput } from '@mantine-vue/core'
</script>

<template>
  <PhoneInput
    label="Phone number"
    placeholder="Your phone number"
    default-country="us"
    read-only
    default-value="+12025551234"
  >
  </PhoneInput>
</template>
