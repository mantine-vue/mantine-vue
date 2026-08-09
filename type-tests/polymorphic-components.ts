import { defineComponent, h } from 'vue'
import {
  ActionIcon,
  Anchor,
  Avatar,
  BackgroundImage,
  Badge,
  Card,
  Center,
  ColorSwatch,
  Flex,
  Image,
  NavLink,
  Overlay,
  UnstyledButton,
} from '@mantine-vue/core'
import type {
  ActionIconFactory,
  AnchorFactory,
  AvatarFactory,
  BackgroundImageFactory,
  BadgeFactory,
  ButtonFactory,
  CardFactory,
  CenterFactory,
  ColorSwatchFactory,
  ComponentProps,
  FlexFactory,
  ImageFactory,
  NavLinkFactory,
  OverlayFactory,
  UnstyledButtonFactory,
} from '@mantine-vue/core'

/**
 * Coverage for every component migrated to `polymorphicFactory`: no payload or public type has
 * erased to `any` or `{}`, props resolve against the documented default root, and an explicit
 * root is honoured. `polymorphic.ts` holds the full behavioural matrix for `Button`.
 */

type IsAny<T> = 0 extends 1 & T ? true : false
type NotAny<T> = IsAny<T> extends false ? true : false
type NotEmpty<T> = keyof T extends never ? false : true

const factoriesAreNotAny: [
  NotAny<OverlayFactory>,
  NotAny<ActionIconFactory>,
  NotAny<FlexFactory>,
  NotAny<NavLinkFactory>,
  NotAny<AnchorFactory>,
  NotAny<AvatarFactory>,
  NotAny<UnstyledButtonFactory>,
  NotAny<CenterFactory>,
  NotAny<BadgeFactory>,
  NotAny<BackgroundImageFactory>,
  NotAny<CardFactory>,
  NotAny<ColorSwatchFactory>,
  NotAny<ImageFactory>,
  NotAny<ButtonFactory>,
] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true]

const propsAreNotAny: [
  NotAny<ComponentProps<typeof Overlay>>,
  NotAny<ComponentProps<typeof ActionIcon>>,
  NotAny<ComponentProps<typeof Flex>>,
  NotAny<ComponentProps<typeof NavLink>>,
  NotAny<ComponentProps<typeof Anchor>>,
  NotAny<ComponentProps<typeof Avatar>>,
  NotAny<ComponentProps<typeof UnstyledButton>>,
  NotAny<ComponentProps<typeof Center>>,
  NotAny<ComponentProps<typeof Badge>>,
  NotAny<ComponentProps<typeof BackgroundImage>>,
  NotAny<ComponentProps<typeof Card>>,
  NotAny<ComponentProps<typeof ColorSwatch>>,
  NotAny<ComponentProps<typeof Image>>,
] = [true, true, true, true, true, true, true, true, true, true, true, true, true]

const propsAreNotEmpty: [
  NotEmpty<ComponentProps<typeof Overlay>>,
  NotEmpty<ComponentProps<typeof ActionIcon>>,
  NotEmpty<ComponentProps<typeof Flex>>,
  NotEmpty<ComponentProps<typeof NavLink>>,
  NotEmpty<ComponentProps<typeof Anchor>>,
  NotEmpty<ComponentProps<typeof Avatar>>,
  NotEmpty<ComponentProps<typeof UnstyledButton>>,
  NotEmpty<ComponentProps<typeof Center>>,
  NotEmpty<ComponentProps<typeof Badge>>,
  NotEmpty<ComponentProps<typeof BackgroundImage>>,
  NotEmpty<ComponentProps<typeof Card>>,
  NotEmpty<ComponentProps<typeof ColorSwatch>>,
  NotEmpty<ComponentProps<typeof Image>>,
] = [true, true, true, true, true, true, true, true, true, true, true, true, true]

/** `button` roots accept button attributes. */
const actionIconDefault: ComponentProps<typeof ActionIcon> = { type: 'submit', disabled: true }
const unstyledButtonDefault: ComponentProps<typeof UnstyledButton> = { type: 'reset' }

/** `a` roots accept anchor attributes without an explicit `component`. */
const anchorDefault: ComponentProps<typeof Anchor> = { href: '/docs', target: '_blank' }
const navLinkDefault: ComponentProps<typeof NavLink> = { href: '/docs', label: 'Docs' }

/** `div` roots accept div attributes. */
const overlayDefault: ComponentProps<typeof Overlay> = { title: 'overlay' }
const flexDefault: ComponentProps<typeof Flex> = { gap: 'md', wrap: 'nowrap' }
const centerDefault: ComponentProps<typeof Center> = { inline: true }
const badgeDefault: ComponentProps<typeof Badge> = { variant: 'light', radius: 'sm' }
const cardDefault: ComponentProps<typeof Card> = { padding: 'lg', withBorder: true }
const avatarDefault: ComponentProps<typeof Avatar> = { size: 'lg', radius: 'xl' }
const backgroundImageDefault: ComponentProps<typeof BackgroundImage> = { src: '/img.png' }
const colorSwatchDefault: ComponentProps<typeof ColorSwatch> = { color: 'red' }

/** `Image` defaults to an `img` root, so image attributes apply. */
const imageDefault: ComponentProps<typeof Image> = { src: '/img.png', alt: 'An image' }

const RouterLink = defineComponent({ props: { to: { type: String, required: true } } })

const actionIconAsAnchor: ComponentProps<typeof ActionIcon, 'a'> = {
  component: 'a',
  href: '/docs',
  target: '_blank',
}

