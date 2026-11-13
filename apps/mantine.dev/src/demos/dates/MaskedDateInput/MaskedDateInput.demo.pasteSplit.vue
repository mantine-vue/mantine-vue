<script setup lang="ts">
import { Code, Text } from '@mantine-vue/core'
import { MaskedDateInput } from '@mantine-vue/dates'

const re = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/

function customPasteSplit(value: string) {
  const match = value.match(re)
  if (!match) {
    return { day: null, month: null, year: null }
  }

  return {
    day: Number(match[1]),
    month: Number(match[2]),
    year: Number(match[3]),
  }
}
</script>

<template>
  <div>
    <MaskedDateInput label="Paste date here" :paste-split="customPasteSplit" />
    <Text mt="md">
      Try pasting a date in DD.MM.YYYY format. For example, try pasting <Code>15.06.2000</Code>
    </Text>
  </div>
</template>
