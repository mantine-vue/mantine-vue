import { defineComponent, h, ref } from 'vue'
import { Button } from '@mantine-vue/core'
import type {
  ButtonFactory,
  ComponentProps,
  MantinePolymorphicComponent,
  PolymorphicRef,
} from '@mantine-vue/core'

/**
 * Type tests for the polymorphic factory in `.ts` positions; template equivalents live in
 * `Polymorphic.vue`. `ComponentProps<typeof X, Root>` resolves against an explicit root.
 */

const RouterLink = defineComponent({
  props: {
    to: { type: String, required: true },
    replace: { type: Boolean, default: false },
  },
})

type ButtonDefaultProps = ComponentProps<typeof Button>
type ButtonAnchorProps = ComponentProps<typeof Button, 'a'>
type ButtonRouterProps = ComponentProps<typeof Button, typeof RouterLink>

const defaultRootProps: ButtonDefaultProps = {
  type: 'submit',
  disabled: true,
}

const mantineProps: ButtonDefaultProps = {
  variant: 'filled',
  size: 'sm',
  fullWidth: true,
  loading: true,
}

/** Style props reach the component through `BoxProps` in the payload, with no cast. */
const styleProps: ButtonDefaultProps = {
  mt: 'md',
  bg: 'red.5',
  mx: { base: 'xs', md: 24 },
}

const anchorProps: ButtonAnchorProps = {
  component: 'a',
  href: '/docs',
  target: '_blank',
  rel: 'noreferrer',
}

/** Mantine props still apply on a non-default root. */
const anchorWithMantineProps: ButtonAnchorProps = {
  component: 'a',
  href: '/docs',
  variant: 'subtle',
  mt: 'md',
}

const routerProps: ButtonRouterProps = {
  component: RouterLink,
  to: '/docs',
  replace: true,
  variant: 'subtle',
}

/** Mantine props need no pin: open unions absorb the widened `string` a literal infers to. */
h(Button, { variant: 'filled', mt: 'md' }, { default: () => 'Label' })
h(Button, { component: 'a', href: '/docs', target: '_blank' })
h(Button, { component: RouterLink, to: '/docs' })

/**
 * Closed literal unions need the root pinned: `h` infers its props type from the argument and
 * widens `'submit'` to `string`. Templates are unaffected. See the polymorphic guide.
 */
h(Button<'button'>, { type: 'submit', mt: 'md' }, { default: () => 'Submit' })

/** Applies to nested closed CSS unions too, not just DOM attributes. */
h(Button<'button'>, { style: { pointerEvents: 'all' } }, { default: () => 'Pinned' })

/** Open CSS properties carry a `(string & {})` member, so they need no pin. */
h(Button, { style: { borderRadius: '999px', color: 'red' } })

// @ts-expect-error pinning preserves checking: 'nope' is not a valid button type
h(Button<'button'>, { type: 'nope' })

// @ts-expect-error unpinned closed unions are the error this idiom exists to avoid
h(Button, { type: 'submit' })

const buttonElement: PolymorphicRef<'button'> = document.createElement('button')
const anchorElement: PolymorphicRef<'a'> = document.createElement('a')

/** A ref object may be passed directly outside templates, where Vue does not unwrap it. */
const buttonRef = ref<HTMLButtonElement | null>(null)
h(Button, { rootRef: buttonRef })

/** `classes` is keyed by the payload's `stylesNames`. */
const rootClass: string = Button.classes.root
const labelClass: string = Button.classes.label

/** `varsResolver` is present because the payload declares `vars`. */
const varsResolver = Button.varsResolver

/** Compound components are typed statics. */
const group = Button.Group
const groupSection = Button.GroupSection

/** `extend` accepts MantineProvider component metadata. */
Button.extend({
  defaultProps: { variant: 'light' },
  classNames: { root: 'custom-root' },
  styles: { root: { fontWeight: 600 } },
  vars: () => ({ root: { '--button-height': '40px' } }),
})

/**
 * `classNames`/`styles` on the component's own props are keyed by `stylesNames`, because
 * `ButtonOwnProps` extends `StylesApiProps<ButtonFactory>` rather than a props type.
 */
const keyedClassNames: ButtonDefaultProps = { classNames: { root: 'r', label: 'l' } }
const keyedStyles: ButtonDefaultProps = { styles: { root: { fontWeight: 600 } } }
const keyedClassNamesFn: ButtonDefaultProps = { classNames: () => ({ root: 'r' }) }

// @ts-expect-error `notAStyleName` is not a Button style name
const invalidClassNamesKey: ButtonDefaultProps = { classNames: { notAStyleName: 'x' } }