const badgeAsAnchor: ComponentProps<typeof Badge, 'a'> = { component: 'a', href: '/docs' }
const cardAsAnchor: ComponentProps<typeof Card, 'a'> = { component: 'a', href: '/docs' }
const avatarAsRouterLink: ComponentProps<typeof Avatar, typeof RouterLink> = {
  component: RouterLink,
  to: '/profile',
}
/** `color` is required on ColorSwatch, and stays required on a non-default root. */
const colorSwatchAsButton: ComponentProps<typeof ColorSwatch, 'button'> = {
  component: 'button',
  type: 'button',
  color: 'red',
}

// @ts-expect-error required `color` is missing
const colorSwatchMissingColor: ComponentProps<typeof ColorSwatch> = {}

// @ts-expect-error required `src` is missing
const backgroundImageMissingSrc: ComponentProps<typeof BackgroundImage> = {}

h(Anchor, { href: '/docs' })
h(UnstyledButton<'button'>, { type: 'button' }, () => 'Click')
h(Flex, { gap: 'md' }, () => 'Content')
h(Image, { src: '/img.png', alt: 'An image' })

/**
 * Regression guard: typing `ctx.emit` as the payload's emits map instead of a function makes the
 * component unassignable to `FunctionalComponent`, breaking `h()`. `NavLink` and `Image` are the
 * only components with emits, so nothing else catches it.
 */
h(NavLink, { label: 'Docs', 'onUpdate:opened': (opened: boolean) => void opened })
h(NavLink, { component: 'a', href: '/docs', 'onUpdate:opened': (opened: boolean) => void opened })
h(Image, { src: '/img.png', onError: (event: Event) => void event })

/** Emit handlers are still typed from the payload, via the `onEvent` props. */
const navLinkEmitProps: ComponentProps<typeof NavLink> = {
  'onUpdate:opened': (opened: boolean) => void opened,
}
const imageEmitProps: ComponentProps<typeof Image> = { src: '/i.png', onError: () => {} }

// @ts-expect-error the emit payload is a boolean, not a string
const badNavLinkEmit: ComponentProps<typeof NavLink> = {
  'onUpdate:opened': (opened: string) => void opened,
}

const actionIconGroup = ActionIcon.Group
const actionIconGroupSection = ActionIcon.GroupSection
const avatarGroup = Avatar.Group
const cardSection = Card.Section

/** `classes` is keyed by each payload's `stylesNames`. */
const overlayRoot: string = Overlay.classes.root
const navLinkChevron: string = NavLink.classes.chevron
const cardRoot: string = Card.classes.root
const imageRoot: string = Image.classes.root

/** `varsResolver` is present exactly where the payload declares `vars`. */
const overlayVars = Overlay.varsResolver
const badgeVars = Badge.varsResolver
const imageVars = Image.varsResolver
const anchorVars = Anchor.varsResolver

/** `extend` is validated per component. */
ActionIcon.extend({ defaultProps: { variant: 'light' }, classNames: { root: 'custom' } })
Badge.extend({ defaultProps: { radius: 'sm' } })
Card.extend({ styles: { root: { padding: 8 } } })

/** `withProps` keeps polymorphic inference. */
const LinkAnchor = Anchor.withProps({ component: RouterLink, to: '/docs' })
const IconLink = ActionIcon.withProps({ component: 'a', variant: 'subtle' })

// @ts-expect-error `nope` is not a Badge variant
const badVariant: ComponentProps<typeof Badge> = { variant: 'nope' }

// @ts-expect-error `href` is not a div attribute, and Overlay defaults to a div root
const badOverlayProp: ComponentProps<typeof Overlay> = { href: '/nope' }

// @ts-expect-error `type` is not an anchor attribute
const badAnchorProp: ComponentProps<typeof Anchor> = { type: 'submit' }

// @ts-expect-error `wrap` only accepts flex-wrap values
const badFlexWrap: ComponentProps<typeof Flex> = { wrap: 'sideways' }

// @ts-expect-error required `to` is missing from the RouterLink root
const badAvatarRoot: ComponentProps<typeof Avatar, typeof RouterLink> = { component: RouterLink }

// @ts-expect-error `notAStyleName` is not an ActionIcon style name
const badActionIconClass: string = ActionIcon.classes.notAStyleName

// @ts-expect-error `Section` is a Card static, not a Badge one
const badStatic = Badge.Section

// @ts-expect-error extend validates classNames against the payload's stylesNames
Card.extend({ classNames: { notAStyleName: 'x' } })

export {
  IconLink,
  LinkAnchor,
  actionIconAsAnchor,
  actionIconDefault,
  actionIconGroup,
  actionIconGroupSection,
  anchorDefault,
  anchorVars,
  avatarAsRouterLink,
  avatarDefault,
  avatarGroup,
  backgroundImageDefault,
  backgroundImageMissingSrc,
  badActionIconClass,
  badAnchorProp,
  badNavLinkEmit,
  badAvatarRoot,
  badFlexWrap,
  badOverlayProp,
  badStatic,
  badVariant,
  badgeAsAnchor,
  badgeDefault,
  badgeVars,
  cardAsAnchor,
  cardDefault,
  cardRoot,
  cardSection,
  centerDefault,
  colorSwatchAsButton,
  colorSwatchDefault,
  colorSwatchMissingColor,
  factoriesAreNotAny,
  flexDefault,
  imageDefault,
  imageEmitProps,
  imageRoot,
  imageVars,
  navLinkChevron,
  navLinkDefault,
  navLinkEmitProps,
  overlayDefault,
  overlayRoot,
  overlayVars,
  propsAreNotAny,
  propsAreNotEmpty,
  unstyledButtonDefault,
}
