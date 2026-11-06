<script setup lang="ts">
import { computed } from 'vue'
import { Menu } from '@mantine-vue/core'
import DiagramIcon from '../../icons/DiagramIcon.vue'
import { COMMAND_ICONS, commandLabel, formatShortcut, runCommand } from '../../vue/command-ui'
import { resolveShortcuts } from '../../vue/composables'
import { useDiagramContext } from '../../vue/context'
import { useFullscreenPortal } from '../../vue/fullscreen'
import type {
  DiagramContextMenuContext,
  DiagramMenuItem,
  DiagramMenuState,
} from '../Diagram/Diagram.types'

defineOptions({ name: 'DiagramContextMenu' })

const props = defineProps<{
  state: DiagramMenuState | null
  items: DiagramMenuItem[] | ((context: DiagramContextMenuContext) => DiagramMenuItem[]) | undefined
}>()

const emit = defineEmits<{ close: [] }>()

const { controller, labels } = useDiagramContext()
const portalProps = useFullscreenPortal()
const { editor } = controller

const SELECTION_ITEMS: DiagramMenuItem[] = [
  'cut',
  'copy',
  'paste',
  'duplicate',
  'delete',
  '-',
  'editText',
  'group',
  'ungroup',
  'lock',
  'unlock',
  '-',
  'bringToFront',
  'bringForward',
  'sendBackward',
  'sendToBack',
  '-',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignTop',
  'alignMiddle',
  'alignBottom',
  'distributeHorizontal',
  'distributeVertical',
  '-',
  'flipHorizontal',
  'flipVertical',
  'rotateClockwise',
]

const CANVAS_ITEMS: DiagramMenuItem[] = [
  'pasteHere',
  'selectAll',
  '-',
  'zoomToFit',
  'zoomReset',
  'undo',
  'redo',
]

interface ResolvedItem {
  key: string
  divider?: boolean
  label?: string
  icon?: string
  color?: string
  shortcut?: string
  disabled?: boolean
  run?: () => void
}

const shortcuts = computed(() => resolveShortcuts(controller, undefined))

const items = computed<ResolvedItem[]>(() => {
  const state = props.state
  // Enablement depends on the selection and the document.
  void controller.selection.value
  void controller.version.value

  if (!state) {
    return []
  }

  const context: DiagramContextMenuContext = { controller, scope: state.scope, point: state.point }
  const source =
    typeof props.items === 'function'
      ? props.items(context)
      : (props.items ?? (state.scope === 'selection' ? SELECTION_ITEMS : CANVAS_ITEMS))

  const resolved: ResolvedItem[] = source.flatMap((item, index): ResolvedItem[] => {
    if (item === '-') {
      return [{ key: `divider-${index}`, divider: true }]
    }

    if (typeof item === 'string') {
      // Pasting from the canvas menu puts the content where the menu was opened.
      if (item === 'pasteHere') {
        return editor.hasClipboard && editor.canEdit
          ? [
              {
                key: item,
                label: commandLabel(controller, labels.value, 'paste'),
                icon: 'paste',
                run: () => editor.paste({ at: state.point }),
              },
            ]
          : []
      }

      const command = editor.getCommand(item)

      // Commands that cannot run are left out, a long list of disabled items is noise.
      if (!command || !editor.canExecute(item)) {
        return []
      }

      return [
        {
          key: item,
          label: commandLabel(controller, labels.value, item),
          icon: COMMAND_ICONS[item],
          color: item === 'delete' ? 'red' : undefined,
          shortcut: shortcuts.value.get(item)?.[0],
          run: () => runCommand(controller, item),
        },
      ]
    }

    return [
      {
        key: item.id,
        label: item.label,
        icon: item.icon,
        color: item.color,
        disabled: item.disabled,
        run: () => item.onClick(controller),
      },
    ]
  })

  // No leading, trailing or repeated dividers.
  const compact = resolved.filter(
    (item, index, list) => !item.divider || (index > 0 && !list[index - 1].divider),
  )

  const last = compact.reduce((found, item, index) => (item.divider ? found : index), -1)

  return compact.slice(0, last + 1)
})

const anchorStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${props.state?.y ?? 0}px`,
  left: `${props.state?.x ?? 0}px`,
  width: '0',
  height: '0',
}))

function onOpenedChange(opened: boolean) {
  if (!opened) {
    emit('close')
  }
}

function select(item: ResolvedItem) {
  emit('close')
  item.run?.()
}
</script>

<template>
  <Menu
    :portal-props="portalProps"
    :opened="!!state && items.length > 0"
    position="bottom-start"
    shadow="md"
    width="max-content"
    :transition-props="{ duration: 0 }"
    :return-focus="false"
    @update:opened="onOpenedChange"
  >
    <Menu.Target>
      <span :style="anchorStyle" />
    </Menu.Target>
    <Menu.Dropdown :aria-label="labels.contextMenu">
      <template v-for="item in items" :key="item.key">
        <Menu.Divider v-if="item.divider" />
        <Menu.Item
          v-else
          :color="item.color"
          :disabled="item.disabled"
          :data-command="item.key"
          @click="select(item)"
        >
          <template v-if="item.icon" #leftSection>
            <DiagramIcon :name="item.icon" :size="16" />
          </template>
          {{ item.label }}
          <template v-if="item.shortcut" #rightSection>
            <span style="font-size: 11px; opacity: 0.6">{{ formatShortcut(item.shortcut) }}</span>
          </template>
        </Menu.Item>
      </template>
    </Menu.Dropdown>
  </Menu>
</template>
