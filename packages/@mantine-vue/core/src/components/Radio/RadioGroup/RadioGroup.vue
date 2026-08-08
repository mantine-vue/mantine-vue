<script setup lang="ts">
import { computed, provide, useAttrs, useSlots } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { resolveNode, useProps } from '../../../core'
import { InputWrapper } from '../../Input'
import { InputsGroupFieldset } from '../../../utils'
import { RadioGroupContextKey } from './RadioGroup.context'
import type { RadioGroupOwnProps, RadioGroupSlots } from './RadioGroup.types'

defineOptions({
  name: 'RadioGroup',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<RadioGroupOwnProps>(), {
  label: undefined,
  description: undefined,
  error: undefined,
  readOnly: false,
  disabled: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  change: [value: string | null]
}>()

defineSlots<RadioGroupSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('RadioGroup', null, rawProps)

const name = useId(props.name)

const [value, setValue] = useUncontrolled<string | null>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: '',
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

function handleChange(eventOrValue: Event | string) {
  if (props.readOnly) {
    return
  }

  setValue(
    typeof eventOrValue === 'string'
      ? eventOrValue
      : String((eventOrValue.currentTarget as HTMLInputElement | null)?.value ?? ''),
  )
}

/** Getters keep the provided object reactive without changing the shape consumers read. */
provide(RadioGroupContextKey, {
  get value() {
    return value.value
  },
  onChange: handleChange,
  get size() {
    return props.size
  },
  get name() {
    return name.value || props.name
  },
  get disabled() {
    return props.disabled
  },
})

const label = computed(() => resolveNode(props.label, slots.label))
const description = computed(() => resolveNode(props.description, slots.description))
const error = computed(() => resolveNode(props.error, slots.error))
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
    __static-selector="RadioGroup"
  >
    <InputsGroupFieldset role="radiogroup">
      <slot />
    </InputsGroupFieldset>
  </InputWrapper>
</template>
