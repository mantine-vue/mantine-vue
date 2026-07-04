import { defineComponent, h } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
import { Button, Group } from '@mantine-vue/core';

// Customize variant colors with theme.variantColorResolver.
function Demo() {
  return (
    <Group>
      <Button color="cyan">Filled</Button>
      <Button color="cyan" variant="light">Light</Button>
      <Button color="cyan" variant="outline">Outline</Button>
    </Group>
  );
}
`

const Demo = defineComponent({
  name: 'VariantColorsResolverDemo',
  setup: () => () =>
    h(Group, null, {
      default: () => [
        h(Button, { color: 'cyan' }, { default: () => 'Filled' }),
        h(Button, { color: 'cyan', variant: 'light' }, { default: () => 'Light' }),
        h(Button, { color: 'cyan', variant: 'outline' }, { default: () => 'Outline' }),
      ],
    }),
})

export const ThemingDemos = {
  variantColorsResolver: { type: 'code', component: Demo, code, centered: true } as MantineDemo,
}
