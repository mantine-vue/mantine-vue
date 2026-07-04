import { defineComponent, h, ref, type PropType } from 'vue'
import {
  CheckIcon,
  ColorPicker,
  ColorSwatch,
  DEFAULT_THEME,
  Group,
  Input,
  Popover,
  TextInput,
  UnstyledButton,
} from '@mantine-vue/core'
import { ColorWheelIcon } from './ColorWheelIcon'
import { getControlLabel } from './get-control-label'
import classes from './ConfiguratorColorControl.module.css'

export const ConfiguratorColorControl = defineComponent({
  name: 'ConfiguratorColorControl',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    prop: { type: String, required: true },
  },
  setup(props, { attrs }) {
    const colorPickerColor = ref('#fff')

    const handleColorPickerChange = (color: string) => {
      colorPickerColor.value = color
      props.onChange(color)
    }

    return () => {
      const colors = Object.keys(DEFAULT_THEME.colors)
        .filter((color) => color !== 'dark')
        .map((color) =>
          h(
            ColorSwatch,
            {
              color: `var(--mantine-color-${color}-filled)`,
              component: 'button',
              key: color,
              onClick: () => props.onChange(color),
              radius: 'sm',
              class: classes.swatch,
              'aria-label': color,
            },
            () => (props.value === color ? h(CheckIcon, { class: classes.check }) : null),
          ),
        )

      return h(
        Input.Wrapper,
        { ...attrs, labelElement: 'div', label: getControlLabel(props.prop) },
        () =>
          h(Group, { gap: 2, mt: 2, wrap: 'wrap' }, () => [
            ...colors,
            h(
              Popover,
              { radius: 'md', position: 'bottom-end', shadow: 'md' },
              {
                default: () => [
                  h(Popover.Target, null, () =>
                    h(
                      UnstyledButton,
                      { class: classes.colorControl, 'aria-label': 'Pick color' },
                      () => h(ColorWheelIcon),
                    ),
                  ),
                  h(Popover.Dropdown, { p: 8 }, () => [
                    h(ColorPicker, {
                      value: colorPickerColor.value,
                      onChange: handleColorPickerChange,
                      format: 'rgba',
                    }),
                    h(TextInput, {
                      value: colorPickerColor.value,
                      onChange: (event: Event) =>
                        handleColorPickerChange((event.currentTarget as HTMLInputElement).value),
                      placeholder: 'Enter color',
                      radius: 'md',
                      size: 'xs',
                      mt: 'xs',
                    }),
                  ]),
                ],
              },
            ),
          ]),
      )
    }
  },
})
