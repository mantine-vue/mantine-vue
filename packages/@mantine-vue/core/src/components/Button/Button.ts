import {
  defineComponent,
  h,
  ref,
  type CSSProperties,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import {
  Box,
  type BoxProps,
  withBoxProps,
  createVarsResolver,
  getFontSize,
  getRadius,
  getSize,
  MantineSize,
  rem,
  useForwardedRef,
  useProps,
  useStyles,
  MantineRadius,
  type MantineVariant,
  hasNode,
  resolveNode,
} from '../../core'
import { Loader } from '../Loader'
import { Transition, type MantineTransition } from '../Transition'
import { UnstyledButton } from '../UnstyledButton'
import { ButtonGroup } from './ButtonGroup/ButtonGroup'
import { ButtonGroupSection } from './ButtonGroupSection/ButtonGroupSection'
import classes from './Button.module.css'

export type ButtonSize = MantineSize | `compact-${MantineSize}` | (string & {})
export type ButtonVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient'

export interface ButtonSlots {
  default?: () => VNodeChild
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}

export interface ButtonProps extends BoxProps {
  /** Controls button `height`, `font-size` and horizontal `padding` @default 'sm' */
  size?: ButtonSize
  /** Key of `theme.colors` or any valid CSS color @default theme.primaryColor */
  color?: string
  /** Sets `justify-content` of `inner` element @default 'center' */
  justify?: CSSProperties['justifyContent']
  /** Content on the left side of the button label */
  leftSection?: VNodeChild | (() => VNodeChild)
  /** Content on the right side of the button label */
  rightSection?: VNodeChild | (() => VNodeChild)
  /** Sets `width: 100%` @default false */
  fullWidth?: boolean
  /** Key of `theme.radius` or any valid CSS value to set `border-radius` */
  radius?: MantineRadius
  /** Gradient configuration used for `variant="gradient"` */
  gradient?: { from: string; to: string; deg?: number }
  /** Sets `disabled` attribute, applies disabled styles */
  disabled?: boolean
  /** If set, the `Loader` component is displayed over the button */
  loading?: boolean
  /** Props added to the `Loader` component (only visible when `loading` is set) */
  loaderProps?: Record<string, any>
  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean
  /** Component or element used as the root */
  component?: string
  /** Visual variant */
  variant?: MantineVariant<ButtonVariant>
  'data-disabled'?: boolean
  classNames?: Record<string, string> | ((...args: any[]) => Record<string, string>)
  styles?: Record<string, any> | ((...args: any[]) => Record<string, any>)
  vars?: Record<string, any> | ((...args: any[]) => Record<string, any>)
  unstyled?: boolean
}

const loaderTransition: MantineTransition = {
  in: { opacity: 1, transform: `translate(-50%, calc(-50% + ${rem(1)}))` },
  out: { opacity: 0, transform: 'translate(-50%, -200%)' },
  common: { transformOrigin: 'center' },
  transitionProperty: 'opacity, transform',
}

const varsResolver = createVarsResolver<any>(
  (theme, { radius, color, gradient, variant, size, justify, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    })

    const compactSize =
      typeof size === 'string' && size.includes('compact-') ? size.replace('compact-', '') : size

    return {
      root: {
        '--button-justify': justify,
        '--button-height': getSize(size, 'button-height'),
        '--button-padding-x': getSize(size, 'button-padding-x'),
        '--button-fz': getFontSize(compactSize),
        '--button-radius': radius === undefined ? undefined : getRadius(radius),
        '--button-bg': color || variant ? colors.background : undefined,
        '--button-hover': color || variant ? colors.hover : undefined,
        '--button-color': colors.color,
        '--button-bd': color || variant ? colors.border : undefined,
        '--button-hover-color': color || variant ? colors.hoverColor : undefined,
      },
    }
  },
)

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

const ButtonBase = defineComponent({
  name: 'Button',
  inheritAttrs: false,
  slots: Object as SlotsType<ButtonSlots>,
  props: {
    component: { type: String, default: 'button' },
    size: [String, Number] as PropType<ButtonSize>,
    color: { type: String, default: undefined },
    justify: { type: String, default: undefined },
    leftSection: { type: [String, Number, Object, Function], default: undefined },
    rightSection: { type: [String, Number, Object, Function], default: undefined },
    fullWidth: { type: Boolean, default: false },
    radius: [String, Number] as PropType<MantineRadius>,
    gradient: {
      type: Object as PropType<{ from: string; to: string; deg?: number }>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loaderProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    autoContrast: { type: Boolean, default: undefined },
    variant: { type: String as PropType<MantineVariant<ButtonVariant>>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    'data-disabled': { type: Boolean, default: false },
    dataDisabled: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Button', null, rawProps)
    const elementRef = ref<HTMLElement | null>(null)
    useForwardedRef(elementRef)
    const getStyles = useStyles({
      name: 'Button',
      props,
      get className() {
        return attrs.class
      },
      get style() {
        return attrs.style as any
      },
      classes,
      get classNames() {
        return props.classNames as any
      },
      get styles() {
        return props.styles as any
      },
      get unstyled() {
        return props.unstyled
      },
      get vars() {
        return props.vars as any
      },
      varsResolver,
    })

    const renderSection = (content: any, position: 'left' | 'right') =>
      hasNode(content)
        ? h(
            Box,
            {
              component: 'span',
              ...getStyles('section'),
              mod: { position },
            },
            () => renderContent(content),
          )
        : null

    return () => {
      const leftSection = resolveNode(
        props.leftSection as ButtonProps['leftSection'],
        slots.leftSection,
      )
      const rightSection = resolveNode(
        props.rightSection as ButtonProps['rightSection'],
        slots.rightSection,
      )
      const disabled = props.disabled || props.loading
      const dataDisabled =
        disabled || props['data-disabled'] || props.dataDisabled || attrs['data-disabled']

      return h(
        UnstyledButton,
        {
          ...attrs,
          ...getStyles('root', {
            active: !props.disabled && !props.loading && !attrs['data-disabled'],
          }),
          component: props.component,
          unstyled: props.unstyled,
          variant: props.variant,
          disabled,
          mod: [
            {
              disabled: dataDisabled,
              loading: props.loading,
              block: props.fullWidth,
              withLeftSection: hasNode(leftSection),
              withRightSection: hasNode(rightSection),
            },
            props.mod,
          ],
          ref: elementRef,
        },
        () => [
          h(
            Transition,
            { mounted: props.loading, transition: loaderTransition, duration: 150 },
            {
              default: (transitionStyles: any) =>
                props.loading
                  ? h(
                      Box,
                      {
                        component: 'span',
                        ...getStyles('loader', { style: transitionStyles }),
                        'aria-hidden': 'true',
                      },
                      () =>
                        h(Loader, {
                          color: 'var(--button-color)',
                          size: 'calc(var(--button-height) / 1.8)',
                          ...props.loaderProps,
                        }),
                    )
                  : null,
            },
          ),
          h('span', getStyles('inner'), [
            renderSection(leftSection, 'left'),
            h(
              Box,
              {
                component: 'span',
                mod: { loading: props.loading },
                ...getStyles('label'),
              },
              () => slots.default?.(),
            ),
            renderSection(rightSection, 'right'),
          ]),
        ],
      )
    }
  },
})

export const Button = withBoxProps(
  Object.assign(ButtonBase, {
    Group: ButtonGroup,
    GroupSection: ButtonGroupSection,
  }),
)
