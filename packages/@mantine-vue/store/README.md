# @mantine-vue/store

Minimal external store primitive used internally by `@mantine-vue/modals`, `@mantine-vue/notifications`, `@mantine-vue/nprogress`, and `@mantine-vue/spotlight` to share reactive state outside of component instances.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

Most consumers won't install this package directly — it comes in as a dependency of the `@mantine-vue/*` extension packages listed above. It's published standalone in case you want the same pattern for your own module-level stores.

## Installation

```bash
yarn add @mantine-vue/store

# or with npm
npm i @mantine-vue/store
```

## Usage

```ts
import { createStore } from '@mantine-vue/store'

const store = createStore({ count: 0 })

store.subscribe((state) => console.log(state.count))
store.setState({ count: 1 })
```

## Peer dependencies

- `vue` ^3.5.0

## License

MIT