// @ts-expect-error `notAStyleName` is not a Button style name
const invalidStylesKey: ButtonDefaultProps = { styles: { notAStyleName: {} } }

/** `withProps` keeps polymorphic behaviour and the target's props. */
const LinkButton = Button.withProps({ component: RouterLink, variant: 'subtle', to: '/docs' })
const AnchorButton = Button.withProps({ component: 'a', variant: 'subtle' })

type IsAny<T> = 0 extends 1 & T ? true : false

type ButtonPublicType = typeof Button

const isPolymorphic: ButtonPublicType extends MantinePolymorphicComponent<ButtonFactory>
  ? true
  : false = true

/** Guards the failure mode where props resolve at the generic's constraint and become `any`. */
const componentIsNotAny: IsAny<ButtonPublicType> extends false ? true : false = true
const propsAreNotAny: IsAny<ButtonDefaultProps> extends false ? true : false = true
const anchorPropsAreNotAny: IsAny<ButtonAnchorProps> extends false ? true : false = true

/** Guards against declarations emitting erased `{}` props. */
const propsAreNotEmpty: keyof ButtonDefaultProps extends never ? false : true = true

/** The payload itself must not be `any`. */
const factoryIsNotAny: IsAny<ButtonFactory> extends false ? true : false = true

/**
 * `variant` is `MantineVariant<ButtonVariant>` = `ButtonVariant | (string & {})`, so a custom
 * variant is intentionally allowed -- `public-api.ts` asserts the same. Only the wrong *kind* of
 * value is rejected.
 */
const customVariant: ButtonDefaultProps = { variant: 'danger' }

// @ts-expect-error `variant` is a string, not a number
const invalidVariant: ButtonDefaultProps = { variant: 123 }

// @ts-expect-error `fullWidth` is a boolean
const invalidPropType: ButtonDefaultProps = { fullWidth: 'yes' }

// @ts-expect-error `href` is not an attribute of the default `button` root
const invalidIntrinsicProp: ButtonDefaultProps = { href: '/nope' }

// @ts-expect-error `target` belongs to an anchor, not a button
const invalidIntrinsicProp2: ButtonDefaultProps = { target: '_blank' }

// @ts-expect-error `bogus` is not a known prop
const unknownProp: ButtonDefaultProps = { bogus: true }

// @ts-expect-error a style prop value must be a spacing value, not a boolean
const invalidStyleProp: ButtonDefaultProps = { mt: { base: true } }

// @ts-expect-error `href` must be a string
const invalidAnchorPropType: ButtonAnchorProps = { component: 'a', href: 123 }

// @ts-expect-error required `to` is missing from the RouterLink root
const missingRequiredProp: ButtonRouterProps = { component: RouterLink }

// @ts-expect-error `to` is not an anchor attribute
const wrongRootProp: ButtonAnchorProps = { component: 'a', to: '/docs' }

// @ts-expect-error a button root ref is not an anchor element
const invalidRefType: PolymorphicRef<'button'> = document.createElement('a')

// @ts-expect-error `extend` rejects unknown metadata keys
Button.extend({ notAThing: true })

// @ts-expect-error `extend` validates defaultProps against the component's props
Button.extend({ defaultProps: { fullWidth: 'yes' } })

// @ts-expect-error `extend` validates classNames against the component's stylesNames
Button.extend({ classNames: { notAStyleName: 'x' } })

// @ts-expect-error `withProps` validates the fixed props it is given
const invalidWithProps = Button.withProps({ fullWidth: 'yes' })

// @ts-expect-error `classes` is keyed by stylesNames
const invalidClassName: string = Button.classes.notAStyleName

export type { ButtonAnchorProps, ButtonDefaultProps, ButtonPublicType, ButtonRouterProps }

export {
  customVariant,
  keyedClassNamesFn,
  keyedStyles,
  keyedClassNames,
  invalidStylesKey,
  invalidClassNamesKey,
  AnchorButton,
  LinkButton,
  anchorElement,
  anchorProps,
  anchorPropsAreNotAny,
  anchorWithMantineProps,
  buttonElement,
  buttonRef,
  componentIsNotAny,
  defaultRootProps,
  factoryIsNotAny,
  group,
  groupSection,
  invalidAnchorPropType,
  invalidClassName,
  invalidIntrinsicProp,
  invalidIntrinsicProp2,
  invalidPropType,
  invalidRefType,
  invalidStyleProp,
  invalidVariant,
  invalidWithProps,
  isPolymorphic,
  labelClass,
  mantineProps,
  missingRequiredProp,
  propsAreNotAny,
  propsAreNotEmpty,
  rootClass,
  routerProps,
  styleProps,
  unknownProp,
  varsResolver,
  wrongRootProp,
}
