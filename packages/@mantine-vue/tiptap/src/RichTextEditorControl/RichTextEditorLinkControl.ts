import { defineComponent, h, ref, type PropType } from 'vue'
import {
  Button,
  Popover,
  TextInput,
  Tooltip,
  UnstyledButton,
  rem,
  useProps,
} from '@mantine-vue/core'
import { useDisclosure, useWindowEvent } from '@mantine-vue/hooks'
import { IconExternalLink, IconLink } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import { RichTextEditorControlBase } from './RichTextEditorControl'
import classes from '../RichTextEditor.module.css'

export type RichTextEditorLinkControlStylesNames =
  | 'control'
  | 'linkEditor'
  | 'linkEditorDropdown'
  | 'linkEditorSave'
  | 'linkEditorInput'
  | 'linkEditorExternalControl'

export interface RichTextEditorLinkControlProps {
  popoverProps?: Record<string, any>
  disableTooltips?: boolean
  initialExternal?: boolean
  icon?: any
  classNames?: any
  styles?: any
  vars?: any
  [key: string]: any
}

export const RichTextEditorLinkControl = defineComponent({
  name: 'RichTextEditorLinkControl',
  inheritAttrs: false,
  props: {
    popoverProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    disableTooltips: { type: Boolean, default: false },
    initialExternal: { type: Boolean, default: false },
    icon: { type: [Object, Function] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<RichTextEditorLinkControlProps>(
      'RichTextEditorLinkControl',
      null,
      rawProps as any,
    )
    const ctx = useRichTextEditorContext()
    const url = ref('')
    const external = ref(props.initialExternal)
    const [opened, handlers] = useDisclosure(false)

    const handleOpen = () => {
      handlers.open()
      const linkData = ctx.editor?.getAttributes('link')
      url.value = linkData?.href || ''
      external.value = linkData?.href ? linkData?.target === '_blank' : !!props.initialExternal
    }

    const handleClose = () => {
      handlers.close()
      url.value = ''
      external.value = !!props.initialExternal
    }

    const setLink = () => {
      handleClose()
      if (url.value === '') {
        ctx.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      } else {
        ctx.editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url.value, target: external.value ? '_blank' : null })
          .run()
      }
    }

    useWindowEvent('edit-link' as any, handleOpen as any)

    return () => {
      const stylesApiProps = { classNames: props.classNames, styles: props.styles }
      const active = ctx.editor && !ctx.editor.isDestroyed ? ctx.editor.isActive('link') : false

      return h(
        Popover,
        {
          trapFocus: true,
          shadow: 'md',
          withinPortal: true,
          opened: opened.value,
          onChange: (nextOpened: boolean) => !nextOpened && handleClose(),
          offset: -44,
          zIndex: 10000,
          ...props.popoverProps,
        },
        {
          default: () => [
            h(Popover.Target, null, () =>
              h(RichTextEditorControlBase, {
                ...attrs,
                icon: props.icon || IconLink,
                'aria-label': ctx.labels.linkControlLabel,
                title: ctx.labels.linkControlLabel,
                onClick: handleOpen,
                active,
                classNames: props.classNames,
                styles: props.styles,
                variant: ctx.variant,
              }),
            ),
            h(Popover.Dropdown, ctx.getStyles('linkEditorDropdown', stylesApiProps), () =>
              h('div', ctx.getStyles('linkEditor', stylesApiProps), [
                h(TextInput, {
                  placeholder: ctx.labels.linkEditorInputPlaceholder,
                  'aria-label': ctx.labels.linkEditorInputLabel,
                  type: 'url',
                  value: url.value,
                  onInput: (event: Event) => {
                    url.value = (event.currentTarget as HTMLInputElement).value
                  },
                  classNames: {
                    input: ctx.getStyles('linkEditorInput', stylesApiProps).class,
                  },
                  onKeydown: (event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      setLink()
                    }
                  },
                  rightSection: () =>
                    h(
                      Tooltip,
                      {
                        label: external.value
                          ? ctx.labels.linkEditorExternalLink
                          : ctx.labels.linkEditorInternalLink,
                        events: { hover: true, focus: true, touch: true },
                        withinPortal: true,
                        withArrow: true,
                        disabled: props.disableTooltips,
                        zIndex: 10000,
                      },
                      () =>
                        h(
                          UnstyledButton,
                          {
                            onClick: () => {
                              external.value = !external.value
                            },
                            'data-active': external.value || undefined,
                            ...ctx.getStyles('linkEditorExternalControl', stylesApiProps),
                          },
                          () =>
                            h(IconExternalLink, {
                              style: { width: rem(14), height: rem(14) },
                            }),
                        ),
                    ),
                }),
                h(
                  Button,
                  {
                    variant: 'default',
                    onClick: setLink,
                    ...ctx.getStyles('linkEditorSave', stylesApiProps),
                  },
                  () => ctx.labels.linkEditorSave,
                ),
              ]),
            ),
          ],
        },
      )
    }
  },
})

Object.assign(RichTextEditorLinkControl, { classes })
