<script lang="ts">
import type { WhatsAppIconName } from '../../icons'
import type { WhatsAppTemplateButton } from '../../types'

const defaultProps = {
  withMeta: false,
  withButtons: true,
} as const

const BUTTON_ICONS: Record<WhatsAppTemplateButton['type'], WhatsAppIconName> = {
  quick_reply: 'reply',
  url: 'externalLink',
  phone_number: 'phone',
  copy_code: 'file',
}

export { defaultProps, BUTTON_ICONS }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Badge, Box, useProps, useStyles } from '@mantine-vue/core'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import {
  getTemplateBody,
  getTemplateButtons,
  getTemplateFooter,
  getTemplateHeader,
  renderTemplateText,
} from '../../utils'
import type { WhatsAppTemplatePreviewOwnProps } from './WhatsAppTemplatePreview.types'
import classes from './WhatsAppTemplatePreview.module.css'

defineOptions({
  name: 'WhatsAppTemplatePreview',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppTemplatePreviewOwnProps>(), {
  template: undefined,
  values: undefined,
  fallbackText: undefined,
  withMeta: undefined,
  withButtons: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const attrs = useAttrs()
const props = useProps('WhatsAppTemplatePreview', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppTemplatePreview',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  rootSelector: 'templatePreviewRoot',
})

const header = computed(() => getTemplateHeader(props.template))
const body = computed(() => getTemplateBody(props.template))
const footer = computed(() => getTemplateFooter(props.template))
const buttons = computed(() => getTemplateButtons(props.template)?.buttons ?? [])

const headerFormat = computed(() => header.value?.format ?? 'text')
const headerIsMedia = computed(() =>
  ['image', 'video', 'document'].includes(headerFormat.value as string),
)

const headerText = computed(() =>
  headerIsMedia.value ? '' : renderTemplateText(header.value?.text, props.values?.header),
)

const headerMediaLabel = computed(() => {
  const chosen = props.values?.headerMedia ?? header.value?.example

  if (chosen?.fileName) {
    return chosen.fileName
  }

  switch (headerFormat.value) {
    case 'image':
      return config.labels.messageTypeImage
    case 'video':
      return config.labels.messageTypeVideo
    default:
      return config.labels.messageTypeDocument
  }
})

const bodyText = computed(() => renderTemplateText(body.value?.text, props.values?.body))

const languageLabel = computed(
  () => props.template?.languageLabel ?? props.template?.language ?? '',
)

function buttonHint(button: WhatsAppTemplateButton, index: number): string {
  if (button.type === 'url') {
    return renderTemplateText(button.url, props.values?.buttons?.[String(index)])
  }

  if (button.type === 'phone_number') {
    return button.phoneNumber
  }

  return ''
}
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('templatePreviewRoot') }">
    <template v-if="props.template">
      <Box v-if="props.withMeta" v-bind="getStyles('templatePreviewMeta')">
        <Badge v-if="props.template.category" size="sm" variant="light">
          {{ props.template.category }}
        </Badge>
        <Badge v-if="languageLabel" size="sm" variant="default">{{ languageLabel }}</Badge>
        <Badge
          v-if="props.template.status && props.template.status !== 'approved'"
          size="sm"
          color="orange"
          variant="light"
        >
          {{ props.template.status }}
        </Badge>
      </Box>

      <Box v-if="headerIsMedia" v-bind="getStyles('templatePreviewHeaderMedia')">
        <WhatsAppIcon
          :name="headerFormat === 'image' ? 'photo' : headerFormat === 'video' ? 'video' : 'file'"
          size="16"
        />
        {{ headerMediaLabel }}
      </Box>

      <Box v-else-if="headerText" v-bind="getStyles('templatePreviewHeader')">
        {{ headerText }}
      </Box>

      <Box v-if="bodyText" v-bind="getStyles('templatePreviewBody')">{{ bodyText }}</Box>

      <Box v-if="footer" v-bind="getStyles('templatePreviewFooter')">{{ footer.text }}</Box>

      <Box
        v-if="props.withButtons && buttons.length > 0"
        v-bind="getStyles('templatePreviewButtons')"
      >
        <Box
          v-for="(button, index) in buttons"
          :key="`${button.type}-${index}`"
          v-bind="getStyles('templatePreviewButton')"
          :data-button-type="button.type"
          :title="buttonHint(button, index)"
        >
          <WhatsAppIcon :name="BUTTON_ICONS[button.type]" size="14" />
          {{ button.text }}
        </Box>
      </Box>
    </template>

    <Box v-else-if="props.fallbackText" v-bind="getStyles('templatePreviewFallback')">
      {{ props.fallbackText }}
    </Box>
  </Box>
</template>
