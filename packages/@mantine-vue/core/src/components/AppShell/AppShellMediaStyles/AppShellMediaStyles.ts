import { defineComponent, h, type PropType } from 'vue'
import { InlineStyles, useMantineContext, useMantineTheme } from '../../../core'
import type {
  AppShellAsideConfiguration,
  AppShellFooterConfiguration,
  AppShellHeaderConfiguration,
  AppShellNavbarConfiguration,
  AppShellResponsiveSize,
  AppShellSize,
} from '../AppShell.types'
import { getVariables } from './get-variables'
export const AppShellMediaStyles = defineComponent({
  name: 'AppShellMediaStyles',
  props: {
    navbar: Object as PropType<AppShellNavbarConfiguration>,
    aside: Object as PropType<AppShellAsideConfiguration>,
    header: Object as PropType<AppShellHeaderConfiguration>,
    footer: Object as PropType<AppShellFooterConfiguration>,
    padding: [String, Number, Object] as PropType<AppShellSize | AppShellResponsiveSize>,
    mode: { type: String as PropType<'fixed' | 'static'>, required: true },
    selector: String,
  },
  setup(props) {
    const theme = useMantineTheme()
    const ctx = useMantineContext()
    return () => {
      const values = getVariables({ ...props, theme: theme.value })
      return h(InlineStyles, {
        selector: props.selector || ctx.cssVariablesSelector,
        styles: values.baseStyles,
        media: values.media,
      })
    }
  },
})
