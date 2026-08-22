<script lang="ts">
import type { WhatsAppInteractiveContent, WhatsAppInteractiveType } from '../../types'
import { createClientId } from '../../utils'

const defaultProps = {
  maxButtons: 3,
  maxRowsPerSection: 10,
  disabled: false,
} as const

/**
 * A fresh, well-formed draft of the given type.
 *
 * The draft is always a valid `WhatsAppInteractiveContent`, never a loose bag of fields: the
 * `v-model` a consumer binds is the same discriminated union the message would be sent with, so
 * there is nothing to translate on submit.
 */
function createInteractiveDraft(
  type: WhatsAppInteractiveType,
  previous?: WhatsAppInteractiveContent,
): WhatsAppInteractiveContent {
  const shared = {
    header: previous?.header,
    body: previous?.body ?? '',
    footer: previous?.footer,
  }

  if (type === 'cta_url') {
    return { ...shared, type: 'cta_url', action: { displayText: '', url: '' } }
  }

  if (type === 'list') {
    return {
      ...shared,
      type: 'list',
      button: '',
      sections: [{ title: '', rows: [{ id: createClientId(), title: '', description: '' }] }],
    }
  }

  return { ...shared, type: 'button', buttons: [{ id: createClientId(), title: '' }] }
}

export { createInteractiveDraft, defaultProps }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import {
  ActionIcon,
  Box,
  Button,
  SegmentedControl,
  Text,
  TextInput,
  Textarea,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type {
  WhatsAppInteractiveButtonContent,
  WhatsAppInteractiveCtaUrlContent,
  WhatsAppInteractiveListContent,
} from '../../types'
import type {
  WhatsAppInteractiveMessageEditorEmits,
  WhatsAppInteractiveMessageEditorOwnProps,
} from './WhatsAppInteractiveMessageEditor.types'
import classes from './WhatsAppInteractiveMessageEditor.module.css'

defineOptions({
  name: 'WhatsAppInteractiveMessageEditor',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppInteractiveMessageEditorOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  interactiveTypes: undefined,
  maxButtons: undefined,
  maxRowsPerSection: undefined,
  disabled: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppInteractiveMessageEditorEmits>()

const attrs = useAttrs()
const props = useProps('WhatsAppInteractiveMessageEditor', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppInteractiveMessageEditor',
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
  rootSelector: 'interactiveEditorRoot',
})

const availableTypes = computed<WhatsAppInteractiveType[]>(() =>
  props.interactiveTypes && props.interactiveTypes.length > 0 ? props.interactiveTypes : ['button'],
)

const [content, setContent] = useUncontrolled<WhatsAppInteractiveContent>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: createInteractiveDraft(props.interactiveTypes?.[0] ?? 'button'),
  onChange: (value) => emit('update:modelValue', value),
})

const typeOptions = computed(() =>
  availableTypes.value.map((type) => ({
    value: type,
    label:
      type === 'button'
        ? config.labels.interactiveTypeButton
        : type === 'cta_url'
          ? config.labels.interactiveTypeCtaUrl
          : config.labels.interactiveTypeList,
  })),
)

const buttonContent = computed(() =>
  content.value.type === 'button' ? (content.value as WhatsAppInteractiveButtonContent) : undefined,
)
const ctaContent = computed(() =>
  content.value.type === 'cta_url'
    ? (content.value as WhatsAppInteractiveCtaUrlContent)
    : undefined,
)
const listContent = computed(() =>
  content.value.type === 'list' ? (content.value as WhatsAppInteractiveListContent) : undefined,
)

const errors = computed(() => {
  const current = content.value
  const result: { body?: string; buttons?: string; url?: string; rows?: string } = {}

  if (current.body.trim().length === 0) {
    result.body = config.labels.interactiveBodyRequired
  }

  if (current.type === 'button' && !current.buttons.some((button) => button.title.trim())) {
    result.buttons = config.labels.interactiveButtonsRequired
  }

  if (
    current.type === 'cta_url' &&
    (current.action.displayText.trim().length === 0 ||
      !/^https?:\/\/\S+$/i.test(current.action.url))
  ) {
    result.url = config.labels.interactiveUrlRequired
  }

  if (current.type === 'list') {
    const hasRow = current.sections.some((section) =>
      section.rows.some((row) => row.title.trim().length > 0),
    )

    if (!hasRow || current.button.trim().length === 0) {
      result.rows = config.labels.interactiveRowsRequired
    }
  }

  return result
})

const valid = computed(() => Object.keys(errors.value).length === 0)

const submitted = ref(false)

function changeType(type: WhatsAppInteractiveType) {
  setContent(createInteractiveDraft(type, content.value))
}

function patch(partial: Partial<WhatsAppInteractiveContent>) {
  setContent({ ...content.value, ...partial } as WhatsAppInteractiveContent)
}

function setButtonTitle(index: number, title: string) {
  const current = buttonContent.value

  if (!current) {
    return
  }

  const buttons = current.buttons.map((button, buttonIndex) =>
    buttonIndex === index ? { ...button, title } : button,
  )

  setContent({ ...current, buttons })
}

