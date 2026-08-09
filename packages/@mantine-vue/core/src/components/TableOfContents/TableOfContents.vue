<script lang="ts">
import { createVarsResolver, getFontSize, getRadius, rem } from '../../core'
export const varsResolver = createVarsResolver<any>(
  (theme, { color, size, variant, autoContrast, depthOffset, radius }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })
    return {
      root: {
        '--toc-bg': variant !== 'none' ? colors.background : undefined,
        '--toc-color': variant !== 'none' ? colors.color : undefined,
        '--toc-size': getFontSize(size),
        '--toc-depth-offset': rem(depthOffset),
        '--toc-radius': getRadius(radius),
      },
    }
  },
)
const defaultProps = {
  variant: 'filled',
  getControlProps: ({ data }: any) => ({ children: data.value }),
} as const
</script>
<script setup lang="ts">
import { h, useAttrs } from 'vue'
import { assignRef, useId, useScrollSpy, type UseScrollSpyHeadingData } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import type { InitialTableOfContentsData, TableOfContentsOwnProps } from './TableOfContents.types'
import classes from './TableOfContents.module.css'
defineOptions({ name: 'TableOfContents', inheritAttrs: false })
const rawProps = withDefaults(defineProps<TableOfContentsOwnProps>(), {
  color: undefined,
  size: undefined,
  autoContrast: undefined,
  scrollSpyOptions: undefined,
  initialData: undefined,
  getControlProps: undefined,
  minDepthToOffset: undefined,
  depthOffset: undefined,
  radius: undefined,
  reinitializeRef: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('TableOfContents', defaultProps, rawProps)
const id = useId()
const spy = useScrollSpy(props.scrollSpyOptions ?? {})
assignRef(props.reinitializeRef, spy.reinitialize)
const getStyles = useStyles({
  name: 'TableOfContents',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})
const renderTableOfContents = () => {
  const headings = (spy.initialized.value ? spy.data.value : (props.initialData ?? [])) as Array<
    UseScrollSpyHeadingData | InitialTableOfContentsData
  >
  return h(
    Box,
    {
      ...attrs,
      variant: props.variant,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    },
    () =>
      headings.map((data, index) => {
        const normalized = {
          ...data,
          id: data.id ?? `${id.value}-${index}`,
          getNode: 'getNode' in data ? data.getNode : () => null as any,
        } as UseScrollSpyHeadingData
        const controlProps =
          props.getControlProps?.({ active: index === spy.active.value, data: normalized }) ?? {}
        const { children, ...rest } = controlProps
        return h(
          UnstyledButton,
          {
            ...rest,
            key: normalized.id,
            variant: props.variant,
            'data-active': index === spy.active.value || undefined,
            style: [
              { '--depth-offset': data.depth - (props.minDepthToOffset ?? 1) },
              controlProps.style,
              getStyles('control').style,
            ],
            class: [getStyles('control').class, controlProps.class, controlProps.className],
          },
          () => (typeof children === 'function' ? children() : children),
        )
      }),
  )
}
</script>
<template><renderTableOfContents /></template>
