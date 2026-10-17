# Restaurant QR Menu showcase

A mobile-first, customer-facing digital menu – the page a guest sees after
scanning the QR code on a restaurant table. It runs entirely on a mock API, is
fully bilingual (English / Arabic with LTR / RTL), and can be re-themed and
re-laid-out at runtime without touching ordering logic.

> This is a showcase. Payments are **simulated**: no card details are collected
> and no money is ever charged. There is no admin portal by design.

## Running it

```bash
yarn install
yarn docs            # http://127.0.0.1:4174/showcases/restaurant-qr-menu
```

Useful URLs:

| URL                                                            | What it does                                    |
| -------------------------------------------------------------- | ----------------------------------------------- |
| `/showcases/restaurant-qr-menu`                                | Menu of the last selected restaurant            |
| `/showcases/restaurant-qr-menu?r=saffron-house&table=T2`       | Simulated QR scan: restaurant + table, dine-in  |
| `/showcases/restaurant-qr-menu?r=brew-and-bloom&mode=takeaway` | Start a takeaway session                        |
| `/showcases/restaurant-qr-menu?item=sh-mixed-grill`            | Deep link to a dish (shareable, back closes it) |
| `/showcases/restaurant-qr-menu/checkout`                       | Checkout                                        |
| `/showcases/restaurant-qr-menu/orders/:orderId`                | Live order tracking                             |

Tests (from the repository root):

```bash
yarn vitest run apps/mantine.dev/src/showcases
```

## Features

The feature set combines the customer-facing patterns of leading QR menu products
(Menubly, MENU TIGER, FineDine) – grid/list/category layouts, dine-in / pickup /
delivery, table-side ordering, tipping, upselling, special instructions, guest
feedback, allergen and nutrition details and multilingual menus – into one
coherent flow.

**Restaurant experience**

- Branding (logo, cover, gallery), description, cuisines, price range and rating.
- Live open / closed status in the restaurant’s time zone, “closing soon”, next
  opening time, weekly hours with today highlighted.
- Contact (call, email, WhatsApp), map link, social links, guest Wi-Fi with copy.
- Dismissible announcements, a promotions carousel (copy / apply code, jump to dish).
- Share the menu with a generated QR code (`@mantine-vue/qr-code`).

**Menu browsing**

- Hero, chef’s picks and “recently viewed” rails, sticky category navigation with
  scroll-spy and an animated `FloatingIndicator`.
- Four layout presets (Classic, Modern, Elegant, Compact) driven by one card API.
- Badges (popular, new, spicy, recommended, chef’s special, limited), dietary icons,
  sold-out state, time-limited categories (e.g. breakfast 07:00–12:00).
- `Spotlight` search across dishes **and** categories in every menu language with
  Arabic normalisation (diacritics, tatweel, letter variants), “show all results”.
- Filters: dietary, excluded allergens, highlights, maximum spice level, price
  range, hide sold out; six sort orders; removable filter pills and empty states.
- Favorites and recently viewed, persisted per restaurant.

**Product customization**

- Image gallery (`Carousel`) with zoomable full-screen `Lightbox` and thumbnails.
- Sizes/variants, required & optional single-select groups (with “None”),
  multi-select add-ons with min/max limits, unavailable options.
- Quantity, special instructions (with counter), live price, inline validation
  with scroll-to-first-error, nutrition & allergens accordion, “pairs well with”
  upsell (or alternatives when sold out), share link, edit an existing cart line.

**Cart & ordering**

- Persistent cart per restaurant, merge of identical lines, undo remove, edit,
  clear with confirmation, unavailable-item detection, upsell, order notes.
- Promo codes validated by the API (unknown, expired, minimum spend, order type).
- Totals: subtotal, discounts, mode-specific fees (service charge, packaging),
  delivery fee with free-delivery threshold, tax inclusive **or** exclusive, tips
  (preset % or custom amount). Integer minor units, so BHD (3 decimals), AED and
  USD are all exact.
- Dine-in (table selection / QR), takeaway and delivery flows, scheduled orders
  when the restaurant is closed, contact & address forms (`@mantine-vue/form`),
  “remember my details”, payment method choice (simulated online payment).
- Server-side re-validation and re-pricing, clear error states, order tracking
  with polling, status timeline, cancel window, re-order, call waiter / request
  the bill, post-order rating.

**Resilience & UX**

- Loading skeletons, error and empty states, offline banner (`useNetwork`), cached
  menu snapshot when the API fails, “unreliable network” simulation.
- Mobile bottom sheets, desktop modals/drawers, sticky bottom actions, safe-area
  insets, reduced motion, `content-visibility` for long menus, lazy images with
  `srcset`, split chunks for checkout / tracking / secondary drawers.
