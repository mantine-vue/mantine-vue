<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { omitAttrs } from '../../core'
import { Input } from '../Input'
import { useComboboxContext } from './Combobox.context'
import { useComboboxTargetProps } from './use-combobox-target-props/use-combobox-target-props'
import type { ComboboxSearchProps } from './Combobox.types'

defineOptions({
  name: 'ComboboxSearch',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxSearchProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  withAriaAttributes: true,
  withKeyboardNavigation: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const attrs = useAttrs()
const ctx = useComboboxContext()

/**
 * The consumer key and click handlers are passed in rather than left on `attrs`: the
 * combobox navigation has to run around them, not alongside them.
 */
const targetProps = useComboboxTargetProps({
  targetType: 'input',
  withAriaAttributes: props.withAriaAttributes,
  withKeyboardNavigation: props.withKeyboardNavigation,
  // The search field lives inside the dropdown, so it never describes its own expansion.
  withExpandedAttribute: false,
  autoComplete: 'off',
  onKeydown: (attrs as any).onKeydown,
  onClick: (attrs as any).onClick,
})

/**
 * The value handlers are re-emitted rather than forwarded, so `attrs` must not carry
 * them onto `Input` as well. `onKeydown` and `onClick` are already chained by
 * `useComboboxTargetProps`.
 */
const inputAttrs = computed(() =>
  omitAttrs(attrs, ['onUpdate:modelValue', 'onChange', 'onKeydown', 'onClick']),
)

/** `Input` renders a wrapper, so the element the store steers is the inner input. */
function setSearchRef(node: any) {
  const element = node?.$el?.querySelector?.('input') ?? node?.$el ?? node
  ctx.store.searchRef.value = element
}

const searchStyles = computed(() => ctx.getStyles('search'))
</script>

<template>
  <Input
    :ref="setSearchRef"
    v-bind="{ ...inputAttrs, ...targetProps }"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :size="props.size || ctx.size"
    :class="[searchStyles.class, attrs.class]"
    :style="[searchStyles.style, attrs.style]"
    __static-selector="Combobox"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>
