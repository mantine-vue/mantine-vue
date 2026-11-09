---
name: mantine-vue-custom-components
description: Create reusable Vue 3 components that integrate with Mantine Vue theming, factory types, polymorphism, default props, and Styles API.
---

# Mantine Vue Custom Components

Use this skill for library-quality components that should behave like Mantine Vue components. For a
one-off application wrapper, prefer ordinary Vue composition and public component props.

Inspect a current component with similar structure and query the Mantine Vue docs/MCP server before
choosing factory APIs; these internals are Vue-specific and can evolve.

## Component contract

- Define public props, slots, and emits as TypeScript interfaces and use `<script setup lang="ts">`.
- Use `defineOptions({ name: 'ComponentName', inheritAttrs: false })` when attributes must be forwarded
  deliberately to the root.
- Resolve theme defaults with `useProps` and Styles API values with `useStyles`.
- Define stable selector names, CSS variables, and data attributes; keep state styling in CSS modules.
- Wrap the SFC with `factory` or `polymorphicFactory` only when consumers need Mantine static APIs such
  as `extend`/`withProps`, theme extension, or a configurable root element.
- Forward `rootRef`, attributes, slots, and emits. Compound subcomponents should be attached as statics
  only when the established package pattern calls for it.
- Export the component, public types, and styles through the package entry points, then add docgen
  metadata and a Vue demo.

Do not copy React `forwardRef`, hooks, JSX event props, or `@mantine/*` imports. Verify type inference,
theme default props, `classNames`/`styles`, CSS variables, polymorphic roots when supported, and keyboard
and screen-reader behavior.
