<script setup lang="ts">
import { MaskedDateInput } from '@mantine-vue/dates'
</script>

<template>
  <MaskedDateInput
    label="Date and time"
    with-time
    format="12h"
    :am-pm-labels="{ am: '午前', pm: '午後' }"
  />
</template>
