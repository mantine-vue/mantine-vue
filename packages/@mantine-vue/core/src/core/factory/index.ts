export type { Factory, PolymorphicFactory } from './create-factory'

export { createPolymorphicComponent, polymorphic } from './create-polymorphic-component'
export type {
  ComponentProps,
  EmptyProps,
  MantineElementType,
  PolymorphicComponentProps,
  PolymorphicMarker,
  PolymorphicRef,
  PropsOf,
} from './create-polymorphic-component'

export { createWithProps, factory, identity } from './factory'
export type {
  ComponentClasses,
  ComponentVariablesResolver,
  ExtendComponent,
  ExtendCompoundComponent,
  ExtendsRootComponent,
  FactoryComponentWithProps,
  MantineComponent,
  MantineComponentStaticProperties,
  RootRefProp,
  RootRefProps,
  StaticComponents,
  ThemeExtend,
} from './factory'

export type {
  DataAttributes,
  ElementAttributes,
  EmitsToProps,
  FactoryComponentProps,
  FactoryPayload,
  PolymorphicFactoryPayload,
} from './factory-payload'

export type {
  CssVariable,
  FactoryClassNames,
  FactoryPartialVarsResolver,
  FactoryStyles,
  FactoryVarsResolver,
  PartialTransformVars,
  StylesApiRecord,
  StylesNamesOf,
  StylesRecord,
  TransformVars,
} from './factory-styles-api'

export { polymorphicFactory } from './polymorphic-factory'
export type {
  MantinePolymorphicComponent,
  PolymorphicComponentWithProps,
  PolymorphicProps,
} from './polymorphic-factory'

export { useForwardedRef } from './use-forwarded-ref'
