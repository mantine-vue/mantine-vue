<script setup lang="ts">
import { ColorsGenerator } from '@/components/ColorsGenerator'
import PageHead from '@/components/PageHead/PageHead.vue'
</script>

<template>
  <PageHead
    title="Colors generator"
    description="Generate accessible color palettes for your Mantine Vue theme."
  />
  <ColorsGenerator />
</template>
