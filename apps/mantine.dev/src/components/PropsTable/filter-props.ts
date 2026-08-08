import Fuse from 'fuse.js'
import { PROPS_DATA, type DocgenProp, type DocgenSlot } from './docgen-data'
import { isComponentSpecificProp } from './inherited-props'

export { isComponentSpecificProp }

/**
 * Props of a component, or `null` when it is missing from docgen.json.
 *
 * Inherited props are filtered out: they are
 * documented centrally on the Style props, Styles API and polymorphic
 * components pages instead of being repeated on every component.
 */
export function getComponentProps(component: string): DocgenProp[] | null {
  const data = PROPS_DATA[component]

  if (!data) {
    return null
  }

  return Object.values(data.props).filter((prop) => isComponentSpecificProp(data, prop))
}

/** Every prop of a component, inherited ones included. */
export function getAllComponentProps(component: string): DocgenProp[] | null {
  const data = PROPS_DATA[component]
  return data ? Object.values(data.props) : null
}

/**
 * Slots of a component, or `null` when it is missing from docgen.json, or
 * `[]` when it declares no `*Slots` interface.
 */
export function getComponentSlots(component: string): DocgenSlot[] | null {
  const data = PROPS_DATA[component]

  if (!data) {
    return null
  }

  return data.slots ? Object.values(data.slots) : []
}

interface Searchable {
  name: string
  description: string
  type: { name: string }
}

/** Fuzzy-filters props (or slots) by name, description and type. */
export function filterProps<T extends Searchable>(props: T[], query: string): T[] {
  if (!query.trim()) {
    return props
  }

  const fuse = new Fuse(props, {
    keys: ['name', 'description', 'type.name'],
    threshold: 0.3,
    minMatchCharLength: 1,
  })

  return fuse.search(query).map((result) => result.item)
}
