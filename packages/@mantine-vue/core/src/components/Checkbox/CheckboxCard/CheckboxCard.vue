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
import { useCheckboxGroupContext } from '../CheckboxGroup/CheckboxGroup'
import { CheckboxCardContextKey } from './CheckboxCard.context'
import type { CheckboxCardOwnProps, CheckboxCardSlots } from './CheckboxCard.types'
import classes from './CheckboxCard.module.css'

defineOptions({
  name: 'CheckboxCard',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CheckboxCardOwnProps>(), {
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

defineSlots<CheckboxCardSlots>()

const attrs = useAttrs()
const groupContext = useCheckboxGroupContext()

const [checked, setChecked] = useUncontrolled<boolean>({
  value: () =>
    typeof props.modelValue === 'boolean'
      ? props.modelValue
      : typeof props.checked === 'boolean'
        ? props.checked
        : groupContext
          ? groupContext.value.includes(props.value || '')
          : undefined,
  defaultValue: props.defaultChecked,
  finalValue: false,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('update:checked', nextValue)
    emit('change', nextValue)
  },
})

const getStyles = useStyles({
  name: 'CheckboxCard',
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
provide(CheckboxCardContextKey, {
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
  setChecked(!checked.value)
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
    __static-selector="CheckboxCard"
    :mod="[{ 'with-border': props.withBorder, checked }, props.mod]"
    role="checkbox"
    :aria-checked="checked"
    @click="onClick"
  >
    <slot />
  </UnstyledButton>
</template>
