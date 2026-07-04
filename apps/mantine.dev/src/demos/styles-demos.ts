import { defineComponent, h } from 'vue'
import { Button } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
import { Button } from '@mantine-vue/core';
import classes from './Demo.module.css';

function Demo() {
  return <Button classNames={classes}>Button with data attributes</Button>;
}
`

const Demo = defineComponent({
  name: 'ButtonDataAttributesDemo',
  setup: () => () =>
    h(
      Button,
      { variant: 'light', styles: { root: { borderRadius: '999px' } } },
      { default: () => 'Button with data attributes' },
    ),
})

export const StylesDemos = {
  dataAttributes: { type: 'code', component: Demo, code, centered: true } as MantineDemo,
}
