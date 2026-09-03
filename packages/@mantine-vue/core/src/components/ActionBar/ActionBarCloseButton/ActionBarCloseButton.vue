<script setup lang="ts">
import { useAttrs } from 'vue'
import { CloseButton } from '../../CloseButton'
import { useActionBarContext } from '../ActionBar.context'

defineOptions({ name: 'ActionBarCloseButton', inheritAttrs: false })
const props = defineProps<{ unstyled?: boolean }>()
const attrs = useAttrs()
const ctx = useActionBarContext()
</script>

<template>
  <CloseButton
    v-bind="{ ...attrs, ...ctx.getStyles('closeButton'), ...props }"
    :unstyled="props.unstyled ?? ctx.unstyled"
    @click="ctx.close"
  />
</template>
