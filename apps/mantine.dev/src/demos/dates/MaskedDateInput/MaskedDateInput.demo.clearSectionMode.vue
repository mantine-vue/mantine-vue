<script setup lang="ts">
import { h } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'
import { Stack } from '@mantine-vue/core'
import { MaskedDateInput } from '@mantine-vue/dates'

const icon = () => h(PhCaretDown, { size: 16 })
</script>

<template>
  <Stack>
    <MaskedDateInput
      label="clearSectionMode='both' (default)"
      default-value="2025-06-15"
      clearable
      :right-section="icon()"
      clear-section-mode="both"
    />
    <MaskedDateInput
      label="clearSectionMode='rightSection'"
      default-value="2025-06-15"
      clearable
      :right-section="icon()"
      clear-section-mode="rightSection"
    />
    <MaskedDateInput
      label="clearSectionMode='clear'"
      default-value="2025-06-15"
      clearable
      :right-section="icon()"
      clear-section-mode="clear"
    />
  </Stack>
</template>
