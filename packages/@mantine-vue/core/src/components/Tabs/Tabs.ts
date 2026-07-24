import { defineComponent, h, type PropType } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
  useProps,
  useStyles,
  type MantineColor,
  type MantineRadius,
} from '../../core'
import { provideTabsContext } from './Tabs.context'
import { TabsList } from './TabsList/TabsList'
import { TabsPanel } from './TabsPanel/TabsPanel'
import { TabsTab } from './TabsTab/TabsTab'
import classes from './Tabs.module.css'

export type TabsStylesNames = 'root' | 'list' | 'panel' | 'tab' | 'tabSection' | 'tabLabel'
export type TabsVariant = 'default' | 'outline' | 'pills'

const VALUE_ERROR =
  'Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value'

const defaultProps = {
  keepMounted: true,
  keepMountedMode: 'activity',
  orientation: 'horizontal',
  loop: true,
  activateTabWithKeyboard: true,
  variant: 'default',
  placement: 'left',
} as const

function getSafeId(prefix: string) {
  return (value: string) => {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error(VALUE_ERROR)
    }

    return `${prefix}-${value}`
  }
}

const varsResolver = createVarsResolver<any>((theme, { radius, color, autoContrast }) => ({
  root: {
    '--tabs-radius': getRadius(radius),
    '--tabs-color': getThemeColor(color, theme),
    '--tabs-text-color': getAutoContrastValue(autoContrast, theme)
      ? getContrastColor({ color, theme, autoContrast })
      : undefined,
  },
}))

const TabsBase = defineComponent({
  name: 'Tabs',
  inheritAttrs: false,
  props: {
    defaultValue: { type: String as PropType<string | null>, default: undefined },
    value: { type: String as PropType<string | null>, default: undefined },
    onChange: { type: Function as PropType<(value: string | null) => void>, default: undefined },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: undefined },
    placement: { type: String as PropType<'left' | 'right'>, default: undefined },
    id: { type: String, default: undefined },
    loop: { type: Boolean, default: undefined },
    activateTabWithKeyboard: { type: Boolean, default: undefined },
    allowTabDeactivation: { type: Boolean, default: false },
    variant: { type: String as PropType<TabsVariant>, default: undefined },
    color: { type: String as PropType<MantineColor>, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    inverted: { type: Boolean, default: false },
    keepMounted: { type: Boolean, default: undefined },
    keepMountedMode: { type: String as PropType<'activity' | 'display-none'>, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Tabs', defaultProps, rawProps)
    const uid = useId(props.id)
    const [currentTab, setCurrentTab] = useUncontrolled<string | null>({
      value: () => props.value,
      defaultValue: props.defaultValue,
      finalValue: null,
      onChange: (value) => props.onChange?.(value),
    })
    const getStyles = useStyles({
      name: 'Tabs',
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

    provideTabsContext({
      id: uid.value,
      get orientation() {
        return props.orientation
      },
      get loop() {
        return props.loop
      },
      get activateTabWithKeyboard() {
        return props.activateTabWithKeyboard
      },
      get allowTabDeactivation() {
        return props.allowTabDeactivation
      },
      get variant() {
        return props.variant
      },
      get color() {
        return props.color
      },
      get radius() {
        return props.radius
      },
      get inverted() {
        return props.inverted
      },
      get keepMounted() {
        return props.keepMounted
      },
      get keepMountedMode() {
        return props.keepMountedMode
      },
      get placement() {
        return props.placement
      },
      get unstyled() {
        return props.unstyled
      },
      getStyles,
      get value() {
        return currentTab.value
      },
      onChange: setCurrentTab,
      getTabId: getSafeId(`${uid.value}-tab`),
      getPanelId: getSafeId(`${uid.value}-panel`),
    } as any)

    return () =>
      h(
        Box,
        {
          ...attrs,
          id: uid.value,
          variant: props.variant,
          mod: [
            {
              orientation: props.orientation,
              inverted: props.orientation === 'horizontal' && props.inverted,
              placement: props.orientation === 'vertical' && props.placement,
            },
            props.mod,
          ],
          ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
        },
        () => slots.default?.(),
      )
  },
})

export const Tabs = Object.assign(TabsBase, {
  classes,
  varsResolver,
  Tab: TabsTab,
  Panel: TabsPanel,
  List: TabsList,
})
