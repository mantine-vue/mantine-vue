import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { WhatsAppInboxLabelsOverride } from '../../labels'
import type { WhatsAppAttachment, WhatsAppTemplate, WhatsAppTemplateValues } from '../../types'
import type { WhatsAppTemplatePreviewStylesNames } from '../WhatsAppTemplatePreview'

export type WhatsAppTemplateSelectorStylesNames =
  | 'templateSelectorRoot'
  | 'templateSelectorControls'
  | 'templateSelectorList'
  | 'templateSelectorItem'
  | 'templateSelectorItemName'
  | 'templateSelectorItemMeta'
  | 'templateSelectorItemBody'
  | 'templateSelectorState'
  | 'templateSelectorDetail'
  | 'templateSelectorPreview'
  | 'templateSelectorForm'
  | 'templateSelectorSection'
  | 'templateSelectorSectionTitle'
  | 'templateSelectorFooter'
  | WhatsAppTemplatePreviewStylesNames

/** Payload of the `submit` event. */
export interface WhatsAppTemplateSubmitPayload {
  /** The selected template, definition included. */
  template: WhatsAppTemplate

  /** Values entered for its placeholders, already validated. */
  values: WhatsAppTemplateValues
}

export interface WhatsAppTemplateSelectorSlots {
  /** Replaces the preview shown above the parameter form. */
  templatePreview?: (props: { template: WhatsAppTemplate }) => VNodeChild

  /** Replaces one row of the template list. */
  templateItem?: (props: { template: WhatsAppTemplate; selected: boolean }) => VNodeChild

  /**
   * Control that picks the media for a media header.
   *
   * The extension does not upload anything, so a template whose header expects an image, video
   * or document needs the consumer to supply the picker and hand back a ready attachment.
   */
  headerMedia?: (props: {
    value: WhatsAppAttachment | null
    setValue: (attachment: WhatsAppAttachment | null) => void
    error: string | undefined
  }) => VNodeChild

  /** Replaces the empty state of the list. */
  emptyTemplates?: () => VNodeChild
}

export interface WhatsAppTemplateSelectorOwnProps extends StylesApiProps<WhatsAppTemplateSelectorFactory> {
  /** Templates to offer. Filtering by `query` and `category` happens on this array. */
  templates?: WhatsAppTemplate[]

  /** Whether the template list is loading. */
  loading?: boolean

  /** Failure of the last template load. Renders the error state with a retry action. */
  error?: string | null

  /** Controlled search query. */
  query?: string

  /** Uncontrolled initial search query. */
  defaultQuery?: string

  /** Controlled category filter. `null` means no filter. */
  category?: string | null

  /** Uncontrolled initial category filter. */
  defaultCategory?: string | null

  /** Controlled id of the selected template. `null` shows the list. */
  selectedTemplateId?: string | null

  /** Uncontrolled initial selection. */
  defaultSelectedTemplateId?: string | null

  /** Controlled parameter values of the selected template. */
  values?: WhatsAppTemplateValues

  /**
   * Renders the search field.
   * @default true
   */
  withSearch?: boolean

  /**
   * Renders the category filter, built from the categories present in `templates`.
   * @default true
   */
  withCategoryFilter?: boolean

  /**
   * Renders templates whose status is not `approved` as disabled rows rather than hiding them,
   * so the user can see that a template exists but is not sendable yet.
   * @default true
   */
  withUnavailable?: boolean

  /** Largest height of the scrollable list, any valid CSS length. */
  listMaxHeight?: string | number

  /** Label overrides. */
  labels?: WhatsAppInboxLabelsOverride
}

export interface WhatsAppTemplateSelectorProps
  extends
    Omit<BoxProps, keyof WhatsAppTemplateSelectorOwnProps>,
    WhatsAppTemplateSelectorOwnProps {}

export interface WhatsAppTemplateSelectorEmits {
  /** Emitted when the search query changes. */
  'update:query': [query: string]

  /** Emitted when the category filter changes. */
  'update:category': [category: string | null]

  /** Emitted when the selected template changes. */
  'update:selectedTemplateId': [templateId: string | null]

  /** Emitted when a parameter value changes. */
  'update:values': [values: WhatsAppTemplateValues]

  /** Emitted when a template is picked from the list. */
  select: [template: WhatsAppTemplate]

  /** Emitted when the completed template passes validation and should be sent. */
  submit: [payload: WhatsAppTemplateSubmitPayload]

  /** Emitted when the retry action of the error state is used. */
  retryLoad: []
}

export type WhatsAppTemplateSelectorFactory = Factory<{
  props: Omit<WhatsAppTemplateSelectorProps, 'rootRef'>
  slots: WhatsAppTemplateSelectorSlots
  emits: WhatsAppTemplateSelectorEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: WhatsAppTemplateSelectorStylesNames
}>
