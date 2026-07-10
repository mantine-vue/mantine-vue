import { defineComponent, h, reactive, type PropType } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, createVarsResolver, getRadius, rem, useProps, useStyles } from '../../core'
import {
  provideAccordionContext,
  type AccordionChevronPosition,
  type AccordionHeadingOrder,
  type AccordionValue,
} from './Accordion.context'
import { AccordionChevron } from './AccordionChevron'
import { AccordionControl } from './AccordionControl/AccordionControl'
import { AccordionItem } from './AccordionItem/AccordionItem'
import { AccordionPanel } from './AccordionPanel/AccordionPanel'
import classes from './Accordion.module.css'

export type AccordionStylesNames =
  | 'root'
  | 'content'
  | 'item'
  | 'panel'
  | 'icon'
  | 'chevron'
  | 'label'
  | 'itemTitle'
  | 'control'

export type AccordionVariant = 'default' | 'contained' | 'filled' | 'separated'

const VALUE_ERROR = 'Accordion.Item component was rendered with invalid value or without value'

const defaultProps = {
  multiple: false,
  loop: true,
  disableChevronRotation: false,
  chevronPosition: 'right',
  variant: 'default',
  chevronSize: 'auto',
  chevronIconSize: 16,
} as const

function getSafeId(prefix: string) {
  return (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(VALUE_ERROR)
    }

    return `${prefix}-${value}`
  }
}

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

const varsResolver = createVarsResolver<any>((_, { transitionDuration, chevronSize, radius }) => ({
  root: {
    '--accordion-transition-duration':
      transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
    '--accordion-chevron-size': chevronSize === undefined ? undefined : rem(chevronSize),
    '--accordion-radius': radius === undefined ? undefined : getRadius(radius),
  },
}))

const AccordionBase = defineComponent({
  name: 'Accordion',
  inheritAttrs: false,
  props: {
    multiple: { type: Boolean, default: undefined },
    value: { type: [String, Array] as PropType<string | string[] | null>, default: undefined },
    defaultValue: {
      type: [String, Array] as PropType<string | string[] | null>,
      default: undefined,
    },
    onChange: {
      type: Function as PropType<(value: AccordionValue<any>) => void>,
      default: undefined,
    },
    id: { type: String, default: undefined },
    loop: { type: Boolean, default: undefined },
    transitionDuration: { type: Number, default: undefined },
    disableChevronRotation: { type: Boolean, default: undefined },
    chevronPosition: { type: String as PropType<AccordionChevronPosition>, default: undefined },
    chevronSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    chevronIconSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    order: { type: Number as PropType<AccordionHeadingOrder>, default: undefined },
    chevron: {
      type: [String, Number, Object, Function, null] as PropType<any>,
      default: undefined,
    },
    variant: { type: String as PropType<AccordionVariant>, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    keepMounted: { type: Boolean, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Accordion', defaultProps, rawProps)
    const uid = useId(props.id)
    const [currentValue, setCurrentValue] = useUncontrolled<string | string[] | null>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: props.multiple ? [] : null,
      onChange: (value) => props.onChange?.(value as any),
    })
    const getStyles = useStyles({
      name: 'Accordion',
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

    const isItemActive = (itemValue: string) =>
      Array.isArray(currentValue.value)
        ? currentValue.value.includes(itemValue)
        : itemValue === currentValue.value

    const handleItemChange = (itemValue: string) => {
      const value = currentValue.value
      const nextValue = Array.isArray(value)
        ? value.includes(itemValue)
          ? value.filter((selectedValue) => selectedValue !== itemValue)
          : [...value, itemValue]
        : itemValue === value
          ? null
          : itemValue

      setCurrentValue(nextValue)
    }

    provideAccordionContext(
      reactive({
        get loop() {
          return props.loop
        },
        get transitionDuration() {
          return props.transitionDuration
        },
        get disableChevronRotation() {
          return props.disableChevronRotation
        },
        get chevronPosition() {
          return props.chevronPosition
        },
        get order() {
          return props.order
        },
        get chevron() {
          return props.chevron === null
            ? null
            : (props.chevron ?? (() => h(AccordionChevron, { size: props.chevronIconSize })))
        },
        onChange: handleItemChange,
        isItemActive,
        get getControlId() {
          return getSafeId(`${uid.value}-control`)
        },
        get getRegionId() {
          return getSafeId(`${uid.value}-panel`)
        },
        getStyles,
        get variant() {
          return props.variant
        },
        get unstyled() {
          return props.unstyled
        },
        get keepMounted() {
          return props.keepMounted
        },
      }) as any,
    )

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          id: uid.value,
          variant: props.variant,
          'data-accordion': true,
        },
        () => renderContent(slots.default),
      )
  },
})

export const Accordion = Object.assign(AccordionBase, {
  classes,
  varsResolver,
  Item: AccordionItem,
  Panel: AccordionPanel,
  Control: AccordionControl,
  Chevron: AccordionChevron,
})
