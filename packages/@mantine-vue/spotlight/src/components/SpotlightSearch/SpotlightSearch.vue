<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Input, useProps } from '@mantine-vue/core'
import { useSpotlightContext } from '../../Spotlight.context'
import { spotlightActions } from '../../spotlight.store'
import { mergeClassNames, mergeStyles } from '../../style-api'
import type { SpotlightSearchEmits, SpotlightSearchProps } from './SpotlightSearch.types'

defineOptions({ name: 'SpotlightSearch', inheritAttrs: false })
const rawProps = withDefaults(defineProps<SpotlightSearchProps>(), { size: 'lg' })
const emit = defineEmits<SpotlightSearchEmits>()
const attrs = useAttrs()
const props = useProps('SpotlightSearch', null, rawProps)
const ctx = useSpotlightContext()
const isComposing = ref(false)
const inputStyles = computed(() => ctx.getStyles('search'))
const forwardedAttrs = computed(() => {
  const value = { ...attrs }
  delete value.onInput
  delete value.onKeydown
  delete value.onCompositionstart
  delete value.onCompositionend
  return value
})

function input(event: Event) {
  const value = (event.currentTarget as HTMLInputElement).value
  ctx.setQuery(value)
  emit('update:modelValue', value)
  emit('change', value)
}

function keydown(event: KeyboardEvent) {
  emit('keydown', event)
  if (isComposing.value) return
  if (event.code === 'ArrowDown') {
    event.preventDefault()
    spotlightActions.selectNextAction(ctx.store)
  }
  if (event.code === 'ArrowUp') {
    event.preventDefault()
    spotlightActions.selectPreviousAction(ctx.store)
  }
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    event.preventDefault()
    spotlightActions.triggerSelectedAction(ctx.store)
  }
}
</script>

<template>
  <Input
    v-bind="forwardedAttrs"
    :size="props.size"
    :value="props.modelValue ?? ctx.query"
    :class-names="mergeClassNames({ input: inputStyles.class }, props.classNames)"
    :styles="mergeStyles({ input: inputStyles.style }, props.styles)"
    :vars="props.vars"
    @input="input"
    @keydown="keydown"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
  />
</template>
