import type { StylesApiData } from '../types'

export const BadgeStylesApi: StylesApiData<'root' | 'section' | 'label'> = {
  selectors: {
    root: 'Root element',
    section: 'Left and right sections',
    label: 'Badge children',
  },

  vars: {
    root: {
      '--badge-bd': 'Controls `border`',
      '--badge-bg': 'Controls `background`',
      '--badge-color': 'Controls text `color`',
      '--badge-dot-color': 'Controls dot `color`, only applicable when `variant="dot"`',
      '--badge-fz': 'Controls `font-size`',
      '--badge-height': 'Controls `height`',
      '--badge-padding-x': 'Controls horizontal `padding`',
      '--badge-radius': 'Controls `border-radius`',
    },
  },

  modifiers: [
    { modifier: 'data-block', selector: 'root', condition: '`fullWidth` prop is set' },
    { modifier: 'data-circle', selector: 'root', condition: '`circle` prop is set' },
    { modifier: 'data-with-left-section', selector: 'root', condition: '`leftSection` is set' },
    { modifier: 'data-with-right-section', selector: 'root', condition: '`rightSection` is set' },
    { modifier: 'data-variant', selector: 'root', value: 'Value of `variant` prop' },
    { modifier: 'data-position', selector: 'section', value: 'Section position: left or right' },
  ],
}
