import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppTemplate, WhatsAppTemplateValues } from '../../types'

export type WhatsAppTemplatePreviewStylesNames =
  | 'templatePreviewRoot'
  | 'templatePreviewMeta'
  | 'templatePreviewHeader'
  | 'templatePreviewHeaderMedia'
  | 'templatePreviewBody'
  | 'templatePreviewFooter'
  | 'templatePreviewButtons'
  | 'templatePreviewButton'
  | 'templatePreviewFallback'

export interface WhatsAppTemplatePreviewOwnProps extends StylesApiProps<WhatsAppTemplatePreviewFactory> {
  /** Template to preview. */
  template?: WhatsAppTemplate

  /** Values substituted into the placeholders. Unfilled placeholders stay visible. */
  values?: WhatsAppTemplateValues

  /**
   * Text rendered when no `template` is supplied, for history entries whose definition is no
   * longer available.
   */
  fallbackText?: string

  /**
   * Renders the category and language badges above the preview.
   * @default false
   */
  withMeta?: boolean

  /**
   * Renders the template buttons under the body.
   * @default true
   */
  withButtons?: boolean

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppTemplatePreviewProps
  extends Omit<BoxProps, keyof WhatsAppTemplatePreviewOwnProps>, WhatsAppTemplatePreviewOwnProps {}

export type WhatsAppTemplatePreviewFactory = Factory<{
  props: Omit<WhatsAppTemplatePreviewProps, 'rootRef'>
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppTemplatePreviewStylesNames
}>
