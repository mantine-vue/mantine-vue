import {
  Box,
  ScrollArea,
  UnstyledButton,
  createVarsResolver,
  getRadius,
  getThemeColor,
  rem,
  useMantineContext,
  useProps,
  useStyles,
} from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import classes from '../CodeHighlight.module.css'
import {
  useHighlight,
  type CodeHighlightAdapter,
} from '../CodeHighlightProvider/CodeHighlightProvider'
import {
  provideCodeHighlightContext,
  type CodeHighlightContextValue,
} from './CodeHighlight.context'
import {
  CodeHighlightControl,
  type CodeHighlightControlProps,
} from './CodeHighlightControl/CodeHighlightControl'
import { CopyCodeButton } from './CopyCodeButton/CopyCodeButton'
import { ExpandCodeButton } from './ExpandCodeButton/ExpandCodeButton'

export type CodeHighlightStylesNames =
  | 'codeHighlight'
  | 'pre'
  | 'code'
  | 'control'
  | 'controlTooltip'
  | 'controls'
  | 'scrollarea'
  | 'showCodeButton'
  | 'lineNumbers'
  | 'codeWrapper'

export type CodeHighlightCssVariables = {
  codeHighlight: '--ch-max-height' | '--ch-background' | '--ch-radius'
}

export interface CodeHighlightSettings {
  copyLabel?: string
  copiedLabel?: string
  defaultExpanded?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  maxCollapsedHeight?: number | string
  withCopyButton?: boolean
  withExpandButton?: boolean
  expandCodeLabel?: string
  collapseCodeLabel?: string
  background?: string
  radius?: string | number
  withBorder?: boolean
  withLineNumbers?: boolean
  controls?: VNodeChild[] | (() => VNodeChild)
  codeColorScheme?: 'dark' | 'light' | (string & {})
}

export interface CodeHighlightProps extends CodeHighlightSettings {
  __withOffset?: boolean
  __staticSelector?: string
  __inline?: boolean
  code: string
  language?: string
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  class?: any
  style?: any
  [key: string]: any
}

export interface CodeHighlightFactory {
  props: CodeHighlightProps
  stylesNames: CodeHighlightStylesNames
  vars: CodeHighlightCssVariables
}

const defaultProps = {
  withCopyButton: true,
  expandCodeLabel: 'Expand code',
  collapseCodeLabel: 'Collapse code',
} satisfies Partial<CodeHighlightProps>

const varsResolver = createVarsResolver<any>(
  (theme, { maxCollapsedHeight, background, radius }) => ({
    codeHighlight: {
      '--ch-max-height': rem(maxCollapsedHeight),
      '--ch-background': background ? getThemeColor(background, theme) : undefined,
      '--ch-radius': typeof radius !== 'undefined' ? getRadius(radius) : undefined,
    },
  }),
)

function renderHtmlOrText(isHighlighted: boolean, highlightedCode: string, code: string) {
  return isHighlighted ? { innerHTML: highlightedCode } : { textContent: code.trim() }
}

function cx(...values: any[]) {
  return values.filter(Boolean)
}

