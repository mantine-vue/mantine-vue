import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  PinInput,
  Stack,
  ThemeIcon,
} from '@mantine-vue/core'
import type {
  ActionIconProps,
  AlignItems,
  BadgeVariant,
  ButtonVariant,
  FlexWrap,
  JustifyContent,
  MantineColor,
  MantineRadius,
  MantineSpacing,
  PaperProps,
  TableProps,
  TableThProps,
  TextInputProps,
  ThemeIconVariant,
} from '@mantine-vue/core'
import { ContextMenuProvider } from '@mantine-vue/contextmenu'
import type {
  ContextMenuItemOptions,
  ContextMenuOptions,
  ContextMenuProviderProps,
  ShowContextMenuFunction,
} from '@mantine-vue/contextmenu'

type ButtonProps = InstanceType<typeof Button>['$props']
type AutocompleteProps = InstanceType<typeof Autocomplete>['$props']
type BoxPublicProps = InstanceType<typeof Box>['$props']
type BadgeProps = InstanceType<typeof Badge>['$props']
type ThemeIconProps = InstanceType<typeof ThemeIcon>['$props']
type PinInputProps = InstanceType<typeof PinInput>['$props']
type AvatarProps = InstanceType<typeof Avatar>['$props']
type GroupProps = InstanceType<typeof Group>['$props']
type StackProps = InstanceType<typeof Stack>['$props']
type ContextMenuProviderPublicProps = InstanceType<typeof ContextMenuProvider>['$props']

const buttonProps: ButtonProps = { variant: 'filled', size: 'sm', fullWidth: true }
const customButtonProps: ButtonProps = { variant: 'danger' }
const customBadgeProps: BadgeProps = { variant: 'danger' }
const customThemeIconProps: ThemeIconProps = { variant: 'danger' }
const autocompleteProps: AutocompleteProps = {
  modelValue: 'Vue',
  'onUpdate:modelValue': (value: string) => value.toUpperCase(),
}
const boxProps: BoxPublicProps = {
  my: 'xl',
  bg: 'red.5',
  mx: { base: 'xs', md: 24 },
  pos: 'relative',
}
const badgeThemeProps: BadgeProps = {
  size: 'xl',
  radius: 'md',
  color: 'blue.6',
}
const avatarThemeProps: AvatarProps = {
  size: 42,
  radius: 'xl',
  color: 'initials',
  allowedInitialsColors: ['blue', 'red.6'],
}
const groupStyleProps: GroupProps = {
  align: 'baseline',
  gap: 'lg',
  justify: 'space-between',
  wrap: 'nowrap',
}
const stackStyleProps: StackProps = {
  align: 'center',
  gap: 12,
  justify: 'flex-end',
}
const alignItems: AlignItems = 'stretch'
const justifyContent: JustifyContent = 'space-around'
const flexWrap: FlexWrap = 'wrap-reverse'
const color: MantineColor = 'violet.7'
const radius: MantineRadius = 'md'
const spacing: MantineSpacing = 'xl'
const actionIconNamedProps: ActionIconProps = { color: 'blue.6', radius: 'md', size: 'sm' }
const paperNamedProps: PaperProps = { radius: 'lg', shadow: 'sm', withBorder: true }
const tableNamedProps: TableProps = { layout: 'fixed', striped: 'odd', withTableBorder: true }
const tableThNamedProps: TableThProps = { className: 'header-cell' }
const textInputNamedProps: TextInputProps = {}
const contextMenuProviderProps: ContextMenuProviderProps = {
  shadow: 'sm',
  borderRadius: 'xs',
  submenuDelay: 500,
  repositionOnRepeat: true,
}
const contextMenuProviderPublicProps: ContextMenuProviderPublicProps = {
  zIndex: 9999,
  borderRadius: 4,
}
const contextMenuOptions: ContextMenuOptions = {
  classNames: { root: 'menu', item: 'item', divider: 'divider' },
  styles: (theme) => ({ root: { color: theme.colors.blue[6] } }),
}
const contextMenuItems: ContextMenuItemOptions[] = [
  { key: 'copy', color: 'blue.6', onClick: () => undefined },
  { key: 'more', items: [{ key: 'nested', onClick: () => undefined }] },
  { key: 'divider' },
]
const showContextMenu: ShowContextMenuFunction = (content, options) => (event) => {
  void content
  void options
  event.preventDefault()
}

void buttonProps
void customButtonProps
void customBadgeProps
void customThemeIconProps
void autocompleteProps
void boxProps
void badgeThemeProps
void avatarThemeProps
void groupStyleProps
void stackStyleProps
void alignItems
void justifyContent
void flexWrap
void color
void radius
void spacing
void actionIconNamedProps
void paperNamedProps
void tableNamedProps
void tableThNamedProps
void textInputNamedProps
void contextMenuProviderProps
void contextMenuProviderPublicProps
void contextMenuOptions
void contextMenuItems
void showContextMenu

// @ts-expect-error Box spacing props do not accept booleans.
const invalidBoxProps: BoxPublicProps = { my: true }
void invalidBoxProps

// Exported named variant types remain closed unions for editor autocomplete.
// @ts-expect-error Custom variants are accepted by component props, not built-in variant aliases.
const invalidButtonVariant: ButtonVariant = 'danger'
// @ts-expect-error Custom variants are accepted by component props, not built-in variant aliases.
const invalidBadgeVariant: BadgeVariant = 'danger'
// @ts-expect-error Custom variants are accepted by component props, not built-in variant aliases.
const invalidThemeIconVariant: ThemeIconVariant = 'danger'
void invalidButtonVariant
void invalidBadgeVariant
void invalidThemeIconVariant

// @ts-expect-error PinInput inputMode matches the HTML inputmode attribute.
const invalidPinInputProps: PinInputProps = { inputMode: 'not-an-input-mode' }
void invalidPinInputProps

// @ts-expect-error Badge size follows React Mantine and does not accept numbers.
const invalidBadgeSize: BadgeProps = { size: 12 }
// @ts-expect-error FlexWrap only accepts valid CSS flex-wrap values.
const invalidGroupWrap: FlexWrap = 'reverse'
void invalidBadgeSize
void invalidGroupWrap

// @ts-expect-error Context menu entries cannot be both actions and submenus.
const invalidContextMenuItem: ContextMenuItemOptions = {
  key: 'invalid',
  onClick: () => undefined,
  items: [],
}
void invalidContextMenuItem
