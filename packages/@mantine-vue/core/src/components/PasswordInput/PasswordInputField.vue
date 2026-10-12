<script setup lang="ts">
import { useAttrs } from 'vue'
import { useInputWrapperContext } from '../Input/InputWrapper.context'

defineOptions({ name: 'PasswordInputField', inheritAttrs: false })

const attrs = useAttrs()
const context = useInputWrapperContext()
</script>

<template>
  <input v-bind="attrs" :aria-describedby="context.describedBy" />
</template>
