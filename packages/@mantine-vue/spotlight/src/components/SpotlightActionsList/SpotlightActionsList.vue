<script setup lang="ts">
import { onBeforeUnmount, onMounted, useAttrs } from 'vue'
import { ScrollAreaAutosize, useProps } from '@mantine-vue/core'
import { useId } from '@mantine-vue/hooks'
import { useSpotlightContext } from '../../Spotlight.context'
import { spotlightActions } from '../../spotlight.store'
import type { SpotlightActionsListProps } from './SpotlightActionsList.types'

defineOptions({ name: 'SpotlightActionsList', inheritAttrs: false })
const rawProps = defineProps<SpotlightActionsListProps>()
const attrs = useAttrs()
const props = useProps('SpotlightActionsList', null, rawProps)
const ctx = useSpotlightContext()
const generatedId = useId()
const listId = props.id || `mantine-${generatedId.value.replace(/:/g, '')}`
onMounted(() => spotlightActions.setListId(listId, ctx.store))
onBeforeUnmount(() => spotlightActions.setListId('', ctx.store))
</script>

<template>
  <ScrollAreaAutosize
    v-bind="{
      ...attrs,
      ...ctx.getStyles('actionsList', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    type="scroll"
    scrollbar-size="var(--spotlight-actions-list-padding)"
    offset-scrollbars="y"
    :id="listId"
  >
    <slot />
  </ScrollAreaAutosize>
</template>
