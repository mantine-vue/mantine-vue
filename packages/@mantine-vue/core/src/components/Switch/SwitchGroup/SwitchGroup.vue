<script lang="ts">
const defaultProps = { hiddenInputValuesSeparator: ',' } as const

export { defaultProps }
</script>

<script setup lang="ts">
import { computed, provide, useAttrs, useSlots } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { resolveNode, useProps } from '../../../core'
import { InputWrapper } from '../../Input'
import { InputsGroupFieldset } from '../../../utils'
import { SwitchGroupContextKey } from './SwitchGroup.context'
import type { SwitchGroupOwnProps, SwitchGroupSlots } from './SwitchGroup.types'

defineOptions({
  name: 'SwitchGroup',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<SwitchGroupOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  readOnly: false,
  disabled: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

defineSlots<SwitchGroupSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('SwitchGroup', defaultProps, rawProps)

const [value, setValue] = useUncontrolled<string[]>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: [],
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

function handleChange(eventOrValue: Event | string) {
  if (props.readOnly) {
    return
  }

  const itemValue =
    typeof eventOrValue === 'string'
      ? eventOrValue
      : String((eventOrValue.currentTarget as HTMLInputElement | null)?.value ?? '')
  const isCurrentlySelected = value.value.includes(itemValue)

  if (
    !isCurrentlySelected &&
    props.maxSelectedValues &&
    value.value.length >= props.maxSelectedValues
  ) {
    return
  }

  setValue(
    isCurrentlySelected
      ? value.value.filter((item) => item !== itemValue)
      : [...value.value, itemValue],
  )
}

function isDisabled(switchValue: string) {
  if (props.disabled) {
    return true
  }

  if (!props.maxSelectedValues) {
    return false
  }

  const isCurrentlySelected = value.value.includes(switchValue)
  const hasReachedLimit = value.value.length >= props.maxSelectedValues
  return !isCurrentlySelected && hasReachedLimit
}

/** Getters keep the provided object reactive without changing the shape consumers read. */
provide(SwitchGroupContextKey, {
  get value() {
    return value.value
  },
  onChange: handleChange,
  get size() {
    return props.size
  },
  isDisabled,
})

const label = computed(() => resolveNode(props.label, slots.label))
const description = computed(() => resolveNode(props.description, slots.description))
const error = computed(() => resolveNode(props.error, slots.error))

const hiddenInputValue = computed(() => value.value.join(props.hiddenInputValuesSeparator))
</script>

<template>
  <InputWrapper
    :size="props.size"
    v-bind="{ ...props.wrapperProps, ...attrs }"
    :label="label"
    :description="description"
    :error="error"
    :class-names="props.classNames"
    :styles="props.styles"
    :vars="props.vars"
    :unstyled="props.unstyled"
    label-element="div"
    __static-selector="SwitchGroup"
  >
    <InputsGroupFieldset role="group">
      <slot />
    </InputsGroupFieldset>

    <input
      type="hidden"
      :name="props.name"
      :value="hiddenInputValue"
      v-bind="props.hiddenInputProps"
    />
  </InputWrapper>
</template>
