export interface DocgenProp {
  /** Prop name as it is used in the template, e.g. `leftSection` */
  name: string
  /** Prop type serialized to a string, e.g. `MantineSize | number` */
  type: { name: string }
  /** Whether the prop is required (not marked optional in the interface) */
  required: boolean
  /** JSDoc description of the prop, may contain inline markdown */
  description: string
  /** Value of the `@default` JSDoc tag, `null` if the tag is not set */
  defaultValue: string | null
  /**
   * Repository-relative path of the file that declares this prop, e.g.
   * `packages/@mantine-vue/core/src/components/Badge/Badge.types.ts`.
   *
   * Used to tell component-specific props apart from props inherited from
   * shared interfaces such as `BoxProps`, which is what
   * `scripts/docgen/validate-descriptions.ts` checks.
   */
  declaredIn?: string
}

export interface DocgenSlot {
  /** Slot name as it is used in the template, e.g. `leftSection` */
  name: string
  /** Slot type serialized to a string, e.g. `() => VNodeChild` */
  type: { name: string }
  /** Whether the slot is required (not marked optional in the interface) */
  required: boolean
  /** JSDoc description of the slot, may contain inline markdown */
  description: string
  /**
   * Repository-relative path of the file that declares this slot, e.g.
   * `packages/@mantine-vue/core/src/components/Badge/Badge.types.ts`.
   */
  declaredIn?: string
}

export interface DocgenComponent {
  /** Component name, e.g. `Button` – derived from the `ButtonProps` interface */
  displayName: string
  /** JSDoc description of the props interface */
  description: string
  /** All props of the component, including inherited ones */
  props: Record<string, DocgenProp>
  /**
   * All slots of the component, including inherited ones. Omitted when the
   * component does not declare a `*Slots` interface.
   */
  slots?: Record<string, DocgenSlot>
  /**
   * Repository-relative path of the file that declares the props interface.
   * A path ending in `.types.ts` marks a component that has been migrated to a
   * Single File Component and therefore owns a hand-written props interface.
   */
  declaredIn?: string
}

export type DocgenData = Record<string, DocgenComponent>

export interface GenerateDeclarationsOptions {
  /** Path to the tsconfig used to resolve path aliases */
  tsConfigPath: string
  /** Directory where `docgen.json` is written */
  outputPath: string
  /**
   * Roots that are scanned for `*Props` interfaces. Each root is analysed with
   * its own `ts.Program` to keep peak memory usage bounded.
   */
  sourcePaths: string[]
  /** Optional package-name filter, e.g. `['core']` */
  packages?: string[]
  /** Optional component-name filter, e.g. `['Button']` – used by `--only` */
  components?: string[]
  /** Only props declared inside these roots are documented */
  includePaths: string[]
  /** Props that should never be documented */
  excludeProps?: string[]
  /** Interfaces that should never be documented (exact `*Props` names) */
  excludeComponents?: string[]
  /**
   * Repository-relative file suffixes that are never scanned for `*Props`
   * declarations. Used for modules that re-declare a public props type as a
   * local stub – they would otherwise outrank the real component declaration.
   */
  excludeFiles?: string[]
  /** Map of serialized type -> replacement, applied to the final type string */
  typesReplacement?: Record<string, string>
  /**
   * How many source files share a single `ts.Program`. Lower values use less
   * memory but re-parse the dependency graph more often. Defaults to 40.
   */
  chunkSize?: number
}