- Accessibility: skip link, labelled icon buttons, `aria-current` navigation,
  `aria-live` totals, fieldsets/legends for modifier groups, focus management by
  Mantine overlays, keyboard search (`Ctrl/⌘ + K`).

## Architecture

```
restaurant-qr-menu/
  index.ts                 routes + ShowcaseDefinition
  config.ts                base path, storage namespace, defaults, mock latency
  RestaurantQrMenuApp.vue  route entry: creates the context, renders provider + shell
  app/
    create-qr-menu-context.ts  composition root (services, stores, i18n, derived state)
    use-qr-menu.ts             provide / inject
  domain/                  pure TypeScript business logic – no Vue, no UI
    types.ts               data models (Restaurant, Menu, Product, Order, …)
    money.ts               minor-unit helpers per currency
    pricing.ts             unit prices, cart line ids, totals (fees, tax, tip, promo)
    modifiers.ts           defaults, toggling, validation of variants & groups
    promotions.ts          promo eligibility and discounts
    availability.ts        opening hours, time zones, schedule slots
    menu-query.ts          search normalisation, filters, sorting, grouping
    order-rules.ts         checkout rules shared by the form and the "server"
  services/
    contracts.ts           repository / service interfaces + ApiError
    mock/                  mock implementation of the contracts
      create-mock-services.ts  latency, failures, validation, persisted orders
      mock-network.ts      async + latency + failure simulation
      data/                restaurants, menus, promotions, images
  stores/                  reactive state (Vue reactivity, persisted via KeyValueStorage)
    cart-store.ts  customer-store.ts  preferences-store.ts
    restaurant-data-store.ts  menu-filter-store.ts
  i18n/                    locale registry, formatters, dictionaries (en, ar)
  theme/                   theme / font / layout presets and the Mantine theme builder
  composables/             UI-level behaviour shared by components (cart actions, …)
  components/              presentation, grouped by feature
  views/                   MenuView, CheckoutView, OrderTrackingView
  __tests__/               Vitest suites
```

Data flows one way: **services → stores → context → components**.
Components never import from `services/mock`; they call `useQrMenu()` and the
composables. All business rules live in `domain/` and are reused by the UI (for
instant feedback) and by the mock API (as the authoritative check), exactly as a
real backend would re-validate.

Presentation is configuration-driven: a layout preset only selects a card
variant, grid columns, hero and navigation style. Every card variant receives the
same view model and actions from `useProductCard`, so switching layout, theme,
font, density or language never changes ordering behaviour (covered by
`__tests__/theme-layout.test.ts`).

The showcase route is rendered **outside** the docs providers (`meta.standalone`,
see `src/main.ts`), owns its `MantineProvider` / `DirectionProvider`, and
restores `<html dir lang>` when you leave.

## Mock data

`services/mock/data` contains three restaurants that exercise different settings:

| Restaurant     | Currency | Tax                 | Fees                             | Modes                       | Theme / layout     |
| -------------- | -------- | ------------------- | -------------------------------- | --------------------------- | ------------------ |
| Saffron House  | BHD (3)  | 10 % VAT, exclusive | 5 % service (dine-in), packaging | dine-in, takeaway, delivery | Saffron / Modern   |
| Brew & Bloom   | AED      | 5 % VAT, inclusive  | –                                | dine-in, takeaway           | Olive / Classic    |
| Luna Trattoria | USD      | 8.875 % sales tax   | –                                | dine-in, takeaway, delivery | Midnight / Elegant |

Menus include variants, required/optional groups, unavailable options, sold-out
dishes, time-limited categories, pairings, ratings and bilingual content.
Promo codes: `WELCOME10`, `FREEDEL`, `GRILL15`, `SUMMER24` (expired),
`MORNING15`, `BLOOM10`, `LUNA20`. Photos come from Unsplash (see `images.ts`);
a neutral placeholder is shown if an image fails.

Placed orders are stored in `localStorage` (`mantine-vue:qr-menu:orders`) and
their status is derived from the elapsed time (every ~25 s) so tracking keeps
working across reloads. The configurator can force the restaurant open/closed
and make 30 % of requests fail.

## Replacing the mock services with a real API

Implement `QrMenuServices` from `services/contracts.ts` and pass it to the context:

```ts
// services/http/create-http-services.ts
import { ApiError, type QrMenuServices } from '../contracts'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`https://api.example.com${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError('network', 'Network error')
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const code =
      response.status === 404 ? 'not-found' : response.status === 422 ? 'validation' : 'unknown'
    throw new ApiError(code, body.message ?? response.statusText, body)
  }
  return response.json() as Promise<T>
}

