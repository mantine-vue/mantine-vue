<script setup lang="ts">
import { QuarterPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <QuarterPickerInput
    value-format="YYYY [Q]Q"
    type="multiple"
    label="Pick quarter"
    placeholder="Pick quarter"
  />
</template>