function addButton() {
  const current = buttonContent.value

  if (!current || current.buttons.length >= (props.maxButtons ?? defaultProps.maxButtons)) {
    return
  }

  setContent({ ...current, buttons: [...current.buttons, { id: createClientId(), title: '' }] })
}

function removeButton(index: number) {
  const current = buttonContent.value

  if (!current || current.buttons.length <= 1) {
    return
  }

  setContent({
    ...current,
    buttons: current.buttons.filter((_, buttonIndex) => buttonIndex !== index),
  })
}

function setAction(partial: Partial<WhatsAppInteractiveCtaUrlContent['action']>) {
  const current = ctaContent.value

  if (!current) {
    return
  }

  setContent({ ...current, action: { ...current.action, ...partial } })
}

function setSectionTitle(sectionIndex: number, title: string) {
  const current = listContent.value

  if (!current) {
    return
  }

  setContent({
    ...current,
    sections: current.sections.map((section, index) =>
      index === sectionIndex ? { ...section, title } : section,
    ),
  })
}

function setRow(
  sectionIndex: number,
  rowIndex: number,
  partial: { title?: string; description?: string },
) {
  const current = listContent.value

  if (!current) {
    return
  }

  setContent({
    ...current,
    sections: current.sections.map((section, index) =>
      index === sectionIndex
        ? {
            ...section,
            rows: section.rows.map((row, currentRowIndex) =>
              currentRowIndex === rowIndex ? { ...row, ...partial } : row,
            ),
          }
        : section,
    ),
  })
}

function addRow(sectionIndex: number) {
  const current = listContent.value
  const max = props.maxRowsPerSection ?? defaultProps.maxRowsPerSection

  if (!current || current.sections[sectionIndex].rows.length >= max) {
    return
  }

  setContent({
    ...current,
    sections: current.sections.map((section, index) =>
      index === sectionIndex
        ? {
            ...section,
            rows: [...section.rows, { id: createClientId(), title: '', description: '' }],
          }
        : section,
    ),
  })
}

function removeRow(sectionIndex: number, rowIndex: number) {
  const current = listContent.value

  if (!current || current.sections[sectionIndex].rows.length <= 1) {
    return
  }

  setContent({
    ...current,
    sections: current.sections.map((section, index) =>
      index === sectionIndex
        ? { ...section, rows: section.rows.filter((_, currentIndex) => currentIndex !== rowIndex) }
        : section,
    ),
  })
}

function addSection() {
  const current = listContent.value

  if (!current) {
    return
  }

  setContent({
    ...current,
    sections: [
      ...current.sections,
      { title: '', rows: [{ id: createClientId(), title: '', description: '' }] },
    ],
  })
}

function removeSection(sectionIndex: number) {
  const current = listContent.value

  if (!current || current.sections.length <= 1) {
    return
  }

  setContent({
    ...current,
    sections: current.sections.filter((_, index) => index !== sectionIndex),
  })
}

