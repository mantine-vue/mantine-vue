# @mantine-vue/hooks

Collection of 80+ Vue composables for state and UI management, equivalent to `@mantine/hooks`.

> Mantine Vue is an independent community port of [Mantine](https://mantine.dev/) for Vue 3. It is not affiliated with or endorsed by the Mantine team.

## Installation

```bash
yarn add @mantine-vue/hooks

# or with npm
npm i @mantine-vue/hooks
```

## Usage

```vue
<script setup>
import { useDisclosure } from '@mantine-vue/hooks'

const [opened, handlers] = useDisclosure(false)
</script>
```

## Documentation

Full list of composables and examples: [mantine-vue.dev/hooks/use-click-outside](https://mantine-vue.dev/hooks/use-click-outside)

## Peer dependencies

- `vue` ^3.5.0

## License

MIT
