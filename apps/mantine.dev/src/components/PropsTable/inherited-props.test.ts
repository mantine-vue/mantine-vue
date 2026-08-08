import { describe, expect, it } from 'vitest'
import { STYLE_PROPS_DATA } from '@mantine-vue/core/core/Box/style-props/style-props-data'
import {
  ALWAYS_INHERITED_PROPS,
  isComponentSpecificProp,
  REDECLARABLE_INHERITED_PROPS,
} from './inherited-props'

const CORE = 'packages/@mantine-vue/core/src'

const prop = (name: string, declaredIn?: string) => ({ name, declaredIn })

describe('isComponentSpecificProp', () => {
  const badge = { displayName: 'Badge' }

  it('keeps props the component owns', () => {
    expect(
      isComponentSpecificProp(badge, prop('circle', `${CORE}/components/Badge/Badge.types.ts`)),
    ).toBe(true)
    expect(
      isComponentSpecificProp(
        badge,
        prop('leftSection', `${CORE}/components/Badge/Badge.types.ts`),
      ),
    ).toBe(true)
  })

  it('drops style props inherited from Box', () => {
    for (const name of ['mt', 'bg', 'bd', 'bdrs', 'w', 'fz', 'pos']) {
      expect(
        isComponentSpecificProp(
          badge,
          prop(name, `${CORE}/core/Box/style-props/style-props.types.ts`),
        ),
      ).toBe(false)
    }
  })

  it('drops the Styles API props even when a component redeclares them', () => {
    const button = { displayName: 'Button' }

    for (const name of ['classNames', 'styles', 'vars', 'unstyled', 'mod', 'class', 'style']) {
      expect(
        isComponentSpecificProp(button, prop(name, `${CORE}/components/Button/Button.ts`)),
      ).toBe(false)
    }
  })

  it('keeps component, variant and size only when the component declares them', () => {
    for (const name of ['component', 'variant', 'size']) {
      expect(
        isComponentSpecificProp(badge, prop(name, `${CORE}/components/Badge/Badge.types.ts`)),
      ).toBe(true)

      expect(isComponentSpecificProp(badge, prop(name, `${CORE}/core/Box/Box.ts`))).toBe(false)
    }
  })

  it('falls back to the name check when declaredIn is missing', () => {
    expect(isComponentSpecificProp(badge, prop('variant'))).toBe(false)
    expect(isComponentSpecificProp(badge, prop('circle'))).toBe(true)
  })

  it('works for components that live in a nested directory', () => {
    const gridCol = { displayName: 'GridCol' }
    expect(
      isComponentSpecificProp(gridCol, prop('span', `${CORE}/components/Grid/GridCol/GridCol.ts`)),
    ).toBe(true)
  })
})

describe('inherited props lists', () => {
  it('does not list the same prop in both tiers', () => {
    for (const name of REDECLARABLE_INHERITED_PROPS) {
      expect(ALWAYS_INHERITED_PROPS.has(name)).toBe(false)
    }
  })

  it('covers every prop of the shared style props interface', () => {
    const missing = Object.keys(STYLE_PROPS_DATA).filter(
      (name) => !ALWAYS_INHERITED_PROPS.has(name) && !REDECLARABLE_INHERITED_PROPS.has(name),
    )

    expect(missing).toEqual([])
  })
})
