<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import classes from '../Loader.module.css'
defineOptions({ name: 'Dots', inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <Box v-bind="attrs" component="span" :class="[classes.dotsLoader, attrs.class]"
    ><span :class="classes.dot" /><span :class="classes.dot" /><span :class="classes.dot"
  /></Box>
</template>