function resolveColorScheme(value: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
  if (value !== 'auto') {
    return value
  }

  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const CodeHighlightBase = defineComponent({
  name: 'CodeHighlight',
  inheritAttrs: false,
  props: {
    code: { type: String, required: true },
    language: { type: String, default: undefined },
    copyLabel: { type: String, default: undefined },
    copiedLabel: { type: String, default: undefined },
    defaultExpanded: { type: Boolean, default: undefined },
    expanded: { type: Boolean, default: undefined },
    onExpandedChange: {
      type: Function as PropType<(expanded: boolean) => void>,
      default: undefined,
    },
    maxCollapsedHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    withCopyButton: { type: Boolean, default: undefined },
    withExpandButton: { type: Boolean, default: false },
    expandCodeLabel: { type: String, default: undefined },
    collapseCodeLabel: { type: String, default: undefined },
    background: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<string | number>, default: undefined },
    withBorder: { type: Boolean, default: false },
    withLineNumbers: { type: Boolean, default: false },
    controls: {
      type: [Array, Function] as PropType<CodeHighlightSettings['controls']>,
      default: undefined,
    },
    codeColorScheme: {
      type: String as PropType<CodeHighlightSettings['codeColorScheme']>,
      default: undefined,
    },
    __withOffset: { type: Boolean, default: false },
    __staticSelector: { type: String, default: undefined },
    __inline: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs }) {
    const props = useProps<CodeHighlightProps>('CodeHighlight', defaultProps, rawProps as any)
    const mantine = useMantineContext()
    const getStyles = useStyles<CodeHighlightFactory>({
      name: props.__staticSelector || 'CodeHighlight',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      unstyled: props.unstyled,
      varsResolver,
      rootSelector: 'codeHighlight',
    } as any)
    const [expanded, setExpanded] = useUncontrolled<boolean>({
      value: () => props.expanded,
      defaultValue: props.defaultExpanded,
      finalValue: true,
      onChange: (value) => props.onExpandedChange?.(value),
    })
    const highlight = useHighlight()

    provideCodeHighlightContext({
      getStyles,
      get codeColorScheme() {
        return props.codeColorScheme
      },
    })

    return () => {
      const colorScheme = resolveColorScheme(mantine.colorScheme.value)
      const highlightedCode = highlight({
        code: props.code.trim(),
        language: props.language,
        colorScheme: props.codeColorScheme ?? colorScheme,
      })
      const codeContent = renderHtmlOrText(
        highlightedCode.isHighlighted,
        highlightedCode.highlightedCode,
        props.code,
      )

      if (props.__inline) {
        return h(Box, {
          component: 'code',
          ...attrs,
          ...highlightedCode.codeElementProps,
          ...getStyles('codeHighlight', {
            className: cx(highlightedCode.codeElementProps?.class, attrs.class),
            style: [highlightedCode.codeElementProps?.style, attrs.style],
          }),
          'data-with-border': props.withBorder || undefined,
          ...codeContent,
        })
      }

      const renderedControls =
        typeof props.controls === 'function' ? props.controls() : props.controls
      const controlsArray = Array.isArray(renderedControls)
        ? renderedControls
        : renderedControls
          ? [renderedControls]
          : []
      const shouldDisplayControls =
        controlsArray.length > 0 || props.withExpandButton || props.withCopyButton

      return h(
        Box,
        {
          ...attrs,
          ...getStyles('codeHighlight'),
          dir: 'ltr',
          'data-code-color-scheme': props.codeColorScheme,
          'data-with-border': props.withBorder || undefined,
        },
        () => [
          shouldDisplayControls
            ? h(
                'div',
                { ...getStyles('controls'), 'data-with-offset': props.__withOffset || undefined },
                [
                  ...controlsArray,
                  props.withExpandButton
                    ? h(ExpandCodeButton, {
                        expanded: expanded.value,
                        onExpand: setExpanded,
                        expandCodeLabel: props.expandCodeLabel,
                        collapseCodeLabel: props.collapseCodeLabel,
                      })
                    : null,
                  props.withCopyButton
                    ? h(CopyCodeButton, {
                        code: props.code,
                        copiedLabel: props.copiedLabel,
                        copyLabel: props.copyLabel,
                      })
                    : null,
                ],
              )
            : null,
          h(
            ScrollArea,
            {
              type: 'hover',
              scrollbarSize: 4,
              dir: 'ltr',
              offsetScrollbars: false,
              'data-collapsed': !expanded.value || undefined,
              styles: { viewport: { overscrollBehaviorInline: 'none' } },
              ...getStyles('scrollarea'),
            },
            () =>
              h('div', getStyles('codeWrapper'), [
                props.withLineNumbers
                  ? h(
                      'div',
                      {
                        ...getStyles('lineNumbers'),
                        'data-with-offset': props.__withOffset || undefined,
                      },
                      props.code
                        .trim()
                        .split('\n')
                        .map((_, index) => h('div', { key: index }, index + 1)),
                    )
                  : null,
                h(
                  'pre',
                  { ...getStyles('pre'), 'data-with-offset': props.__withOffset || undefined },
                  h('code', {
                    ...highlightedCode.codeElementProps,
                    ...getStyles('code', {
                      className: highlightedCode.codeElementProps?.class,
                      style: highlightedCode.codeElementProps?.style,
                    }),
                    ...codeContent,
                  }),
                ),
              ]),
          ),
          h(
            UnstyledButton,
            {
              ...getStyles('showCodeButton'),
              mod: { hidden: expanded.value },
              onClick: () => setExpanded(true),
              'data-code-color-scheme': props.codeColorScheme,
            },
            () => props.expandCodeLabel,
          ),
        ],
      )
    }
  },
})

export const CodeHighlight = Object.assign(CodeHighlightBase, {
  classes,
  varsResolver,
  Control: CodeHighlightControl,
})

export type { CodeHighlightAdapter, CodeHighlightContextValue, CodeHighlightControlProps }
