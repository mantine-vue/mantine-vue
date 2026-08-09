<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'
defineOptions({ name: 'Bars', inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <Box v-bind="attrs" component="span" :class="[classes.barsLoader, attrs.class]"
    ><span :class="classes.bar" /><span :class="classes.bar" /><span :class="classes.bar"
  /></Box>
</template>
