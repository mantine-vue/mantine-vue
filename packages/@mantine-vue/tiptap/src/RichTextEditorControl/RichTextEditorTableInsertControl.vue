<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Popover, UnstyledButton } from '@mantine-vue/core'
import { IconTablePlus } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import type { PopoverProps } from '@mantine-vue/core'
import type { RichTextEditorControlBaseRuntimeProps } from './RichTextEditorControl.types'
import { isSafeEditor, useEditorSelector } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorTableInsertControl', inheritAttrs: false })
interface RuntimeProps extends RichTextEditorControlBaseRuntimeProps {
  maxColumns?: number
  maxRows?: number
  withHeaderRow?: boolean
  popoverProps?: Partial<PopoverProps>
}

const props = withDefaults(defineProps<RuntimeProps>(), {
  maxColumns: 10,
  maxRows: 10,
  withHeaderRow: true,
  popoverProps: undefined,
  disabled: undefined,
  icon: undefined,
})
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const opened = ref(false)
const selected = ref({ columns: 0, rows: 0 })
const commandDisabled = useEditorSelector(
  () => ctx.editor,
  (editor) => !isSafeEditor(editor) || !(editor.can() as any).insertTable?.(),
)
const disabled = computed(() => props.disabled || commandDisabled.value)
const cells = computed(() =>
  Array.from({ length: props.maxRows * props.maxColumns }, (_, index) => ({
    row: Math.floor(index / props.maxColumns) + 1,
    column: (index % props.maxColumns) + 1,
  })),
)
const stylesApi = computed(() => ({ classNames: props.classNames, styles: props.styles }))

function close() {
  opened.value = false
  selected.value = { columns: 0, rows: 0 }
}

function insertTable(columns: number, rows: number) {
  close()
  if (isSafeEditor(ctx.editor)) {
    ;(ctx.editor.chain() as any)
      .focus()
      .insertTable({ rows, cols: columns, withHeaderRow: props.withHeaderRow })
      .run()
  }
}
</script>

<template>
  <Popover
    :opened="opened"
    :within-portal="true"
    :trap-focus="true"
    shadow="md"
    position="bottom-end"
    v-bind="props.popoverProps"
    @change="(value: boolean) => !value && close()"
  >
    <Popover.Target>
      <RichTextEditorControlBaseComponent
        v-bind="attrs"
        :active="opened"
        :disabled="disabled"
        :variant="props.variant ?? ctx.variant"
        :aria-label="ctx.labels.tableInsertControlLabel"
        :title="ctx.labels.tableInsertControlLabel"
        @click="opened ? close() : (opened = true)"
      >
        <template #icon="iconProps">
          <slot name="icon" v-bind="iconProps">
            <component :is="props.icon ?? IconTablePlus" v-bind="iconProps" />
          </slot>
        </template>
      </RichTextEditorControlBaseComponent>
    </Popover.Target>

    <Popover.Dropdown v-bind="ctx.getStyles('tableInsertDropdown', stylesApi)">
      <div
        v-bind="ctx.getStyles('tableInsertGrid', stylesApi)"
        :style="{ '--rte-table-insert-columns': props.maxColumns }"
        @mouseleave="selected = { columns: 0, rows: 0 }"
      >
        <UnstyledButton
          v-for="cell in cells"
          :key="`${cell.row}-${cell.column}`"
          v-bind="ctx.getStyles('tableInsertCell', stylesApi)"
          :data-active="(cell.column <= selected.columns && cell.row <= selected.rows) || undefined"
          :aria-label="ctx.labels.tableInsertLabel(cell.column, cell.row)"
          @mouseenter="selected = { columns: cell.column, rows: cell.row }"
          @focus="selected = { columns: cell.column, rows: cell.row }"
          @click="insertTable(cell.column, cell.row)"
        />
      </div>
      <div v-bind="ctx.getStyles('tableInsertLabel', stylesApi)">
        {{
          selected.columns
            ? `${selected.columns} × ${selected.rows}`
            : ctx.labels.tableInsertControlLabel
        }}
      </div>
    </Popover.Dropdown>
  </Popover>
</template>
