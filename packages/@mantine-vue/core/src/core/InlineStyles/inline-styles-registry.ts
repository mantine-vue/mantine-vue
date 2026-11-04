import { inject, provide, shallowRef, type InjectionKey, type ShallowRef } from 'vue'

interface InlineStylesEntry {
  owner: ShallowRef<symbol | null>
  users: Set<symbol>
}

/**
 * Shares identical inline style rules between `InlineStyles` instances.
 *
 * Responsive style props produce a content-hashed selector, so a list of 200 cards with
 * the same responsive prop renders 200 byte-identical `<style>` elements. Every one of them
 * is a separate stylesheet the browser has to parse, index and match against.
 *
 * Instead of hoisting the rule (which would change its cascade position and break SSR
 * hydration), the first instance that registers a CSS string renders the `<style>` element
 * in place and the others render nothing. When the owner goes away, ownership moves to
 * another instance that still uses the same CSS, which then renders the element itself.
 * Because ownership is assigned in setup order, the server and the client agree on which
 * instance owns each rule.
 */
export class InlineStylesRegistry {
  private entries = new Map<string, InlineStylesEntry>()
  readonly enabled = shallowRef(true)

  setEnabled(enabled: boolean) {
    this.enabled.value = enabled
  }

  acquire(css: string, token: symbol) {
    let entry = this.entries.get(css)

    if (!entry) {
      entry = { owner: shallowRef(null), users: new Set() }
      this.entries.set(css, entry)
    }

    entry.users.add(token)

    if (entry.owner.value === null) {
      entry.owner.value = token
    }
  }

  release(css: string, token: symbol) {
    const entry = this.entries.get(css)

    if (!entry || !entry.users.delete(token)) {
      return
    }

    if (entry.users.size === 0) {
      this.entries.delete(css)
      entry.owner.value = null
      return
    }

    if (entry.owner.value === token) {
      entry.owner.value = entry.users.values().next().value!
    }
  }

  /** Reactive: re-evaluates when ownership of `css` changes. */
  isOwner(css: string, token: symbol) {
    const entry = this.entries.get(css)
    return entry ? entry.owner.value === token : true
  }

  /** Number of distinct rules currently registered. */
  get size() {
    return this.entries.size
  }
}

const InlineStylesRegistryKey = Symbol(
  'InlineStylesRegistry',
) as InjectionKey<InlineStylesRegistry | null>

export function provideInlineStylesRegistry(registry: InlineStylesRegistry | null) {
  provide(InlineStylesRegistryKey, registry)
}

export function useInlineStylesRegistry() {
  return inject(InlineStylesRegistryKey, null)
}
