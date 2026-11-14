<script setup lang="ts">
import { MaskedDateInput } from '@mantine-vue/dates'
</script>

<template>
  <MaskedDateInput
    label="Date of birth"
    :popover-props="{ position: 'top-start', middlewares: { flip: false, shift: false } }"
  />
</template>
