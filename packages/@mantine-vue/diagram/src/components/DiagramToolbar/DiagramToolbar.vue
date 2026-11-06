<script setup lang="ts">
import { computed, useId } from 'vue'
import { ActionIcon, Menu, Toolbar, Tooltip } from '@mantine-vue/core'
import DiagramIcon from '../../icons/DiagramIcon.vue'
import {
  COMMAND_ICONS,
  commandLabel,
  formatShortcut,
  runCommand,
  toolLabel,
} from '../../vue/command-ui'
import { resolveShortcuts } from '../../vue/composables'
import { useDiagramContext } from '../../vue/context'
import { useFullscreenPortal } from '../../vue/fullscreen'
import type { DiagramPanelPosition, DiagramToolbarItem } from '../../vue/types'
import DiagramPanel from '../DiagramPanel/DiagramPanel.vue'

defineOptions({ name: 'DiagramToolbar' })

const props = withDefaults(
  defineProps<{
    /**
     * Tool ids, command ids, `'|'` dividers, menus and custom buttons. By default the select
     * and pan tools, every other registered tool, history and arrangement commands
     */
    items?: DiagramToolbarItem[]
    /** Position over the canvas, `'static'` renders the toolbar in place. Defaults to `'top-left'` inside a Diagram */
    position?: DiagramPanelPosition | 'static'
    /** Layout direction */
    orientation?: 'horizontal' | 'vertical'
    /** Size of the buttons */
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }>(),
  { items: undefined, position: undefined, orientation: 'horizontal', size: 'md' },
)

const { controller, labels, getStyles, inCanvas } = useDiagramContext()
const portalProps = useFullscreenPortal()
// Unique per toolbar, menu buttons are found by it for their tooltips.
const uid = useId()
const { editor } = controller

const ALIGN_MENU = {
  menu: 'align',
  icon: 'alignLeft',
  items: [
    'alignLeft',
    'alignCenter',
    'alignRight',
    'alignTop',
    'alignMiddle',
    'alignBottom',
    '|',
    'distributeHorizontal',
    'distributeVertical',
    '|',
    'matchWidth',
    'matchHeight',
  ],
}

const ARRANGE_MENU = {
  menu: 'arrange',
  icon: 'bringToFront',
  items: [
    'bringToFront',
    'bringForward',
    'sendBackward',
    'sendToBack',
    '|',
    'flipHorizontal',
    'flipVertical',
    'rotateClockwise',
    'rotateCounterClockwise',
    '|',
    'lock',
    'unlock',
  ],
}

const defaultItems = computed<DiagramToolbarItem[]>(() => {
  void controller.structureVersion.value
  const tools = editor
    .getTools()
    .map((tool) => tool.id)
    .filter((id) => id !== 'select' && id !== 'pan')

  return [
    'select',
    'pan',
    ...(tools.length > 0 ? ['|', ...tools] : []),
    '|',
    'undo',
    'redo',
    '|',
    'duplicate',
    'delete',
    'group',
    'ungroup',
    ALIGN_MENU,
    ARRANGE_MENU,
  ]
})

const shortcuts = computed(() => resolveShortcuts(controller, undefined))

interface ResolvedButton {
  kind: 'tool' | 'command' | 'custom'
  key: string
  label: string
  icon: string
  active: boolean
  disabled: boolean
  shortcut?: string
  run: () => void
}

type Divider = { kind: 'divider'; key: string }
type MenuEntry = ResolvedButton | Divider
type Resolved =
  | MenuEntry
  | {
      kind: 'menu'
      key: string
      label: string
      icon: string
      items: MenuEntry[]
      disabled: boolean
    }

function resolveCommand(id: string): ResolvedButton | null {
  if (!editor.getCommand(id)) {
    return null
  }

  return {
    kind: 'command',
    key: id,
    label: commandLabel(controller, labels.value, id),
    icon: COMMAND_ICONS[id] ?? 'more',
    active: false,
    disabled: !editor.canExecute(id),
    shortcut: shortcuts.value.get(id)?.[0],
    run: () => runCommand(controller, id),
  }
}

