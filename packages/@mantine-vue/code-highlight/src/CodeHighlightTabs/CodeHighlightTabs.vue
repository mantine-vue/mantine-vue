<script setup lang="ts">
import { computed, useAttrs, useSlots, watch } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import CodeHighlightComponent from '../CodeHighlight/CodeHighlight.vue'
import FileIcon from './FileIcon.vue'
import type {
  CodeHighlightTabsEmits,
  CodeHighlightTabsFactory,
  CodeHighlightTabsProps,
  CodeHighlightTabsSlots,
} from './CodeHighlightTabs.types'
import classes from '../CodeHighlight.module.css'

defineOptions({ name: 'CodeHighlightTabs', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CodeHighlightTabsProps>(), {
  // Keep optional Boolean props uncontrolled when they are not provided.
  defaultExpanded: undefined,
  expanded: undefined,
  withExpandButton: false,
  withBorder: false,
  withLineNumbers: false,
})
defineSlots<CodeHighlightTabsSlots>()
const emit = defineEmits<CodeHighlightTabsEmits>()
const props = useProps('CodeHighlightTabs', null, rawProps)
const attrs = useAttrs()
const slots = useSlots()
const getStyles = useStyles<CodeHighlightTabsFactory>({
  name: 'CodeHighlightTabs',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames,
  styles: props.styles,
  unstyled: props.unstyled,
  vars: props.vars,
})
const [value, setValue] = useUncontrolled<number>({
  defaultValue: props.defaultActiveTab,
  value: () => props.activeTab,
  finalValue: 0,
  onChange: (tab) => {
    emit('update:activeTab', tab)
    emit('tab-change', tab)
  },
})
const [expanded, setExpanded] = useUncontrolled<boolean>({
  defaultValue: props.defaultExpanded,
  value: () => props.expanded,
  finalValue: true,
  onChange: (next) => {
    emit('update:expanded', next)
    emit('expanded-change', next)
  },
})
watch(
  () => [value.value, props.code.length] as const,
  ([current, length]) => {
    if (current >= length) setValue(length - 1)
  },
  { immediate: true },
)
const currentCode = computed(
  () => props.code[value.value] || { code: '', language: 'tsx', fileName: '' },
)
const fileIconResolver = computed(
  () =>
    props.getFileIcon ??
    (slots.getFileIcon ? (fileName: string) => slots.getFileIcon?.({ fileName }) : undefined),
)
</script>

<template>
  <Box v-if="props.code.length" v-bind="{ ...attrs, ...getStyles('root') }">
    <ScrollArea
      type="never"
      dir="ltr"
      :offset-scrollbars="false"
      v-bind="getStyles('filesScrollarea')"
    >
      <div v-bind="getStyles('files')">
        <UnstyledButton
          v-for="(node, index) in props.code"
          :key="node.fileName ?? index"
          v-bind="getStyles('file')"
          :mod="{ active: index === value }"
          :data-color-scheme="props.codeColorScheme"
          @click="setValue(index)"
        >
          <FileIcon
            :file-icon="node.icon"
            :get-file-icon="fileIconResolver"
            :file-name="node.fileName"
            v-bind="getStyles('fileIcon')"
          />
          <span>{{ node.fileName }}</span>
        </UnstyledButton>
      </div>
    </ScrollArea>
    <CodeHighlightComponent
      :code="currentCode.code"
      :language="currentCode.language"
      :expanded="expanded"
      :with-copy-button="props.withCopyButton"
      :with-expand-button="props.withExpandButton"
      :with-border="props.withBorder"
      :radius="props.radius"
      :max-collapsed-height="props.maxCollapsedHeight"
      :copied-label="props.copiedLabel"
      :copy-label="props.copyLabel"
      :expand-code-label="props.expandCodeLabel"
      :collapse-code-label="props.collapseCodeLabel"
      :background="props.background"
      :controls="props.controls"
      :code-color-scheme="props.codeColorScheme"
      :with-line-numbers="props.withLineNumbers"
      __with-offset
      __static-selector="CodeHighlightTabs"
      @expanded-change="setExpanded"
      :class-names="props.classNames"
      :styles="props.styles"
    >
      <template v-if="$slots.controls" #controls><slot name="controls" /></template>
    </CodeHighlightComponent>
  </Box>
</template>
