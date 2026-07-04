<script setup lang="ts">
import { ColorsGenerator } from '@/components/ColorsGenerator'
import PageHead from '@/components/PageHead/PageHead.vue'
</script>

<template>
  <PageHead :title="undefined" :description="undefined" />
  <ColorsGenerator />
</template>
