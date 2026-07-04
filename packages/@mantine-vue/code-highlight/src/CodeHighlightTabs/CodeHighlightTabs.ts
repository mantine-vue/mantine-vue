import { defineComponent, h, watch, type PropType, type VNodeChild } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  CodeHighlight,
  type CodeHighlightSettings,
  type CodeHighlightStylesNames,
} from '../CodeHighlight/CodeHighlight'
import { FileIcon } from './FileIcon'
import classes from '../CodeHighlight.module.css'

export type CodeHighlightDefaultLanguage = 'tsx' | 'scss' | 'html' | 'bash' | 'json'

export interface CodeHighlightTabsCode {
  language?: CodeHighlightDefaultLanguage | (string & {})
  code: string
  fileName?: string
  icon?: VNodeChild
}

export type CodeHighlightTabsStylesNames =
  | 'root'
  | 'files'
  | 'file'
  | 'fileIcon'
  | 'filesScrollarea'
  | CodeHighlightStylesNames

export interface CodeHighlightTabsProps extends CodeHighlightSettings {
  code: CodeHighlightTabsCode[]
  getFileIcon?: (fileName: string) => VNodeChild
  defaultActiveTab?: number
  activeTab?: number
  onTabChange?: (tab: number) => void
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  [key: string]: any
}

export interface CodeHighlightTabsFactory {
  props: CodeHighlightTabsProps
  stylesNames: CodeHighlightTabsStylesNames
}

export const CodeHighlightTabs = defineComponent({
  name: 'CodeHighlightTabs',
  inheritAttrs: false,
  props: {
    code: { type: Array as PropType<CodeHighlightTabsCode[]>, required: true },
    getFileIcon: {
      type: Function as PropType<(fileName: string) => VNodeChild>,
      default: undefined,
    },
    defaultActiveTab: { type: Number, default: undefined },
    activeTab: { type: Number, default: undefined },
    onTabChange: { type: Function as PropType<(tab: number) => void>, default: undefined },
    defaultExpanded: { type: Boolean, default: undefined },
    expanded: { type: Boolean, default: undefined },
    onExpandedChange: {
      type: Function as PropType<(expanded: boolean) => void>,
      default: undefined,
    },
    withCopyButton: { type: Boolean, default: undefined },
    withExpandButton: { type: Boolean, default: false },
    withBorder: { type: Boolean, default: false },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    maxCollapsedHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    copyLabel: { type: String, default: undefined },
    copiedLabel: { type: String, default: undefined },
    expandCodeLabel: { type: String, default: undefined },
    collapseCodeLabel: { type: String, default: undefined },
    background: { type: String, default: undefined },
    controls: {
      type: [Array, Function] as PropType<CodeHighlightSettings['controls']>,
      default: undefined,
    },
    codeColorScheme: {
      type: String as PropType<CodeHighlightSettings['codeColorScheme']>,
      default: undefined,
    },
    withLineNumbers: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<CodeHighlightTabsProps>('CodeHighlightTabs', null, rawProps as any)
    const getStyles = useStyles<CodeHighlightTabsFactory>({
      name: 'CodeHighlightTabs',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
    })
    const [value, setValue] = useUncontrolled<number>({
      defaultValue: props.defaultActiveTab,
      value: () => props.activeTab,
      finalValue: 0,
      onChange: (tab) => props.onTabChange?.(tab),
    })
    const [expanded, setExpanded] = useUncontrolled<boolean>({
      defaultValue: props.defaultExpanded,
      value: () => props.expanded,
      finalValue: true,
      onChange: (next) => props.onExpandedChange?.(next),
    })

    watch(
      () => [value.value, props.code.length] as const,
      ([currentValue, length]) => {
        if (currentValue >= length) {
          setValue(length - 1)
        }
      },
      { immediate: true },
    )

    return () => {
      if (props.code.length <= 0) {
        return null
      }

      const currentCode = props.code[value.value] || { code: '', language: 'tsx', fileName: '' }
      const files = props.code.map((node, index) =>
        h(
          UnstyledButton,
          {
            ...getStyles('file'),
            key: node.fileName ?? index,
            mod: { active: index === value.value },
            onClick: () => setValue(index),
            'data-color-scheme': props.codeColorScheme,
          },
          () => [
            h(FileIcon, {
              fileIcon: node.icon,
              getFileIcon: props.getFileIcon,
              fileName: node.fileName,
              key: 'file-icon',
              ...getStyles('fileIcon'),
            }),
            h('span', { key: 'file-name' }, node.fileName),
          ],
        ),
      )

      return h(Box, { ...attrs, ...getStyles('root') }, () => [
        h(
          ScrollArea,
          {
            type: 'never',
            dir: 'ltr',
            offsetScrollbars: false,
            ...getStyles('filesScrollarea'),
          },
          () => h('div', getStyles('files'), files),
        ),
        h(CodeHighlight, {
          code: currentCode.code,
          language: currentCode.language,
          expanded: expanded.value,
          onExpandedChange: setExpanded,
          withCopyButton: props.withCopyButton,
          withExpandButton: props.withExpandButton,
          withBorder: props.withBorder,
          radius: props.radius,
          maxCollapsedHeight: props.maxCollapsedHeight,
          copiedLabel: props.copiedLabel,
          copyLabel: props.copyLabel,
          expandCodeLabel: props.expandCodeLabel,
          collapseCodeLabel: props.collapseCodeLabel,
          background: props.background,
          controls: props.controls,
          codeColorScheme: props.codeColorScheme,
          withLineNumbers: props.withLineNumbers,
          __withOffset: true,
          __staticSelector: 'CodeHighlightTabs',
          classNames: props.classNames,
          styles: props.styles,
        }),
      ])
    }
  },
})

Object.assign(CodeHighlightTabs, { classes })
