<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'
defineOptions({ name: 'Oval', inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <Box v-bind="attrs" component="span" :class="[classes.ovalLoader, attrs.class]" />
</template>