export function createHttpServices(): QrMenuServices {
  return {
    restaurants: {
      list: () => request('/restaurants'),
      getById: (id) => request(`/restaurants/${id}`),
    },
    menus: { getMenu: (id) => request(`/restaurants/${id}/menu`) },
    promotions: {
      listActive: (id) => request(`/restaurants/${id}/promotions`),
      findByCode: (id, code) =>
        request(`/restaurants/${id}/promotions/${encodeURIComponent(code)}`),
    },
    orders: {
      placeOrder: (draft) => request('/orders', { method: 'POST', body: JSON.stringify(draft) }),
      getOrder: (id) => request(`/orders/${id}`),
      listOrders: (id) => request(`/restaurants/${id}/orders?device=me`),
      cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
      submitFeedback: (id, feedback) =>
        request(`/orders/${id}/feedback`, { method: 'POST', body: JSON.stringify(feedback) }),
    },
    serviceRequests: {
      create: (input) =>
        request('/service-requests', { method: 'POST', body: JSON.stringify(input) }),
    },
  }
}
```

```ts
// RestaurantQrMenuApp.vue
const context = createQrMenuContext({ services: createHttpServices() })
```

Contract expectations: money in minor units, `LocalizedText` objects for content,
validation failures as `ApiError('validation', …, { issues: CheckoutIssue[] })`,
`rate-limited` with `{ retryInSeconds }`. Map your API payloads to the types in
`domain/types.ts` inside the service layer – components and stores stay unchanged.
The demo-only configurator options (force open, unreliable network) are wired to
the mock only and simply have no effect with a real API.

## Adding a restaurant

1. Add a `Restaurant` in `services/mock/data/restaurants.ts` (or your API): ordering
   settings (modes, tables, tax, fees, tips, delivery, payment methods), hours,
   time zone, currency and `branding` (default theme + layout preset).
2. Add its `Menu` in `services/mock/data/menus/<id>.ts` using the `product`,
   `group`, `option` and `variant` builders, then register it in
   `services/mock/data/index.ts`.
3. Optionally add promotions in `promotions.ts`.

The restaurant appears in the configurator and is reachable with `?r=<id>`.

## Adding a language

1. Create `i18n/locales/<code>.ts` exporting `DictionaryShape<QrMenuMessages>` as
   default – TypeScript reports any missing key, and a test checks the key set.
2. Register it in `i18n/index.ts`: add a `LocaleDefinition` to `LOCALES`
   (`dir: 'rtl'` for right-to-left scripts, `intl` for number/date formatting) and
   a lazy loader to `LOADERS`.
3. Translate menu content by adding the language to `LocalizedText` values. Missing
   content falls back to the restaurant’s default language.
4. If the script needs a different typeface, add its family to the font presets’
   stacks in `theme/presets.ts`.

No business logic changes are required; plural rules come from `Intl.PluralRules`.

## Creating a theme

Add a `ThemePreset` to `THEME_PRESETS` in `theme/presets.ts`:

```ts
{ id: 'forest', brand: '#2b8a3e', accent: '#e67700', radius: 'lg', font: 'rounded' }
```

`buildMantineTheme` generates 10-shade `brand` and `accent` palettes
(`@mantine-vue/colors-generator`), sets fonts, radius and density-scaled spacing.
Add the preset name to `settings.themes` in every dictionary. Guests can further
override brand/accent colors, font, radius, density and color scheme.

## Adding a layout preset

1. Add a `LayoutPreset` to `LAYOUT_PRESETS` (card variant, columns per breakpoint,
   hero, category navigation and section title style, description lines, image
   ratio, gap).
2. For a new card look, create `components/menu/cards/ProductCard<Name>.vue` that
   accepts `{ model, layout }` and emits `open`, `add`, `toggleFavorite`, then map
   it in `ProductCard.vue`. Do not add business logic to the card – everything
   comes from `useProductCard`.
3. Add translations for `settings.layouts.<id>` / `settings.layoutHints.<id>` and,
   optionally, a schematic in `LayoutPreview.vue`.

## Tests

| Suite                             | Covers                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `pricing.test.ts`                 | unit prices, line ids, fees, inclusive/exclusive tax, delivery, promos, tips          |
| `modifiers.test.ts`               | defaults, single/multi selection rules, validation errors                             |
| `cart-store.test.ts`              | add/merge/update/remove/undo, limits, per-restaurant carts, persistence               |
| `order-service.test.ts`           | order submission, server validation, scheduling, status progression, cancel, failures |
| `availability-and-search.test.ts` | opening hours across midnight, slots, Arabic search, filters, sorting                 |
| `i18n-rtl.test.ts`                | dictionary completeness, runtime switching, plurals, formatting, `<html dir/lang>`    |
| `theme-layout.test.ts`            | every theme preset, overrides, layout switching keeps ordering identical              |
