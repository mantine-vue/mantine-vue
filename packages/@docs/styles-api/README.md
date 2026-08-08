# @docs/styles-api

Styles API documentation data for Mantine Vue components. Consumed by the
`Styles API` tab of every component page on the docs site.

## Adding a component

1. Create `src/data/<Component>.styles-api.ts`.
2. Export `<Component>StylesApi` typed as `StylesApiData<'selector' | ...>`.
3. Re-export the file from `src/index.ts`.
4. Add the component name to the `styles` array of its page in
   `apps/mantine.dev/src/mdx/mdx-data.ts`.

```ts
import type { StylesApiData } from '../types'

export const ExampleStylesApi: StylesApiData<'root' | 'label'> = {
  selectors: {
    root: 'Root element',
    label: 'Label element',
  },
  vars: {
    root: {
      '--example-radius': 'Controls `border-radius`',
    },
  },
  modifiers: [{ modifier: 'data-disabled', selector: 'root', condition: '`disabled` prop is set' }],
}
```

## Verifying the data

The selector union is the source of truth for the whole file – `vars` and
`modifiers` can only reference selectors listed in `selectors`. Cross-check it
against the component itself:

- **Selectors** – every `getStyles('<name>')` call in `<Component>.ts`
- **CSS variables** – the `createVarsResolver` return value in `<Component>.ts`
- **Data attributes** – the `[data-*]` selectors in `<Component>.module.css`
