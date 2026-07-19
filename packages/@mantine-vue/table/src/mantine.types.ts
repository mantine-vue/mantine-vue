/**
 * Mantine component prop-type bridge.
 *
 */
import {
  type AutocompleteProps,
  type BoxProps,
  type ModalProps,
  type MultiSelectProps,
  type SelectProps,
} from '@mantine-vue/core'

export type { AutocompleteProps, BoxProps, ModalProps, MultiSelectProps, SelectProps }

/** Permissive stand-in for a Mantine Vue component's props (Box props + passthrough attributes). */
type MantineComponentProps = BoxProps & Record<string, any>

export type ActionIconProps = MantineComponentProps
export type AlertProps = MantineComponentProps
export type BadgeProps = MantineComponentProps
export type CheckboxProps = MantineComponentProps
export type HighlightProps = MantineComponentProps
export type LoadingOverlayProps = MantineComponentProps
export type PaginationProps = MantineComponentProps
export type PaperProps = MantineComponentProps
export type ProgressProps = MantineComponentProps
export type RadioProps = MantineComponentProps
export type RangeSliderProps = MantineComponentProps
export type SkeletonProps = MantineComponentProps
export type SwitchProps = MantineComponentProps
export type TextInputProps = MantineComponentProps
export type UnstyledButtonProps = MantineComponentProps

export type TableProps = MantineComponentProps
export type TableTbodyProps = MantineComponentProps
export type TableTdProps = MantineComponentProps
export type TableTfootProps = MantineComponentProps
export type TableTheadProps = MantineComponentProps
export type TableThProps = MantineComponentProps
export type TableTrProps = MantineComponentProps

/** From `@mantine-vue/dates` not yet exported as a named interface. */
export type DateInputProps = MantineComponentProps
