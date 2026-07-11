# @mantine-vue/utils

Framework-independent utilities ported from the Mantine foundation (`rem`, `em`, `keys`, `getDefaultZIndex`, style-value helpers, and more).

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

This package has no Vue-specific code — it is the shared, low-level foundation consumed by `@mantine-vue/core` and other `@mantine-vue/*` packages. Most consumers won't need to install or import it directly; it's documented here for completeness and for anyone building on top of the Mantine Vue foundation.

## Installation

```bash
yarn add @mantine-vue/utils

# or with npm
npm i @mantine-vue/utils
```

## Usage

```ts
import { rem, getDefaultZIndex } from '@mantine-vue/utils'

rem(16) // '1rem'
getDefaultZIndex('modal') // 200
```

## License

MIT
