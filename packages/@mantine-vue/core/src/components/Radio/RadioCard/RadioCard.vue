<script lang="ts">
import { createVarsResolver, getRadius } from '../../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  card: {
    '--card-radius': getRadius(radius),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import { omitAttrs, useStyles } from '../../../core'
import { UnstyledButton } from '../../UnstyledButton'
import { useRadioGroupContext } from '../RadioGroup/RadioGroup'
import { RadioCardContextKey } from './RadioCard.context'
import type { RadioCardOwnProps, RadioCardSlots } from './RadioCard.types'
import classes from './RadioCard.module.css'

defineOptions({
  name: 'RadioCard',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RadioCardOwnProps>(), {
  modelValue: undefined,
  checked: undefined,
  defaultChecked: undefined,
  withBorder: true,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
  'update:checked': [checked: boolean]
  change: [checked: boolean]
}>()

defineSlots<RadioCardSlots>()

const attrs = useAttrs()
const groupContext = useRadioGroupContext()

const [localChecked, setLocalChecked] = useUncontrolled<boolean>({
  value: () => (props.modelValue !== undefined ? props.modelValue : props.checked),
  defaultValue: props.defaultChecked,
  finalValue: false,
  onChange: (checked) => {
    emit('update:modelValue', checked)
    emit('update:checked', checked)
    emit('change', checked)
  },
})

/** Inside a `Radio.Group` the group's single value decides which card is checked. */
const checked = computed(() =>
  groupContext ? groupContext.value === props.value : localChecked.value,
)

const name = computed(() => props.name || groupContext?.name)

const getStyles = useStyles({
  name: 'RadioCard',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

/** Getter keeps the provided object reactive without changing the shape consumers read. */
provide(RadioCardContextKey, {
  get checked() {
    return checked.value
  },
})

const cardStyles = computed(() =>
  getStyles('card', { className: attrs.class, style: attrs.style as any }),
)

function onClick(event: MouseEvent) {
  ;(attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event)
  groupContext?.onChange(props.value || '')
  // A radio cannot be unchecked by clicking it again, so this is always `true`.
  setLocalChecked(true)
}

/**
 * The card installs its own click handler, so the fallthrough one is dropped and
 * invoked explicitly above; otherwise Vue would merge them and fire it twice.
 */
const forwardedAttrs = computed(() => omitAttrs(attrs, ['onClick']))
</script>

<template>
  <UnstyledButton
    v-bind="{ ...forwardedAttrs, ...cardStyles }"
    __static-selector="RadioCard"
    :mod="[{ 'with-border': props.withBorder, checked }, props.mod]"
    role="radio"
    :name="name"
    :aria-checked="checked"
    @click="onClick"
  >
    <slot />
  </UnstyledButton>
</template>
