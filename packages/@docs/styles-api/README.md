# @docs/styles-api

Styles API documentation data for Mantine Vue components. Consumed by the
`Styles API` tab of every component page on the docs site.

## Verifying the data

`yarn styles-api:validate` checks that every component listed in a documentation
page's `styles` field has a generated record. It also cross-checks:

- **Selectors** – component style-name types, `getStyles` calls and CSS modules
- **CSS variables** – custom properties returned by component variable resolvers
- **Data attributes** – attributes used by both component sources and CSS modules

Components without Styles API selectors should not declare a `styles` entry in
`apps/mantine.dev/src/mdx/mdx-data.ts`.
