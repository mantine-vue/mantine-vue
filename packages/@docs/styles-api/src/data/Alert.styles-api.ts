import type { StylesApiData } from '../types'

export const AlertStylesApi: StylesApiData<
  'root' | 'wrapper' | 'body' | 'title' | 'label' | 'message' | 'icon' | 'closeButton'
> = {
  selectors: {
    root: 'Root element',
    wrapper: 'Wrapper around `body` and `icon`',
    body: 'Body element, contains `title` and `message`',
    title: 'Title element, contains `label` and close button',
    label: 'Title label',
    message: 'Alert message',
    icon: 'Icon element',
    closeButton: 'Close button',
  },

  vars: {
    root: {
      '--alert-bd': 'Controls `border`',
      '--alert-bg': 'Controls `background`',
      '--alert-color': 'Controls `color`',
      '--alert-radius': 'Controls `border-radius`',
    },
  },

  modifiers: [
    {
      modifier: 'data-with-close-button',
      selector: 'title',
      condition: '`withCloseButton` prop is set',
    },
    { modifier: 'data-variant', selector: 'message', value: 'Value of `variant` prop' },
  ],
}
