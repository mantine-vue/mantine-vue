<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'

const defaultProps = {
  withSearch: true,
  withCategoryFilter: true,
  withUnavailable: true,
} as const

const varsResolver = createVarsResolver<any>((_, { listMaxHeight }) => ({
  templateSelectorRoot: {
    '--wa-template-list-max-height':
      listMaxHeight === undefined
        ? undefined
        : typeof listMaxHeight === 'number'
          ? `${listMaxHeight}px`
          : listMaxHeight,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Loader,
  Select,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { useWhatsAppInboxConfig } from '../../WhatsAppInbox.context'
import { WhatsAppIcon } from '../../icons'
import type {
  WhatsAppAttachment,
  WhatsAppTemplate,
  WhatsAppTemplateParameter,
  WhatsAppTemplateValues,
} from '../../types'
import {
  createEmptyTemplateValues,
  filterTemplates,
  getTemplateBody,
  getTemplateParameters,
  isTemplateSendable,
  validateTemplateValues,
  type WhatsAppTemplateErrors,
} from '../../utils'
import { WhatsAppTemplatePreview } from '../WhatsAppTemplatePreview'
import type {
  WhatsAppTemplateSelectorEmits,
  WhatsAppTemplateSelectorOwnProps,
  WhatsAppTemplateSelectorSlots,
} from './WhatsAppTemplateSelector.types'
import classes from './WhatsAppTemplateSelector.module.css'

defineOptions({
  name: 'WhatsAppTemplateSelector',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WhatsAppTemplateSelectorOwnProps>(), {
  templates: undefined,
  loading: undefined,
  error: undefined,
  query: undefined,
  defaultQuery: undefined,
  category: undefined,
  defaultCategory: undefined,
  selectedTemplateId: undefined,
  defaultSelectedTemplateId: undefined,
  values: undefined,
  withSearch: undefined,
  withCategoryFilter: undefined,
  withUnavailable: undefined,
  listMaxHeight: undefined,
  labels: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const emit = defineEmits<WhatsAppTemplateSelectorEmits>()
defineSlots<WhatsAppTemplateSelectorSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('WhatsAppTemplateSelector', defaultProps, rawProps)
const config = useWhatsAppInboxConfig(() => props.labels)

const getStyles = useStyles({
  name: 'WhatsAppTemplateSelector',
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
  varsResolver,
  rootSelector: 'templateSelectorRoot',
})

const [query, setQuery] = useUncontrolled<string>({
  value: () => props.query,
  defaultValue: props.defaultQuery,
  finalValue: '',
  onChange: (value) => emit('update:query', value),
})

const [category, setCategory] = useUncontrolled<string | null>({
  value: () => props.category,
  defaultValue: props.defaultCategory,
  finalValue: null,
  onChange: (value) => emit('update:category', value),
})

const [selectedId, setSelectedId] = useUncontrolled<string | null>({
  value: () => props.selectedTemplateId,
  defaultValue: props.defaultSelectedTemplateId,
  finalValue: null,
  onChange: (value) => emit('update:selectedTemplateId', value),
})

/**
 * Parameter values are only uncontrolled until the consumer passes `values`. Keeping the local
 * copy in a plain ref rather than in `useUncontrolled` lets a template change reset it without
 * emitting an update the consumer never asked for.
 */
const localValues = ref<WhatsAppTemplateValues>({})

const templates = computed(() => props.templates ?? [])

const selectedTemplate = computed(() =>
  selectedId.value
    ? templates.value.find((template) => template.id === selectedId.value)
    : undefined,
)

const values = computed<WhatsAppTemplateValues>(() => props.values ?? localValues.value)

function setValues(next: WhatsAppTemplateValues) {
  if (props.values === undefined) {
    localValues.value = next
  }

  emit('update:values', next)
}

const errors = ref<WhatsAppTemplateErrors>({ header: {}, body: {}, buttons: {} })

function resetErrors() {
  errors.value = { header: {}, body: {}, buttons: {} }
}

// A different template has a different set of placeholders, so the draft cannot carry over.
watch(selectedTemplate, (template) => {
  resetErrors()

  if (props.values === undefined) {
    localValues.value = createEmptyTemplateValues(template)
  }
})

const categories = computed(() => {
  const found = new Set<string>()

  for (const template of templates.value) {
    if (template.category) {
      found.add(template.category)
    }
  }

  return [...found].map((value) => ({ value, label: value }))
})

const visibleTemplates = computed(() => {
  const byQuery = filterTemplates(templates.value, query.value)
  const byCategory = category.value
    ? byQuery.filter((template) => template.category === category.value)
    : byQuery

  return props.withUnavailable ? byCategory : byCategory.filter(isTemplateSendable)
})

const parameters = computed(() => getTemplateParameters(selectedTemplate.value))

const hasTemplates = computed(() => visibleTemplates.value.length > 0)
const showLoading = computed(() => Boolean(props.loading) && templates.value.length === 0)
const showError = computed(() => Boolean(props.error) && templates.value.length === 0)

function bodyPreview(template: WhatsAppTemplate): string {
  return getTemplateBody(template)?.text ?? template.description ?? ''
}

function selectTemplate(template: WhatsAppTemplate) {
  if (!isTemplateSendable(template)) {
    return
  }

  setSelectedId(template.id)
  emit('select', template)
}

function back() {
  setSelectedId(null)
}

type ParameterSection = 'header' | 'body'

function sectionValue(section: ParameterSection, key: string): string {
  return values.value[section]?.[key] ?? ''
}

function setSectionValue(section: ParameterSection, key: string, value: string) {
  setValues({
    ...values.value,
    [section]: { ...values.value[section], [key]: value },
  })
}

function buttonValue(index: number, key: string): string {
  return values.value.buttons?.[String(index)]?.[key] ?? ''
}

function setButtonValue(index: number, key: string, value: string) {
  const buttonKey = String(index)

  setValues({
    ...values.value,
    buttons: {
      ...values.value.buttons,
      [buttonKey]: { ...values.value.buttons?.[buttonKey], [key]: value },
    },
  })
}

function setHeaderMedia(attachment: WhatsAppAttachment | null) {
  setValues({ ...values.value, headerMedia: attachment })
}

function parameterLabel(parameter: WhatsAppTemplateParameter): string {
  return parameter.label ?? `{{${parameter.key}}}`
}

function submit() {
  const template = selectedTemplate.value

  if (!template) {
    return
  }

  const validation = validateTemplateValues(template, values.value, config.labels)
  errors.value = validation.errors

  if (validation.valid) {
    emit('submit', { template, values: values.value })
  }
}
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('templateSelectorRoot') }">
    <template v-if="!selectedTemplate">
      <Box
        v-if="props.withSearch || (props.withCategoryFilter && categories.length > 0)"
        v-bind="getStyles('templateSelectorControls')"
      >
        <TextInput
          v-if="props.withSearch"
          :model-value="query"
          :placeholder="config.labels.templateSearchPlaceholder"
          :aria-label="config.labels.templateSearchPlaceholder"
          size="sm"
          style="flex: 1"
          @update:model-value="setQuery($event)"
        >
          <template #leftSection>
            <WhatsAppIcon name="search" size="16" />
          </template>
        </TextInput>

        <Select
          v-if="props.withCategoryFilter && categories.length > 0"
          :model-value="category"
          :data="categories"
          :placeholder="config.labels.templateCategoryLabel"
          :aria-label="config.labels.templateCategoryLabel"
          size="sm"
          clearable
          @update:model-value="setCategory($event as string | null)"
        />
      </Box>

      <Center v-if="showLoading" v-bind="getStyles('templateSelectorState')">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">{{ config.labels.templatesLoading }}</Text>
      </Center>

      <Alert
        v-else-if="showError"
        color="red"
        variant="light"
        :title="config.labels.templatesError"
      >
        <Text size="sm">{{ props.error }}</Text>
        <Button mt="sm" size="xs" variant="light" color="red" @click="emit('retryLoad')">
          {{ config.labels.retry }}
        </Button>
      </Alert>

      <Box v-else-if="!hasTemplates" v-bind="getStyles('templateSelectorState')">
        <slot v-if="slots.emptyTemplates" name="emptyTemplates" />
        <Text v-else size="sm" c="dimmed">{{ config.labels.templatesEmpty }}</Text>
      </Box>

      <Box
        v-else
        component="ul"
        v-bind="getStyles('templateSelectorList')"
        :aria-label="config.labels.templateSelectorTitle"
      >
        <Box v-for="template in visibleTemplates" :key="template.id" component="li">
          <slot
            v-if="slots.templateItem"
            name="templateItem"
            :template="template"
            :selected="template.id === selectedId"
          />

          <UnstyledButton
            v-else
            v-bind="getStyles('templateSelectorItem')"
            type="button"
            :disabled="!isTemplateSendable(template)"
            :data-disabled="isTemplateSendable(template) ? undefined : ''"
            :data-selected="template.id === selectedId ? '' : undefined"
            :aria-describedby="
              isTemplateSendable(template) ? undefined : `${template.id}-unavailable`
            "
            @click="selectTemplate(template)"
          >
            <Box v-bind="getStyles('templateSelectorItemName')">{{ template.name }}</Box>

            <Box v-bind="getStyles('templateSelectorItemMeta')">
              <Badge v-if="template.category" size="xs" variant="light">
                {{ template.category }}
              </Badge>
              <Badge size="xs" variant="default">
                {{ template.languageLabel ?? template.language }}
              </Badge>
              <Badge
                v-if="!isTemplateSendable(template)"
                :id="`${template.id}-unavailable`"
                size="xs"
                color="orange"
                variant="light"
              >
                {{ template.status }}
              </Badge>
            </Box>

            <Box v-bind="getStyles('templateSelectorItemBody')">{{ bodyPreview(template) }}</Box>
          </UnstyledButton>
        </Box>
      </Box>
    </template>

    <template v-else>
      <Box v-bind="getStyles('templateSelectorDetail')">
        <Box v-bind="getStyles('templateSelectorPreview')">
          <slot v-if="slots.templatePreview" name="templatePreview" :template="selectedTemplate" />
          <WhatsAppTemplatePreview
            v-else
            :template="selectedTemplate"
            :values="values"
            with-meta
            :labels="props.labels"
            :class-names="props.classNames as any"
            :styles="props.styles as any"
            :unstyled="props.unstyled"
          />
        </Box>

        <Box
          v-if="parameters.hasParameters"
          component="form"
          v-bind="getStyles('templateSelectorForm')"
          :aria-label="config.labels.templateParameters"
          @submit.prevent="submit"
        >
          <Box v-if="parameters.requiresHeaderMedia" v-bind="getStyles('templateSelectorSection')">
            <Box v-bind="getStyles('templateSelectorSectionTitle')">
              {{ config.labels.templateHeaderMedia }}
            </Box>

            <slot
              v-if="slots.headerMedia"
              name="headerMedia"
              :value="values.headerMedia ?? null"
              :set-value="setHeaderMedia"
              :error="errors.headerMedia"
            />
            <Text v-else-if="errors.headerMedia" size="xs" c="red">
              {{ errors.headerMedia }}
            </Text>
          </Box>

          <Box v-if="parameters.header.length > 0" v-bind="getStyles('templateSelectorSection')">
            <Box v-bind="getStyles('templateSelectorSectionTitle')">
              {{ config.labels.templateHeaderVariables }}
            </Box>

            <TextInput
              v-for="parameter in parameters.header"
              :key="parameter.key"
              size="sm"
              :label="parameterLabel(parameter)"
              :description="parameter.description"
              :placeholder="parameter.placeholder ?? parameter.example"
              :maxlength="parameter.maxLength"
              :required="parameter.required ?? true"
              :error="errors.header[parameter.key]"
              :model-value="sectionValue('header', parameter.key)"
              @update:model-value="setSectionValue('header', parameter.key, $event)"
            />
          </Box>

          <Box v-if="parameters.body.length > 0" v-bind="getStyles('templateSelectorSection')">
            <Box v-bind="getStyles('templateSelectorSectionTitle')">
              {{ config.labels.templateBodyVariables }}
            </Box>

            <Textarea
              v-for="parameter in parameters.body"
              :key="parameter.key"
              size="sm"
              autosize
              :min-rows="1"
              :max-rows="4"
              :label="parameterLabel(parameter)"
              :description="parameter.description"
              :placeholder="parameter.placeholder ?? parameter.example"
              :maxlength="parameter.maxLength"
              :required="parameter.required ?? true"
              :error="errors.body[parameter.key]"
              :model-value="sectionValue('body', parameter.key)"
              @update:model-value="setSectionValue('body', parameter.key, $event)"
            />
          </Box>

          <Box v-if="parameters.buttons.length > 0" v-bind="getStyles('templateSelectorSection')">
            <Box v-bind="getStyles('templateSelectorSectionTitle')">
              {{ config.labels.templateButtonVariables }}
            </Box>

            <template v-for="entry in parameters.buttons" :key="entry.index">
              <TextInput
                v-for="parameter in entry.parameters"
                :key="`${entry.index}-${parameter.key}`"
                size="sm"
                :label="`${entry.button.text} — ${parameterLabel(parameter)}`"
                :description="parameter.description"
                :placeholder="parameter.placeholder ?? parameter.example"
                :maxlength="parameter.maxLength"
                :required="parameter.required ?? true"
                :error="errors.buttons[String(entry.index)]?.[parameter.key]"
                :model-value="buttonValue(entry.index, parameter.key)"
                @update:model-value="setButtonValue(entry.index, parameter.key, $event)"
              />
            </template>
          </Box>
        </Box>
      </Box>

      <Box v-bind="getStyles('templateSelectorFooter')">
        <Button variant="subtle" size="sm" @click="back">
          <WhatsAppIcon name="arrowLeft" size="16" />
          {{ config.labels.templateBack }}
        </Button>

        <Button size="sm" :disabled="!isTemplateSendable(selectedTemplate)" @click="submit">
          {{ config.labels.templateSubmit }}
        </Button>
      </Box>
    </template>
  </Box>
</template>
