<script setup lang="ts">
import { MaskedDateInput } from '@mantine-vue/dates'
</script>

<template>
  <MaskedDateInput
    label="Date and time"
    with-time
    with-seconds
    :hours-step="1"
    :minutes-step="5"
    :seconds-step="10"
  />
</template>
