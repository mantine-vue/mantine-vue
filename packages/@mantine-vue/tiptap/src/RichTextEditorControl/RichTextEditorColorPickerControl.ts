import { defineComponent, h, ref, type PropType } from 'vue'
import {
  ActionIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
  SimpleGrid,
  rem,
  useProps,
} from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import { IconCheck, IconCircleOff, IconColorPicker, IconPalette, IconX } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import { RichTextEditorControl } from './RichTextEditorControl'

export interface RichTextEditorColorPickerControlProps {
  popoverProps?: Record<string, any>
  colorPickerProps?: Record<string, any>
  colors: string[]
  [key: string]: any
}

export const RichTextEditorColorPickerControl = defineComponent({
  name: 'RichTextEditorColorPickerControl',
  inheritAttrs: false,
  props: {
    popoverProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    colorPickerProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    colors: { type: Array as PropType<string[]>, required: true },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<RichTextEditorColorPickerControlProps>(
      'RichTextEditorColorPickerControl',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()
    const [opened, handlers] = useDisclosure(false)
    const state = ref<'palette' | 'colorPicker'>('palette')

    const handleChange = (value: string, shouldClose = true) => {
      ;(ctx.editor?.chain() as any)?.focus().setColor(value).run()
      if (shouldClose) handlers.close()
    }

    const handleClear = () => {
      ;(ctx.editor?.chain() as any)?.focus().unsetColor().run()
      handlers.close()
    }

    return () => {
      const currentColor =
        ctx.editor?.getAttributes('textStyle').color || 'var(--mantine-color-text)'

      return h(
        Popover,
        {
          opened: opened.value,
          withinPortal: true,
          trapFocus: true,
          onChange: (nextOpened: boolean) => !nextOpened && handlers.close(),
          ...props.popoverProps,
        },
        {
          default: () => [
            h(Popover.Target, null, () =>
              h(
                RichTextEditorControl,
                {
                  ...attrs,
                  variant: ctx.variant,
                  'aria-label': ctx.labels.colorPickerControlLabel,
                  title: ctx.labels.colorPickerControlLabel,
                  onClick: handlers.toggle,
                },
                () => h(ColorSwatch, { color: currentColor, size: 14 }),
              ),
            ),
            h(Popover.Dropdown, ctx.getStyles('linkEditorDropdown'), () => [
              state.value === 'palette'
                ? h(SimpleGrid, { cols: 7, spacing: 2 }, () =>
                    props.colors.map((color, index) =>
                      h(ColorSwatch, {
                        key: index,
                        component: 'button',
                        color,
                        onClick: () => handleChange(color),
                        size: 26,
                        radius: 'xs',
                        style: { cursor: 'pointer' },
                        title: ctx.labels.colorPickerColorLabel(color),
                        'aria-label': ctx.labels.colorPickerColorLabel(color),
                      }),
                    ),
                  )
                : null,
              state.value === 'colorPicker'
                ? h(ColorPicker, {
                    defaultValue: currentColor,
                    onChange: (value: string) => handleChange(value, false),
                    ...props.colorPickerProps,
                  })
                : null,
              h(Group, { justify: 'flex-end', gap: 'xs', mt: 'sm' }, () => [
                state.value === 'palette'
                  ? h(
                      ActionIcon,
                      {
                        variant: 'default',
                        onClick: handlers.close,
                        title: ctx.labels.colorPickerCancel,
                        'aria-label': ctx.labels.colorPickerCancel,
                      },
                      () => h(IconX, { style: { width: rem(16), height: rem(16) } }),
                    )
                  : null,
                h(
                  ActionIcon,
                  {
                    variant: 'default',
                    onClick: handleClear,
                    title: ctx.labels.colorPickerClear,
                    'aria-label': ctx.labels.colorPickerClear,
                  },
                  () => h(IconCircleOff, { style: { width: rem(16), height: rem(16) } }),
                ),
                state.value === 'palette'
                  ? h(
                      ActionIcon,
                      {
                        variant: 'default',
                        onClick: () => {
                          state.value = 'colorPicker'
                        },
                        title: ctx.labels.colorPickerColorPicker,
                        'aria-label': ctx.labels.colorPickerColorPicker,
                      },
                      () => h(IconColorPicker, { style: { width: rem(16), height: rem(16) } }),
                    )
                  : h(
                      ActionIcon,
                      {
                        variant: 'default',
                        onClick: () => {
                          state.value = 'palette'
                        },
                        title: ctx.labels.colorPickerPalette,
                        'aria-label': ctx.labels.colorPickerPalette,
                      },
                      () => h(IconPalette, { style: { width: rem(16), height: rem(16) } }),
                    ),
                state.value === 'colorPicker'
                  ? h(
                      ActionIcon,
                      {
                        variant: 'default',
                        onClick: handlers.close,
                        title: ctx.labels.colorPickerSave,
                        'aria-label': ctx.labels.colorPickerSave,
                      },
                      () => h(IconCheck, { style: { width: rem(16), height: rem(16) } }),
                    )
                  : null,
              ]),
            ]),
          ],
        },
      )
    }
  },
})
