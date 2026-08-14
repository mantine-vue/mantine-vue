<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
  SimpleGrid,
  Tooltip,
  rem,
} from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { IconCheck, IconCircleOff, IconColorPicker, IconPalette, IconX } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import type { RichTextEditorColorPickerControlOwnProps } from './RichTextEditorColorPickerControl.types'
import { useEditorSelector } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorColorPickerControl', inheritAttrs: false })

const props = defineProps<RichTextEditorColorPickerControlOwnProps>()
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const [opened, handlers] = useDisclosure(false)
const state = ref<'palette' | 'colorPicker'>('palette')
const currentColor = useEditorSelector(
  () => ctx.editor,
  (editor) => String(editor?.getAttributes('textStyle').color || 'var(--mantine-color-text)'),
)

function handleChange(value: string, shouldClose = true) {
  ;(ctx.editor?.chain() as any)?.focus().setColor(value).run()

  if (shouldClose) {
    handlers.close()
  }
}

function handleClear() {
  ;(ctx.editor?.chain() as any)?.focus().unsetColor().run()
  handlers.close()
}
</script>

<template>
  <Popover
    :opened="opened"
    :within-portal="true"
    :trap-focus="true"
    v-bind="props.popoverProps"
    @change="(value: boolean) => !value && handlers.close()"
  >
    <Popover.Target>
      <RichTextEditorControlComponent
        v-bind="attrs"
        :variant="ctx.variant"
        :aria-label="ctx.labels.colorPickerControlLabel"
        :title="ctx.labels.colorPickerControlLabel"
        @click="handlers.toggle"
      >
        <ColorSwatch :color="currentColor" :size="14" />
      </RichTextEditorControlComponent>
    </Popover.Target>

    <Popover.Dropdown v-bind="ctx.getStyles('linkEditorDropdown')">
      <SimpleGrid v-if="state === 'palette'" :cols="7" :spacing="2">
        <ColorSwatch
          v-for="color in props.colors"
          :key="color"
          component="button"
          :color="color"
          :size="26"
          radius="xs"
          :style="{ cursor: 'pointer' }"
          :title="ctx.labels.colorPickerColorLabel(color)"
          :aria-label="ctx.labels.colorPickerColorLabel(color)"
          @click="handleChange(color)"
        />
      </SimpleGrid>

      <ColorPicker
        v-else
        :model-value="currentColor"
        v-bind="props.colorPickerProps"
        @update:model-value="(value) => handleChange(value, false)"
      />

      <Tooltip.Group :close-delay="200">
        <Group justify="flex-end" gap="xs" mt="sm">
          <ActionIcon
            v-if="state === 'palette'"
            variant="default"
            :title="ctx.labels.colorPickerCancel"
            :aria-label="ctx.labels.colorPickerCancel"
            @click="handlers.close"
          >
            <IconX :style="{ width: rem(16), height: rem(16) }" />
          </ActionIcon>

          <ActionIcon
            variant="default"
            :title="ctx.labels.colorPickerClear"
            :aria-label="ctx.labels.colorPickerClear"
            @click="handleClear"
          >
            <IconCircleOff :style="{ width: rem(16), height: rem(16) }" />
          </ActionIcon>

          <ActionIcon
            variant="default"
            :title="
              state === 'palette'
                ? ctx.labels.colorPickerColorPicker
                : ctx.labels.colorPickerPalette
            "
            :aria-label="
              state === 'palette'
                ? ctx.labels.colorPickerColorPicker
                : ctx.labels.colorPickerPalette
            "
            @click="state = state === 'palette' ? 'colorPicker' : 'palette'"
          >
            <IconColorPicker
              v-if="state === 'palette'"
              :style="{ width: rem(16), height: rem(16) }"
            />
            <IconPalette v-else :style="{ width: rem(16), height: rem(16) }" />
          </ActionIcon>

          <ActionIcon
            v-if="state === 'colorPicker'"
            variant="default"
            :title="ctx.labels.colorPickerSave"
            :aria-label="ctx.labels.colorPickerSave"
            @click="handlers.close"
          >
            <IconCheck :style="{ width: rem(16), height: rem(16) }" />
          </ActionIcon>
        </Group>
      </Tooltip.Group>
    </Popover.Dropdown>
  </Popover>
</template>
