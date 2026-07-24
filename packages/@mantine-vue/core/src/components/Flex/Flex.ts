import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  filterProps,
  hashStyleProps,
  InlineStyles,
  parseStyleProps,
  useMantineDeduplicateInlineStyles,
  useMantineTheme,
  useProps,
  useRandomClassName,
  useStyles,
  type AlignItems,
  type FlexDirection,
  type FlexWrap,
  type JustifyContent,
  type MantineSpacing,
  type StyleProp,
} from '../../core'
import { FLEX_STYLE_PROPS_DATA } from './flex-props'
import classes from './Flex.module.css'

export const Flex = withBoxProps(
  defineComponent({
    name: 'Flex',
    inheritAttrs: false,
    props: {
      component: { type: String, default: 'div' },
      gap: [String, Number, Object] as PropType<StyleProp<MantineSpacing>>,
      rowGap: [String, Number, Object] as PropType<StyleProp<MantineSpacing>>,
      columnGap: [String, Number, Object] as PropType<StyleProp<MantineSpacing>>,
      align: [String, Object] as PropType<StyleProp<AlignItems>>,
      justify: [String, Object] as PropType<StyleProp<JustifyContent>>,
      wrap: [String, Object] as PropType<StyleProp<FlexWrap>>,
      direction: [String, Object] as PropType<StyleProp<FlexDirection>>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Flex', null, rawProps)
      const theme = useMantineTheme()
      const deduplicateInlineStyles = useMantineDeduplicateInlineStyles()
      const getStyles = useStyles({
        name: 'Flex',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        unstyled: props.unstyled,
      })

      return () => {
        const parsedStyleProps = parseStyleProps({
          styleProps: {
            gap: props.gap,
            rowGap: props.rowGap,
            columnGap: props.columnGap,
            align: props.align,
            justify: props.justify,
            wrap: props.wrap,
            direction: props.direction,
          },
          theme: theme.value,
          data: FLEX_STYLE_PROPS_DATA,
        })
        const responsiveClassName =
          deduplicateInlineStyles && parsedStyleProps.hasResponsiveStyles
            ? hashStyleProps(parsedStyleProps.styles, parsedStyleProps.media)
            : useRandomClassName()

        return [
          parsedStyleProps.hasResponsiveStyles
            ? h(InlineStyles, {
                selector: `.${responsiveClassName}`,
                styles: parsedStyleProps.styles,
                media: parsedStyleProps.media,
                deduplicate: deduplicateInlineStyles,
              })
            : null,
          h(
            Box,
            {
              component: props.component,
              ...attrs,
              ...getStyles('root', {
                className: parsedStyleProps.hasResponsiveStyles ? responsiveClassName : undefined,
                style: filterProps(parsedStyleProps.inlineStyles),
              }),
            },
            () => slots.default?.(),
          ),
        ]
      }
    },
  }),
)
