import { computed, defineComponent, h, onMounted, reactive, ref, type PropType } from 'vue'
import { useId, useMounted, useUncontrolled } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getThemeColor,
  useMantineTheme,
  useStyles,
} from '../../core'
import { isPrimitive } from '@mantine-vue/utils'
import { FloatingIndicator } from '../FloatingIndicator'
import classes from './SegmentedControl.module.css'

export type SegmentedControlStylesNames =
  | 'root'
  | 'input'
  | 'label'
  | 'control'
  | 'indicator'
  | 'innerLabel'

export interface SegmentedControlItem<Value = string> {
  value: Value
  label: any
  disabled?: boolean
}

const varsResolver = createVarsResolver<any>(
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

function normalizeData(data: Array<any>) {
  return data.map((item) => (isPrimitive(item) ? { label: String(item), value: item } : item))
}

export const SegmentedControl = defineComponent({
  name: 'SegmentedControl',
  inheritAttrs: false,
  props: {
    data: {
      type: Array as PropType<Array<string | number | SegmentedControlItem<string | number>>>,
      required: true,
    },
    value: { type: [String, Number, Boolean] as PropType<any>, default: undefined },
    defaultValue: { type: [String, Number, Boolean] as PropType<any>, default: undefined },
    onChange: { type: Function as PropType<(value: any) => void>, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    fullWidth: { type: Boolean, default: false },
    color: { type: String, default: undefined },
    size: { type: [String, Number] as PropType<string | number>, default: 'sm' },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    transitionDuration: { type: Number, default: undefined },
    transitionTimingFunction: { type: String, default: undefined },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'horizontal' },
    readOnly: { type: Boolean, default: false },
    autoContrast: { type: Boolean, default: undefined },
    withItemsBorders: { type: Boolean, default: true },
    variant: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    const theme = useMantineTheme()
    const uuid = useId(props.name)
    const mounted = useMounted()
    const parent = ref<HTMLElement | null>(null)
    const itemRefs = reactive<Record<string, HTMLElement | null>>({})
    const normalizedData = computed(() => normalizeData(props.data))
    const [value, setValue] = useUncontrolled<any>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue:
        normalizedData.value.find((item) => !item.disabled)?.value ??
        normalizedData.value[0]?.value,
      onChange: (nextValue) => props.onChange?.(nextValue),
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
      if (!uuid.value) {
        uuid.value = `mantine-segmented-control-${Math.random().toString(36).slice(2)}`
      }
    })

    return () => {
      if (normalizedData.value.length === 0) {
        return null
      }

      const activeValue = `${value.value}`

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          component: 'div',
          variant: props.variant,
          ref: (node: any) => {
            parent.value = node?.$el ?? node ?? null
          },
          role: 'radiogroup',
          'data-disabled': props.disabled || undefined,
          mod: [
            {
              'full-width': props.fullWidth,
              orientation: props.orientation,
              initialized: mounted.value,
              'with-items-borders': props.withItemsBorders,
            },
            props.mod,
          ],
        },
        () => [
          value.value !== undefined
            ? h(FloatingIndicator, {
                target: itemRefs[activeValue],
                parent: parent.value,
                component: 'span',
                transitionDuration: 'var(--sc-transition-duration)',
                ...getStyles('indicator'),
              })
            : null,
          ...normalizedData.value.map((item) => {
            const itemValue = `${item.value}`
            const id = `${uuid.value || props.name || 'segmented'}-${itemValue}`
            const itemDisabled = props.disabled || item.disabled
            const active = value.value === item.value

            return h(
              Box,
              {
                key: itemValue,
                ...getStyles('control'),
                component: 'div',
                mod: { active, orientation: props.orientation },
              },
              () => [
                h('input', {
                  ...getStyles('input'),
                  disabled: itemDisabled,
                  type: 'radio',
                  name: uuid.value || props.name,
                  value: itemValue,
                  id,
                  checked: active,
                  'data-focus-ring': theme.value.focusRing,
                  onClick: (event: MouseEvent) => {
                    if (props.readOnly) {
                      event.preventDefault()
                    }
                  },
                  onChange: (event: Event) => {
                    if (props.readOnly) {
                      ;(event.currentTarget as HTMLInputElement).checked = active
                    } else {
                      setValue(item.value)
                    }
                  },
                }),
                h(
                  Box,
                  {
                    component: 'label',
                    htmlFor: id,
                    ...getStyles('label'),
                    ref: (node: any) => {
                      itemRefs[itemValue] = node?.$el ?? node ?? null
                    },
                    mod: {
                      active: active && !itemDisabled,
                      disabled: itemDisabled,
                      'read-only': props.readOnly,
                    },
                  },
                  () => h('span', getStyles('innerLabel'), item.label),
                ),
              ],
            )
          }),
        ],
      )
    }
  },
})

Object.assign(SegmentedControl, { classes, varsResolver })
