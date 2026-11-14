<script setup lang="ts">
import { MaskedDateInput } from '@mantine-vue/dates'
</script>

<template>
  <MaskedDateInput label="Date" :fields-order="['year', 'month', 'day']" date-separator="-" />
</template>
