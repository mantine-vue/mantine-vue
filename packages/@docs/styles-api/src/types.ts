/**
 * Data attribute (modifier) that Mantine adds to an element depending on the
 * props it received. Rendered in the "Data attributes" tab of the Styles API
 * table.
 */
export interface Modifier<StylesNames extends string = string> {
  /** Attribute name, for example `data-disabled` */
  modifier: string
  /** Element (or elements) the attribute is added to */
  selector: StylesNames | StylesNames[]
  /** When the attribute is added, for example "`disabled` prop is set" */
  condition?: string
  /** Description of the attribute value, used for non-boolean attributes */
  value?: string
}

/**
 * Styles API documentation for a single component.
 *
 * `StylesNames` is the union of the component's Styles API selectors – passing
 * it explicitly keeps `vars` and `modifiers` honest: they can only reference
 * selectors that actually exist.
 *
 * React Mantine derives this union from the component's `Factory` payload.
 * Mantine Vue components do not carry factory types, so the union is declared
 * per data file and verified against the component's `*.module.css`.
 */
export interface StylesApiData<StylesNames extends string = string> {
  /** Selector -> description of the element it targets */
  selectors: Record<StylesNames, string>
  /** Selector -> CSS variable -> description of what the variable controls */
  vars: Partial<Record<StylesNames, Record<string, string>>>
  /** Data attributes added to the component elements */
  modifiers?: Modifier<StylesNames>[]
}
