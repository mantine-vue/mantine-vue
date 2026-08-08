<script setup lang="ts">
defineOptions({ name: 'ExpandIcon', inheritAttrs: false })
defineProps<{ expanded: boolean }>()
</script>

<template>
  <svg
    v-bind="$attrs"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <template v-if="expanded">
      <path d="M12 13v-8l-3 3m6 0l-3 -3" />
      <path d="M9 17l1 0" />
      <path d="M14 17l1 0" />
      <path d="M19 17l1 0" />
      <path d="M4 17l1 0" />
    </template>
    <template v-else>
      <path d="M12 11v8l3 -3m-6 0l3 3" />
      <path d="M9 7l1 0" />
      <path d="M14 7l1 0" />
      <path d="M19 7l1 0" />
      <path d="M4 7l1 0" />
    </template>
  </svg>
</template>