const resolved = computed<Resolved[]>(() => {
  // Enablement depends on the selection, the history and the mode.
  void controller.selection.value
  void controller.canUndo.value
  void controller.canRedo.value
  void controller.version.value
  void controller.tool.value
  void controller.mode.value
  const editing = controller.mode.value === 'edit'

  return (props.items ?? defaultItems.value).flatMap((item, index): Resolved[] => {
    if (item === '|') {
      return [{ kind: 'divider', key: `divider-${index}` }]
    }

    if (typeof item === 'string') {
      const tool = editor.getTool(item)

      if (tool) {
        return [
          {
            kind: 'tool',
            key: item,
            label: toolLabel(controller, labels.value, item),
            icon: tool.icon ?? 'pointer',
            active: controller.tool.value === item,
            disabled: Boolean(tool.edits && !editing),
            run: () => editor.setTool(item),
          },
        ]
      }

      const command = resolveCommand(item)
      return command ? [command] : []
    }

    if ('menu' in item) {
      const entries = item.items.flatMap((entry, entryIndex): MenuEntry[] => {
        if (entry === '|') {
          return [{ kind: 'divider', key: `d${entryIndex}` }]
        }

        const command = resolveCommand(entry)
        return command ? [command] : []
      })

      return [
        {
          kind: 'menu',
          key: item.menu,
          label: (labels.value as any)[item.menu] ?? item.menu,
          icon: item.icon,
          items: entries,
          disabled: entries.every((entry) => entry.kind === 'divider' || entry.disabled),
        },
      ]
    }

    return [
      {
        kind: 'custom',
        key: item.id,
        label: item.label,
        icon: item.icon,
        active: item.active?.(controller) ?? false,
        disabled: item.disabled?.(controller) ?? false,
        run: () => item.onClick(controller),
      },
    ]
  })
})

const position = computed(() => props.position ?? (inCanvas ? 'top-left' : 'static'))

const tooltip = (button: ResolvedButton) =>
  button.shortcut ? `${button.label} (${formatShortcut(button.shortcut)})` : button.label
</script>

<template>
  <component
    :is="position === 'static' ? 'div' : DiagramPanel"
    v-bind="position === 'static' ? {} : { position }"
  >
    <Toolbar
      v-bind="getStyles('toolbar')"
      :orientation="props.orientation"
      :data-orientation="props.orientation"
      :aria-label="labels.toolbar"
      :size="props.size"
      loop
    >
      <!--
        Menu.Target does not pass new props to its cloned child, so a menu is recreated when it
        becomes enabled or disabled.
      -->
      <template
        v-for="entry in resolved"
        :key="entry.kind === 'menu' ? `${entry.key}:${entry.disabled}` : entry.key"
      >
        <div
          v-if="entry.kind === 'divider'"
          v-bind="getStyles('toolbarDivider')"
          role="separator"
        />
        <template v-else-if="entry.kind === 'menu'">
          <Menu :portal-props="portalProps" position="bottom-start" shadow="md" width="max-content">
            <!-- The button is the direct child: Menu.Target only passes its handlers to its child. -->
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                :size="props.size"
                :aria-label="entry.label"
                :disabled="entry.disabled"
                data-toolbar-toggle
                :data-disabled="entry.disabled || undefined"
                :data-menu="entry.key"
                :data-menu-target="`${uid}-${entry.key}`"
              >
                <DiagramIcon :name="entry.icon" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown :aria-label="entry.label">
              <template v-for="sub in entry.items" :key="sub.key">
                <Menu.Divider v-if="sub.kind === 'divider'" />
                <Menu.Item
                  v-else
                  :disabled="sub.disabled"
                  :data-command="sub.key"
                  @click="sub.run()"
                >
                  <template #leftSection>
                    <DiagramIcon :name="sub.icon" :size="16" />
                  </template>
                  {{ sub.label }}
                  <template v-if="sub.shortcut" #rightSection>
                    <span style="font-size: 11px; opacity: 0.6">{{
                      formatShortcut(sub.shortcut)
                    }}</span>
                  </template>
                </Menu.Item>
              </template>
            </Menu.Dropdown>
          </Menu>
          <Tooltip
            :portal-props="portalProps"
            :target="`[data-menu-target='${uid}-${entry.key}']`"
            :label="entry.label"
            withinPortal
          />
        </template>
        <Tooltip :portal-props="portalProps" v-else :label="tooltip(entry)" withinPortal>
          <Toolbar.Toggle
            v-if="entry.kind === 'tool'"
            :active="entry.active"
            :disabled="entry.disabled"
            :aria-label="entry.label"
            :data-tool="entry.key"
            @click="entry.run()"
          >
            <DiagramIcon :name="entry.icon" />
          </Toolbar.Toggle>
          <ActionIcon
            v-else
            variant="subtle"
            color="gray"
            :size="props.size"
            :aria-label="entry.label"
            :aria-pressed="entry.kind === 'custom' && entry.active ? 'true' : undefined"
            :disabled="entry.disabled"
            data-toolbar-toggle
            :data-disabled="entry.disabled || undefined"
            :data-command="entry.key"
            @click="entry.run()"
          >
            <DiagramIcon :name="entry.icon" />
          </ActionIcon>
        </Tooltip>
      </template>
    </Toolbar>
  </component>
</template>
