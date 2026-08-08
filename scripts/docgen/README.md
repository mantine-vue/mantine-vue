# docgen

Generates `apps/mantine.dev/src/.docgen/docgen.json`, the data behind the
**Props** tab of every component page. For each component it also collects
its `*Slots` interface (e.g. `BadgeSlots`), when one exists, into a sibling
`slots` field – same shape as `props`, minus `defaultValue`.

```bash
yarn docgen                          # all packages
yarn docgen core charts              # only these packages, merge into existing output
yarn docgen --only=Button,Alert      # only these components
yarn docgen --chunk-size=5           # lower memory ceiling, slower
```

The file is gitignored – run `yarn setup` once after cloning, and again after
changing component props or slots. `yarn docs:build` runs it automatically.
