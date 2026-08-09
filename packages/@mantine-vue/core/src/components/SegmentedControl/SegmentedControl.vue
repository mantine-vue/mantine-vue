<script lang="ts">
import {
  createVarsResolver,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getThemeColor,
} from '../../core'
export const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, transitionDuration, size, transitionTimingFunction, autoContrast }) => ({
    root: {
      '--sc-radius': radius === undefined ? undefined : getRadius(radius),
      '--sc-color': color ? getThemeColor(color, theme) : undefined,
      '--sc-label-color': color ? getContrastColor({ color, theme, autoContrast }) : undefined,
      '--sc-shadow': color ? undefined : 'var(--mantine-shadow-xs)',
      '--sc-transition-duration':
        transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
      '--sc-transition-timing-function': transitionTimingFunction,
      '--sc-padding': getSize(size, 'sc-padding'),
      '--sc-font-size': getFontSize(size),
    },
  }),
)
</script>
<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, useAttrs } from 'vue'
import { useId, useMounted, useUncontrolled } from '@mantine-vue/hooks'
import { isPrimitive } from '@mantine-vue/utils'
import { Box, resolveNode, useMantineTheme, useStyles } from '../../core'
import { FloatingIndicator } from '../FloatingIndicator'
import type { SegmentedControlItem, SegmentedControlOwnProps } from './SegmentedControl.types'
import classes from './SegmentedControl.module.css'
defineOptions({ name: 'SegmentedControl', inheritAttrs: false })
const props = withDefaults(defineProps<SegmentedControlOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
  name: undefined,
  fullWidth: false,
  color: undefined,
  size: 'sm',
  radius: undefined,
  transitionDuration: undefined,
  transitionTimingFunction: undefined,
  orientation: 'horizontal',
  readOnly: false,
  autoContrast: undefined,
  withItemsBorders: true,
  variant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: any]; change: [value: any] }>()
const attrs = useAttrs()
const theme = useMantineTheme()
const uuid = useId(props.name)
const mounted = useMounted()
const parent = ref<HTMLElement | null>(null)
const itemRefs = reactive<Record<string, HTMLElement | null>>({})
const normalizedData = computed(() =>
  props.data.map((item) => (isPrimitive(item) ? { label: String(item), value: item } : item)),
)
const [value, setValue] = useUncontrolled<any>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue:
    normalizedData.value.find((item) => !item.disabled)?.value ?? normalizedData.value[0]?.value,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})
const getStyles = useStyles({
  name: 'SegmentedControl',
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
onMounted(() => {
  if (!uuid.value) uuid.value = `mantine-segmented-control-${Math.random().toString(36).slice(2)}`
})
const setParent = (node: any) => {
  parent.value = node?.$el ?? node ?? null
}
const setItemRef = (key: string, node: any) => {
  itemRefs[key] = node?.$el ?? node ?? null
}
const ItemLabel = (item: SegmentedControlItem<any>) =>
  h('span', getStyles('innerLabel'), resolveNode(item.label) as any)
const handleClick = (event: MouseEvent) => {
  if (props.readOnly) event.preventDefault()
}
const handleChange = (event: Event, item: SegmentedControlItem<any>, active: boolean) => {
  if (props.readOnly) (event.currentTarget as HTMLInputElement).checked = active
  else setValue(item.value)
}
</script>
<template>
  <Box
    v-if="normalizedData.length"
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    component="div"
    :variant="props.variant"
    :ref="setParent"
    role="radiogroup"
    :data-disabled="props.disabled || undefined"
    :mod="[
      {
        'full-width': props.fullWidth,
        orientation: props.orientation,
        initialized: mounted,
        'with-items-borders': props.withItemsBorders,
      },
      props.mod,
    ]"
  >
    <FloatingIndicator
      v-if="value !== undefined"
      :target="itemRefs[String(value)]"
      :parent="parent"
      component="span"
      transition-duration="var(--sc-transition-duration)"
      v-bind="getStyles('indicator')"
    />
    <Box
      v-for="item in normalizedData"
      :key="String(item.value)"
      component="div"
      v-bind="getStyles('control')"
      :mod="{ active: value === item.value, orientation: props.orientation }"
    >
      <input
        v-bind="getStyles('input')"
        :disabled="props.disabled || item.disabled"
        type="radio"
        :name="uuid || props.name"
        :value="String(item.value)"
        :id="`${uuid || props.name || 'segmented'}-${String(item.value)}`"
        :checked="value === item.value"
        :data-focus-ring="theme.focusRing"
        @click="handleClick"
        @change="handleChange($event, item, value === item.value)"
      />
      <Box
        component="label"
        v-bind="getStyles('label')"
        :for="`${uuid || props.name || 'segmented'}-${String(item.value)}`"
        :ref="(node: any) => setItemRef(String(item.value), node)"
        :mod="{
          active: value === item.value && !(props.disabled || item.disabled),
          disabled: props.disabled || item.disabled,
          'read-only': props.readOnly,
        }"
        ><ItemLabel v-bind="item"
      /></Box>
    </Box>
  </Box>
</template>
