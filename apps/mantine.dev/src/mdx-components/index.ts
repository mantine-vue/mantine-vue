import type { Component } from 'vue'
import { Demo } from '@/demo'
import { MdxAnchor } from './MdxAnchor'
import { MdxDataTable, MdxExamplesButton } from './MdxDocsComponents'
import { MdxInstallScript } from './MdxInstallScript'
import { MdxKeyboardEventsTable } from './MdxKeyboardEventsTable'
import { MdxPre } from './MdxPre'
import { createMdxTitle } from './MdxTitle'
import { MdxCode, MdxLi, MdxParagraph, MdxUl } from './MdxTypography'
import {
  MdxAutoContrast,
  MdxClearSectionMode,
  MdxComboboxData,
  MdxComboboxDisclaimer,
  MdxComboboxFiltering,
  MdxComboboxLargeData,
  MdxComboboxProps,
  MdxGetElementRef,
  MdxGradient,
  MdxInputAccessibility,
  MdxInputFeatures,
  MdxInputSections,
  MdxPolymorphic,
  MdxStylesApiSelectors,
  MdxWrapperProps,
} from './shared'

// Map of components made available to every .mdx page. Capitalized keys are the
// custom JSX components referenced in MDX (e.g. <Demo />, <Gradient />); lower
// case keys override intrinsic markdown elements.
export const mdxComponents: Record<string, Component> = {
  // Custom content components
  Demo,
  DataTable: MdxDataTable,
  ExamplesButton: MdxExamplesButton,
  InstallScript: MdxInstallScript,
  Gradient: MdxGradient,
  AutoContrast: MdxAutoContrast,
  StylesApiSelectors: MdxStylesApiSelectors,
  Polymorphic: MdxPolymorphic,
  WrapperProps: MdxWrapperProps,
  GetElementRef: MdxGetElementRef,
  KeyboardEventsTable: MdxKeyboardEventsTable,
  InputFeatures: MdxInputFeatures,
  InputSections: MdxInputSections,
  InputAccessibility: MdxInputAccessibility,
  ClearSectionMode: MdxClearSectionMode,
  ComboboxDisclaimer: MdxComboboxDisclaimer,
  ComboboxData: MdxComboboxData,
  ComboboxFiltering: MdxComboboxFiltering,
  ComboboxLargeData: MdxComboboxLargeData,
  ComboboxProps: MdxComboboxProps,
  // Intrinsic element overrides
  a: MdxAnchor,
  p: MdxParagraph,
  ul: MdxUl,
  li: MdxLi,
  code: MdxCode,
  pre: MdxPre,
  h1: createMdxTitle(1),
  h2: createMdxTitle(2),
  h3: createMdxTitle(3),
  h4: createMdxTitle(4),
  h5: createMdxTitle(5),
  h6: createMdxTitle(6),
}
