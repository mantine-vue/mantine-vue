<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { Button, Popover, TextInput, Tooltip, UnstyledButton, rem } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { IconExternalLink, IconLink } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import { isSafeEditor, useEditorSelector } from './use-editor-selector'
import type {
  RichTextEditorLinkControlRuntimeProps,
  RichTextEditorLinkControlSlots,
} from './RichTextEditorLinkControl.types'

defineOptions({ name: 'RichTextEditorLinkControl', inheritAttrs: false })

const props = withDefaults(defineProps<RichTextEditorLinkControlRuntimeProps>(), {
  popoverProps: undefined,
  disableTooltips: false,
  initialExternal: false,
  icon: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})
defineSlots<RichTextEditorLinkControlSlots>()

const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const url = ref('')
const external = ref(props.initialExternal)
const [opened, handlers] = useDisclosure(false)
const stylesApiProps = computed(() => ({ classNames: props.classNames, styles: props.styles }))
const active = useEditorSelector(
  () => ctx.editor,
  (editor) => (isSafeEditor(editor) ? editor.isActive('link') : false),
)

function open() {
  handlers.open()
  const link = isSafeEditor(ctx.editor) ? ctx.editor.getAttributes('link') : undefined
  url.value = link?.href || ''
  external.value = link?.href ? link.target === '_blank' : props.initialExternal
}

function close() {
  handlers.close()
  url.value = ''
  external.value = props.initialExternal
}

function setLink() {
  close()
  if (!isSafeEditor(ctx.editor)) {
    return
  }

  if (url.value === '') {
    ctx.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  } else {
    ctx.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.value, target: external.value ? '_blank' : null })
      .run()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    setLink()
  }
}

function onPopoverChange(nextOpened: boolean) {
  if (!nextOpened) {
    close()
  }
}

onMounted(() => window.addEventListener('edit-link', open))
onBeforeUnmount(() => window.removeEventListener('edit-link', open))
</script>

<template>
  <Popover
    :trap-focus="true"
    shadow="md"
    :within-portal="true"
    :opened="opened"
    :offset="-44"
    :z-index="10000"
    v-bind="props.popoverProps"
    @change="onPopoverChange"
  >
    <Popover.Target>
      <RichTextEditorControlBaseComponent
        v-bind="attrs"
        :aria-label="ctx.labels.linkControlLabel"
        :title="ctx.labels.linkControlLabel"
        :active="active"
        :class-names="props.classNames"
        :styles="props.styles"
        :variant="ctx.variant"
        @click="open"
      >
        <template #icon="iconProps">
          <slot name="icon" v-bind="iconProps">
            <component :is="props.icon || IconLink" v-bind="iconProps" />
          </slot>
        </template>
      </RichTextEditorControlBaseComponent>
    </Popover.Target>

    <Popover.Dropdown v-bind="ctx.getStyles('linkEditorDropdown', stylesApiProps)">
      <div v-bind="ctx.getStyles('linkEditor', stylesApiProps)">
        <TextInput
          v-model="url"
          :placeholder="ctx.labels.linkEditorInputPlaceholder"
          :aria-label="ctx.labels.linkEditorInputLabel"
          type="url"
          :class-names="{ input: ctx.getStyles('linkEditorInput', stylesApiProps).class }"
          @keydown="onKeydown"
        >
          <template #rightSection>
            <Tooltip
              :label="
                external ? ctx.labels.linkEditorExternalLink : ctx.labels.linkEditorInternalLink
              "
              :events="{ hover: true, focus: true, touch: true }"
              :within-portal="true"
              :with-arrow="true"
              :disabled="props.disableTooltips"
              :z-index="10000"
            >
              <UnstyledButton
                :data-active="external || undefined"
                v-bind="ctx.getStyles('linkEditorExternalControl', stylesApiProps)"
                @click="external = !external"
              >
                <IconExternalLink :style="{ width: rem(14), height: rem(14) }" />
              </UnstyledButton>
            </Tooltip>
          </template>
        </TextInput>

        <Button
          variant="default"
          v-bind="ctx.getStyles('linkEditorSave', stylesApiProps)"
          @click="setLink"
        >
          {{ ctx.labels.linkEditorSave }}
        </Button>
      </div>
    </Popover.Dropdown>
  </Popover>
</template>
