import type { WhatsAppInboxLabels } from '../labels'
import { DEFAULT_WHATSAPP_INBOX_LABELS } from '../labels'
import type {
  WhatsAppTemplate,
  WhatsAppTemplateBodyComponent,
  WhatsAppTemplateButton,
  WhatsAppTemplateButtonsComponent,
  WhatsAppTemplateFooterComponent,
  WhatsAppTemplateHeaderComponent,
  WhatsAppTemplateParameter,
  WhatsAppTemplateValues,
} from '../types'

/** Matches `{{1}}` and `{{customer_name}}` placeholders. */
const PLACEHOLDER_PATTERN = /\{\{\s*([\w.-]+)\s*\}\}/g

/** Placeholder keys used in a piece of template text, in order and without duplicates. */
export function extractPlaceholders(text: string | undefined): string[] {
  if (!text) {
    return []
  }

  const keys: string[] = []

  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    const key = match[1]

    if (!keys.includes(key)) {
      keys.push(key)
    }
  }

  return keys
}

export function getTemplateHeader(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateHeaderComponent | undefined {
  return template?.components.find((component) => component.type === 'header')
}

export function getTemplateBody(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateBodyComponent | undefined {
  return template?.components.find((component) => component.type === 'body')
}

export function getTemplateFooter(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateFooterComponent | undefined {
  return template?.components.find((component) => component.type === 'footer')
}

export function getTemplateButtons(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateButtonsComponent | undefined {
  return template?.components.find((component) => component.type === 'buttons')
}

/**
 * Declared parameters, or parameters derived from the placeholders in `text`.
 *
 * Backends normalize templates differently: some ship an explicit parameter list, others only
 * the raw text. Deriving the missing case means the parameter form works either way.
 */
function resolveParameters(
  declared: WhatsAppTemplateParameter[] | undefined,
  text: string | undefined,
): WhatsAppTemplateParameter[] {
  if (declared && declared.length > 0) {
    return declared
  }

  return extractPlaceholders(text).map((key) => ({ key, type: 'text', required: true }))
}

/** Placeholders of one template button, together with the button and its index. */
export interface WhatsAppTemplateButtonParameters {
  index: number
  button: WhatsAppTemplateButton
  parameters: WhatsAppTemplateParameter[]
}

/** Everything the parameter form needs to know about a template. */
export interface WhatsAppTemplateParameters {
  header: WhatsAppTemplateParameter[]
  body: WhatsAppTemplateParameter[]
  buttons: WhatsAppTemplateButtonParameters[]

  /** Header format, or `undefined` when the template has no header. */
  headerFormat: WhatsAppTemplateHeaderComponent['format'] | undefined

  /** Whether the header expects a media file rather than text. */
  requiresHeaderMedia: boolean

  /** Whether the template needs any input at all. */
  hasParameters: boolean
}

/** Collects every placeholder a template declares, grouped by the section it belongs to. */
export function getTemplateParameters(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateParameters {
  const header = getTemplateHeader(template)
  const body = getTemplateBody(template)
  const buttons = getTemplateButtons(template)

  const headerFormat = header ? (header.format ?? 'text') : undefined
  const requiresHeaderMedia =
    headerFormat === 'image' || headerFormat === 'video' || headerFormat === 'document'

  const headerParameters = requiresHeaderMedia
    ? []
    : resolveParameters(header?.parameters, header?.text)

  const buttonParameters: WhatsAppTemplateButtonParameters[] = (buttons?.buttons ?? [])
    .map((button, index) => ({
      index,
      button,
      parameters:
        button.type === 'url'
          ? resolveParameters(button.parameters, button.url)
          : button.type === 'copy_code'
            ? resolveParameters(button.parameters, undefined)
            : [],
    }))
    .filter((entry) => entry.parameters.length > 0)

  const bodyParameters = resolveParameters(body?.parameters, body?.text)

  return {
    header: headerParameters,
    body: bodyParameters,
    buttons: buttonParameters,
    headerFormat,
    requiresHeaderMedia,
    hasParameters:
      requiresHeaderMedia ||
      headerParameters.length > 0 ||
      bodyParameters.length > 0 ||
      buttonParameters.length > 0,
  }
}

/** Empty value object matching a template's shape, used to seed the parameter form. */
export function createEmptyTemplateValues(
  template: WhatsAppTemplate | undefined,
): WhatsAppTemplateValues {
  const parameters = getTemplateParameters(template)
  const buttons: Record<string, Record<string, string>> = {}

  for (const entry of parameters.buttons) {
    buttons[String(entry.index)] = Object.fromEntries(
      entry.parameters.map((parameter) => [parameter.key, '']),
    )
  }

  return {
    header: Object.fromEntries(parameters.header.map((parameter) => [parameter.key, ''])),
    body: Object.fromEntries(parameters.body.map((parameter) => [parameter.key, ''])),
    buttons,
    headerMedia: null,
  }
}

/** Field-level validation errors of a template parameter form. */
export interface WhatsAppTemplateErrors {
  header: Record<string, string>
  body: Record<string, string>
  buttons: Record<string, Record<string, string>>
  headerMedia?: string
}

/** Result of validating a template parameter form. */
export interface WhatsAppTemplateValidation {
  valid: boolean
  errors: WhatsAppTemplateErrors
}

function validateSection(
  parameters: WhatsAppTemplateParameter[],
  values: Record<string, string> | undefined,
  labels: WhatsAppInboxLabels,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const parameter of parameters) {
    const value = values?.[parameter.key]?.trim() ?? ''
    const required = parameter.required ?? true

    if (required && value.length === 0) {
      errors[parameter.key] = labels.templateRequiredField
    }
  }

  return errors
}

/**
 * Validates entered template values against the template's own declaration.
 *
 * Only the shape of the template drives this: nothing here knows which templates a particular
 * provider accepts, which stays a backend decision surfaced through `WhatsAppTemplate.status`.
 */
export function validateTemplateValues(
  template: WhatsAppTemplate | undefined,
  values: WhatsAppTemplateValues,
  labels: WhatsAppInboxLabels = DEFAULT_WHATSAPP_INBOX_LABELS,
): WhatsAppTemplateValidation {
  const parameters = getTemplateParameters(template)

  const errors: WhatsAppTemplateErrors = {
    header: validateSection(parameters.header, values.header, labels),
    body: validateSection(parameters.body, values.body, labels),
    buttons: {},
  }

  for (const entry of parameters.buttons) {
    const key = String(entry.index)
    const buttonErrors = validateSection(entry.parameters, values.buttons?.[key], labels)

    if (Object.keys(buttonErrors).length > 0) {
      errors.buttons[key] = buttonErrors
    }
  }

  if (parameters.requiresHeaderMedia && !values.headerMedia) {
    errors.headerMedia = labels.templateHeaderMediaRequired
  }

  const valid =
    Object.keys(errors.header).length === 0 &&
    Object.keys(errors.body).length === 0 &&
    Object.keys(errors.buttons).length === 0 &&
    errors.headerMedia === undefined

  return { valid, errors }
}

/**
 * Substitutes entered values into template text.
 *
 * Placeholders without a value keep their original form, so the preview shows the user exactly
 * which variables are still empty.
 */
export function renderTemplateText(
  text: string | undefined,
  values: Record<string, string> | undefined,
): string {
  if (!text) {
    return ''
  }

  return text.replace(PLACEHOLDER_PATTERN, (match, key: string) => {
    const value = values?.[key]

    return value === undefined || value === '' ? match : value
  })
}

/** Whether a template may be sent, that is, whether the provider approved it. */
export function isTemplateSendable(template: WhatsAppTemplate): boolean {
  return template.status === undefined || template.status === 'approved'
}

/**
 * Filters templates by a free-text query across name, description, category and body text.
 *
 * Client-side filtering of an already-supplied list, not a data-fetching concern: a consumer
 * that searches server-side simply passes the filtered list and leaves the query empty.
 */
export function filterTemplates(templates: WhatsAppTemplate[], query: string): WhatsAppTemplate[] {
  const trimmed = query.trim().toLowerCase()

  if (trimmed.length === 0) {
    return templates
  }

  return templates.filter((template) => {
    const body = getTemplateBody(template)?.text ?? ''
    const haystack = [
      template.name,
      template.description ?? '',
      template.category ?? '',
      template.languageLabel ?? template.language,
      body,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}
