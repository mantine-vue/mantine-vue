import { Autocomplete, Badge, Box, Button, PinInput, ThemeIcon } from '@mantine-vue/core'
import type { BadgeVariant, ButtonVariant, ThemeIconVariant } from '@mantine-vue/core'

type ButtonProps = InstanceType<typeof Button>['$props']
type AutocompleteProps = InstanceType<typeof Autocomplete>['$props']
type BoxPublicProps = InstanceType<typeof Box>['$props']
type BadgeProps = InstanceType<typeof Badge>['$props']
type ThemeIconProps = InstanceType<typeof ThemeIcon>['$props']
type PinInputProps = InstanceType<typeof PinInput>['$props']

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

void buttonProps
void customButtonProps
void customBadgeProps
void customThemeIconProps
void autocompleteProps
void boxProps

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
