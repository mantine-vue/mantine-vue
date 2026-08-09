<script setup lang="ts">
import { useRatingContext } from '../Rating.context'
import { StarIcon } from './StarIcon'
import type { StarSymbolProps } from './StarSymbol.types'

defineOptions({ name: 'StarSymbol' })

const props = defineProps<StarSymbolProps>()

const ctx = useRatingContext()
</script>

<template>
  <StarIcon
    v-bind="ctx.getStyles('starSymbol')"
    :data-filled="props.type === 'full' ? true : undefined"
  />
</template>