function submit() {
  submitted.value = true

  if (valid.value) {
    emit('submit', content.value)
  }
}
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('interactiveEditorRoot') }">
    <SegmentedControl
      v-if="typeOptions.length > 1"
      :model-value="content.type"
      :data="typeOptions"
      :disabled="props.disabled"
      size="xs"
      full-width
      :aria-label="config.labels.interactiveType"
      @update:model-value="changeType($event as any)"
    />

    <TextInput
      size="sm"
      :label="config.labels.interactiveHeader"
      :disabled="props.disabled"
      :model-value="content.header?.text ?? ''"
      @update:model-value="patch({ header: $event ? { type: 'text', text: $event } : undefined })"
    />

    <Textarea
      size="sm"
      autosize
      :min-rows="2"
      :max-rows="6"
      required
      :label="config.labels.interactiveBody"
      :disabled="props.disabled"
      :error="submitted ? errors.body : undefined"
      :model-value="content.body"
      @update:model-value="patch({ body: $event })"
    />

    <TextInput
      size="sm"
      :label="config.labels.interactiveFooter"
      :disabled="props.disabled"
      :model-value="content.footer ?? ''"
      @update:model-value="patch({ footer: $event || undefined })"
    />

    <Box v-if="buttonContent" v-bind="getStyles('interactiveEditorSection')">
      <Box v-bind="getStyles('interactiveEditorSectionTitle')">
        {{ config.labels.interactiveButtons }}
      </Box>

      <Box
        v-for="(button, index) in buttonContent.buttons"
        :key="button.id"
        v-bind="getStyles('interactiveEditorRow')"
      >
        <TextInput
          size="sm"
          style="flex: 1"
          :aria-label="`${config.labels.interactiveButtonText} ${index + 1}`"
          :placeholder="config.labels.interactiveButtonText"
          :disabled="props.disabled"
          :model-value="button.title"
          @update:model-value="setButtonTitle(index, $event)"
        />

        <ActionIcon
          variant="subtle"
          color="gray"
          :disabled="props.disabled || buttonContent.buttons.length <= 1"
          :aria-label="`${config.labels.interactiveRemoveButton} ${index + 1}`"
          @click="removeButton(index)"
        >
          <WhatsAppIcon name="close" size="16" />
        </ActionIcon>
      </Box>

      <Text v-if="submitted && errors.buttons" size="xs" c="red">{{ errors.buttons }}</Text>

      <Button
        variant="subtle"
        size="xs"
        :disabled="props.disabled || buttonContent.buttons.length >= (props.maxButtons ?? 3)"
        @click="addButton"
      >
        <WhatsAppIcon name="plus" size="14" />
        {{ config.labels.interactiveAddButton }}
      </Button>
    </Box>

    <Box v-else-if="ctaContent" v-bind="getStyles('interactiveEditorSection')">
      <TextInput
        size="sm"
        required
        :label="config.labels.interactiveCtaDisplayText"
        :disabled="props.disabled"
        :model-value="ctaContent.action.displayText"
        @update:model-value="setAction({ displayText: $event })"
      />

      <TextInput
        size="sm"
        required
        type="url"
        placeholder="https://"
        :label="config.labels.interactiveCtaUrl"
        :disabled="props.disabled"
        :error="submitted ? errors.url : undefined"
        :model-value="ctaContent.action.url"
        @update:model-value="setAction({ url: $event })"
      />
    </Box>

    <Box v-else-if="listContent" v-bind="getStyles('interactiveEditorSection')">
      <TextInput
        size="sm"
        required
        :label="config.labels.interactiveListButton"
        :disabled="props.disabled"
        :model-value="listContent.button"
        @update:model-value="patch({ button: $event } as any)"
      />

      <Box v-bind="getStyles('interactiveEditorSectionTitle')">
        {{ config.labels.interactiveListSections }}
      </Box>

      <Box
        v-for="(section, sectionIndex) in listContent.sections"
        :key="sectionIndex"
        v-bind="getStyles('interactiveEditorItem')"
      >
        <Box v-bind="getStyles('interactiveEditorRow')">
          <TextInput
            size="sm"
            style="flex: 1"
            :aria-label="`${config.labels.interactiveSectionTitle} ${sectionIndex + 1}`"
            :placeholder="config.labels.interactiveSectionTitle"
            :disabled="props.disabled"
            :model-value="section.title ?? ''"
            @update:model-value="setSectionTitle(sectionIndex, $event)"
          />

          <ActionIcon
            variant="subtle"
            color="gray"
            :disabled="props.disabled || listContent.sections.length <= 1"
            :aria-label="`${config.labels.interactiveRemoveSection} ${sectionIndex + 1}`"
            @click="removeSection(sectionIndex)"
          >
            <WhatsAppIcon name="close" size="16" />
          </ActionIcon>
        </Box>

        <Box
          v-for="(row, rowIndex) in section.rows"
          :key="row.id"
          v-bind="getStyles('interactiveEditorRow')"
        >
          <TextInput
            size="sm"
            style="flex: 1"
            :aria-label="`${config.labels.interactiveRowTitle} ${rowIndex + 1}`"
            :placeholder="config.labels.interactiveRowTitle"
            :disabled="props.disabled"
            :model-value="row.title"
            @update:model-value="setRow(sectionIndex, rowIndex, { title: $event })"
          />

          <TextInput
            size="sm"
            style="flex: 1"
            :aria-label="`${config.labels.interactiveRowDescription} ${rowIndex + 1}`"
            :placeholder="config.labels.interactiveRowDescription"
            :disabled="props.disabled"
            :model-value="row.description ?? ''"
            @update:model-value="setRow(sectionIndex, rowIndex, { description: $event })"
          />

          <ActionIcon
            variant="subtle"
            color="gray"
            :disabled="props.disabled || section.rows.length <= 1"
            :aria-label="`${config.labels.interactiveRemoveRow} ${rowIndex + 1}`"
            @click="removeRow(sectionIndex, rowIndex)"
          >
            <WhatsAppIcon name="close" size="16" />
          </ActionIcon>
        </Box>

        <Button variant="subtle" size="xs" :disabled="props.disabled" @click="addRow(sectionIndex)">
          <WhatsAppIcon name="plus" size="14" />
          {{ config.labels.interactiveAddRow }}
        </Button>
      </Box>

      <Text v-if="submitted && errors.rows" size="xs" c="red">{{ errors.rows }}</Text>

      <Button variant="subtle" size="xs" :disabled="props.disabled" @click="addSection">
        <WhatsAppIcon name="plus" size="14" />
        {{ config.labels.interactiveAddSection }}
      </Button>
    </Box>

    <Box v-bind="getStyles('interactiveEditorFooter')">
      <Button variant="subtle" size="sm" :disabled="props.disabled" @click="emit('cancel')">
        {{ config.labels.cancel }}
      </Button>

      <Button size="sm" :disabled="props.disabled" @click="submit">
        {{ config.labels.interactiveSubmit }}
      </Button>
    </Box>
  </Box>
</template>
