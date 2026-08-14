<script lang="ts">
const defaultProps = { underline: 'hover' } as const
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { useProps } from '../../core'
import { Text } from '../Text'
import type { AnchorOwnProps, AnchorSlots } from './Anchor.types'
import classes from './Anchor.module.css'

defineOptions({ name: 'Anchor', inheritAttrs: false })

const rawProps = withDefaults(defineProps<AnchorOwnProps>(), {
  rootRef: undefined,
  component: 'a',
  underline: undefined,
  unstyled: false,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<AnchorSlots>()

const attrs = useAttrs()
const props = useProps('Anchor', defaultProps, rawProps)

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Text
    v-bind="{ ...attrs, ...props } as any"
    :component="props.component"
    :class="[props.unstyled ? null : classes.root, attrs.class]"
    __static-selector="Anchor"
    :mod="{ underline: props.underline }"
    :rootRef="setRootRef"
  >
    <slot />
  </Text>
</template>
