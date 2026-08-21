import type { FunctionalComponent, VNodeChild } from 'vue'

/**
 * Bridges a `renderX` option / scoped slot into a template.
 *
 * These callbacks replace a built-in section only when they actually return a
 * node, so the template has to branch on the *result*. Resolving inside the
 * `v-if` and replaying the cached node keeps the callback running exactly once
 * per render, the way the equivalent render function did:
 *
 * ```vue
 * <script setup lang="ts">
 * const custom = createRenderable(() => table.options.renderThing?.({ table }))
 * </script>
 *
 * <template>
 *   <MVT_RenderNode v-if="custom.has()" :node="custom.node" />
 *   <DefaultThing v-else />
 * </template>
 * ```
 *
 * `v-if` runs before the bindings beside it, so `node` always holds the value
 * `has()` just resolved.
 */
export const createRenderable = (resolve: () => VNodeChild) => {
  let node: VNodeChild

  return {
    /** Resolves and caches the node for this render. Call from a `v-if`. */
    has: () => !!(node = resolve()),
    /** The node cached by the last `has()` call. */
    get node() {
      return node
    },
  }
}

/**
 * Renders an already-resolved `VNodeChild` passed as a prop.
 *
 * The node has to arrive as a *prop*: a prop-less `<component :is="() => node">`
 * would mount once and never update, because Vue has nothing to diff and skips
 * the re-render.
 */
export const MVT_RenderNode: FunctionalComponent<{ node?: VNodeChild }> = (props) =>
  props.node as any

MVT_RenderNode.props = ['node']
MVT_RenderNode.inheritAttrs = false
MVT_RenderNode.displayName = 'MVTRenderNode'
