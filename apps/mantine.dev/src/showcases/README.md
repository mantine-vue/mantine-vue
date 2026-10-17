# Showcases

Showcases are complete, production-style applications built with Mantine Vue core
and extension components. They live inside the documentation site so visitors can
open them at `https://mantine-vue.dev/showcases`, and they are clearly separated
from the library packages in `packages/`.

| Showcase                                   | Route                           | Highlights                                                        |
| ------------------------------------------ | ------------------------------- | ----------------------------------------------------------------- |
| [Restaurant QR Menu](./restaurant-qr-menu) | `/showcases/restaurant-qr-menu` | Mobile first, English/Arabic (LTR/RTL), themes, layouts, ordering |

The separate _kitchen sink_ app (`apps/showcase`, served at `/showcase`) renders
every component on one page; it is a reference gallery, not a showcase application.

## Directory layout

```
apps/mantine.dev/src/showcases/
  README.md            ← this file
  registry.ts          ← list of showcases + routes registered in the docs router
  types.ts             ← ShowcaseDefinition, RouteMeta.standalone typing
  ShowcasesPage.vue    ← /showcases index page (inside the docs shell)
  shared/              ← small, framework-level helpers reusable by any showcase
    i18n.ts            ← typed i18n engine (plurals, interpolation, lazy locales, dir)
    persistence.ts     ← KeyValueStorage (localStorage / memory) with versioned JSON
    use-document-attributes.ts ← sync <html dir/lang> and restore them on exit
  restaurant-qr-menu/  ← one folder per showcase, fully self-contained
```

Rules of thumb:

- **One folder per showcase.** Everything a showcase needs (domain, data, UI,
  i18n, theme, tests, README) lives in its folder. Showcases never import from
  each other.
- **`shared/` stays generic.** Only add code there when a second showcase needs
  it and it contains no showcase-specific assumptions.
- **Relative imports inside a showcase.** Avoid the docs `@/` alias so a showcase
  can be lifted into its own app (or tested by Vitest) unchanged.
- **Own providers.** Routes with `meta: { standalone: true }` are rendered outside
  the docs providers (see `src/main.ts`), so a showcase owns its `MantineProvider`
  theme, color scheme and `DirectionProvider`. Restore anything you change on
  `<html>` when unmounting (`useDocumentAttributes` does this for `dir` / `lang`).
- **Lazy loading.** Route components must be dynamic imports so the docs bundle
  does not grow.
- **Tests next to the code.** `__tests__/*.test.ts` files are picked up by the
  root Vitest config (`apps/*/src/**/*.test.ts`). The docs workspace does not
  depend on `@vue/test-utils`; mount with `createApp` (see the restaurant helper).

## Adding a showcase

1. Create `src/showcases/<id>/index.ts` exporting a `ShowcaseDefinition`:

   ```ts
   export const myShowcase: ShowcaseDefinition = {
     id: 'my-showcase',
     path: '/showcases/my-showcase',
     title: 'My showcase',
     description: 'What it demonstrates.',
     tags: ['Forms', 'Charts'],
     cover: 'https://…',
     routes: [
       {
         path: '/showcases/my-showcase',
         component: () => import('./MyShowcaseApp.vue'),
         meta: { standalone: true },
         children: [
           /* … */
         ],
       },
     ],
   }
   ```

2. Add it to `SHOWCASES` in `registry.ts` – routes and the index card appear
   automatically.
3. Add a navigation entry in `src/mdx/mdx-nav-data.ts` (group “Showcases”) and an
   SEO entry in `scripts/seo-pages.ts`.
4. Document it in `<id>/README.md` and add tests under `<id>/__tests__`.
