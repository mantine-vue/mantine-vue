import { computed, defineComponent, h, onBeforeUnmount, ref, watch, type PropType } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Box, UnstyledButton, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import type { RichTextEditorLabels } from '../labels'
import classes from '../RichTextEditor.module.css'

export type RichTextEditorControlStylesNames = 'control'

export interface RichTextEditorControlProps {
  active?: boolean
  interactive?: boolean
  disabled?: boolean
  variant?: string
  classNames?: any
  styles?: any
  vars?: any
  class?: any
  style?: any
  [key: string]: any
}

const defaultProps = {
  interactive: true,
} satisfies Partial<RichTextEditorControlProps>

export const RichTextEditorControl = defineComponent({
  name: 'RichTextEditorControl',
  inheritAttrs: false,
  props: {
    active: { type: Boolean, default: undefined },
    interactive: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    variant: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<RichTextEditorControlProps>(
      'RichTextEditorControl',
      defaultProps,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()

    return () =>
      h(
        UnstyledButton,
        {
          ...attrs,
          ...ctx.getStyles('control', {
            className: attrs.class,
            style: attrs.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
          disabled: props.disabled,
          'data-rich-text-editor-control': '',
          tabindex: props.interactive ? 0 : -1,
          'data-interactive': props.interactive || undefined,
          'data-disabled': props.disabled || undefined,
          'data-active': props.active || undefined,
          'aria-pressed': props.active && props.interactive ? true : undefined,
          'aria-hidden': !props.interactive || undefined,
          unstyled: ctx.unstyled,
          variant: props.variant || ctx.variant || 'default',
          onMousedown: (event: MouseEvent) => {
            event.preventDefault()
            ;(attrs as any).onMousedown?.(event)
          },
        },
        slots,
      )
  },
})

Object.assign(RichTextEditorControl, { classes })

export interface RichTextEditorControlBaseProps extends RichTextEditorControlProps {
  icon?: any
}

export const RichTextEditorControlBase = defineComponent({
  name: 'RichTextEditorControlBase',
  inheritAttrs: false,
  props: {
    icon: { type: [Object, Function] as PropType<any>, required: true },
    active: { type: Boolean, default: undefined },
    interactive: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    variant: { type: String, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
  },
  setup(props, { attrs }) {
    const ctx = useRichTextEditorContext()
    return () =>
      h(RichTextEditorControl, { ...attrs, ...props }, () =>
        h(props.icon, ctx.getStyles('controlIcon')),
      )
  },
})

export interface CreateControlProps {
  label: keyof RichTextEditorLabels
  icon: any
  isActive?: { name: string; attributes?: Record<string, any> | string }
  isDisabled?: (editor: Editor) => boolean
  operation: { name: string; attributes?: Record<string, any> | string }
}

function isSafeEditor(editor: Editor | null): editor is Editor {
  return !!editor && !editor.isDestroyed
}

function useEditorSelector<T>(editor: () => Editor | null, selector: (editor: Editor | null) => T) {
  const tick = ref(0)
  const update = () => {
    tick.value += 1
  }
  const listen = (current: Editor | null | undefined) => {
    current?.on('transaction', update)
    current?.on('selectionUpdate', update)
    current?.on('update', update)
  }
  const unlisten = (current: Editor | null | undefined) => {
    current?.off('transaction', update)
    current?.off('selectionUpdate', update)
    current?.off('update', update)
  }

  const stop = watch(
    editor,
    (current, previous) => {
      unlisten(previous)
      listen(current)
      update()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stop()
    unlisten(editor())
  })

  return computed(() => {
    void tick.value
    return selector(editor())
  })
}

export function createControl({
  label,
  isActive,
  operation,
  icon,
  isDisabled,
}: CreateControlProps) {
  return defineComponent({
    name: `RichTextEditor${String(label)}`,
    inheritAttrs: false,
    props: {
      icon: { type: [Object, Function] as PropType<any>, default: undefined },
      active: { type: Boolean, default: undefined },
      interactive: { type: Boolean, default: undefined },
      disabled: { type: Boolean, default: undefined },
      variant: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs }) {
      const ctx = useRichTextEditorContext()
      const editorState = useEditorSelector(
        () => ctx.editor,
        (editor) => {
          const safeEditor = isSafeEditor(editor) ? editor : null
          return {
            active:
              safeEditor && isActive?.name
                ? safeEditor.isActive(isActive.name, isActive.attributes as any)
                : false,
            disabled: safeEditor ? (isDisabled?.(safeEditor) ?? false) : true,
          }
        },
      )

      return () => {
        const controlLabel = ctx.labels[label] as string

        return h(RichTextEditorControlBase, {
          ...attrs,
          ...props,
          'aria-label': controlLabel,
          title: controlLabel,
          active: props.active ?? editorState.value.active,
          icon: props.icon || icon,
          disabled: props.disabled ?? editorState.value.disabled,
          onClick: () => {
            if (!isSafeEditor(ctx.editor)) {
              return
            }

            ;(ctx.editor as any).chain().focus()[operation.name](operation.attributes).run()
          },
        })
      }
    },
  })
}

export function renderControlIcon(Icon: any) {
  return h(Box, { component: Icon, class: classes.controlIcon })
}
