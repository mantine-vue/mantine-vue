import type { VueRefTarget } from '@mantine-vue/hooks'
import type { Component, HTMLAttributes, SVGAttributes, VNodeChild } from 'vue'
import type { BoxProps, MantineColor, MantineSize, StylesApiProps, Factory } from '../../core'

export type MantineLoader = 'bars' | 'oval' | 'dots' | (string & {})
export type MantineLoaderComponent = Component
export type MantineLoadersRecord = Record<string, MantineLoaderComponent>

export interface LoaderOwnProps extends StylesApiProps<LoaderFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /** Controls loader width and height. @default 'md' */
  size?: MantineSize | (string & {}) | number
  /** Loader color. @default theme.primaryColor */
  color?: MantineColor
  /** Loader type selected from `loaders`. @default 'oval' */
  type?: MantineLoader
  /** Custom loader component registry. */
  loaders?: MantineLoadersRecord
}
export interface LoaderProps extends Omit<BoxProps, keyof LoaderOwnProps>, LoaderOwnProps {}
export interface LoaderSlots {
  /** Overrides the selected loader. */ default?: () => VNodeChild
}
export type LoaderStylesNames = 'root'
export type LoaderCssVariables = { root: '--loader-size' | '--loader-color' }
export type BarsProps = HTMLAttributes
export type DotsProps = HTMLAttributes
export type OvalProps = HTMLAttributes
export type LoaderSvgProps = SVGAttributes

export type LoaderFactory = Factory<{
  props: Omit<LoaderProps, 'rootRef'>
  slots: LoaderSlots
  ref: HTMLSpanElement
  exposed: { rootElement: Element | null }
  element: 'span'
  stylesNames: LoaderStylesNames
  vars: LoaderCssVariables

  staticComponents: {
    defaultLoaders: MantineLoadersRecord
  }
}>
