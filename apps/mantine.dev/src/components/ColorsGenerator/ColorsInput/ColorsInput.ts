import { defineComponent, h, ref, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import chroma from 'chroma-js'
import {
  Button,
  ColorPicker,
  ColorSwatch,
  Group,
  Input,
  rem,
  Switch,
  TextInput,
} from '@mantine-vue/core'
import { useClipboard } from '@mantine-vue/hooks'
import { PhCheck, PhCopy } from '@phosphor-icons/vue'
import { COLORS_PRESET } from './colors-preset'
import classes from './ColorsInput.module.css'

export const ColorsInput = defineComponent({
  name: 'ColorsInput',
  props: {
    value: { type: String, required: true },
    onChange: { type: Function as PropType<(value: string) => void>, required: true },
    displayColorsInfo: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    setDisplayColorsInfo: { type: Function as PropType<(value: boolean) => void>, required: true },
  },
  setup(props) {
    const inputState = ref(props.value)
    const error = ref(false)
    const route = useRoute()
    const router = useRouter()
    const clipboard = useClipboard()

    const updateQuery = (color: string) => {
      router.replace({ query: { ...route.query, color: color.replace('#', '') } })
    }

    const handleChange = (val: string) => {
      inputState.value = val
      props.onChange(val)
    }

    const handleInputChange = (event: Event) => {
      const val = (event.currentTarget as HTMLInputElement).value
      const hasError = !chroma.valid(val)
      inputState.value = val
      error.value = hasError
      if (!hasError) {
        props.onChange(val)
        updateQuery(val)
      }
    }

    return () => {
      const presetControls = COLORS_PRESET.map((color) =>
        h(
          Button,
          {
            variant: 'default',
            leftSection: h(ColorSwatch, { size: 20, color: color.color }),
            radius: 'md',
            key: color.color,
            onClick: () => {
              handleChange(color.color)
              updateQuery(color.color)
            },
          },
          () => color.name,
        ),
      )

      return h('div', { class: classes.root }, [
        h('div', { class: classes.inputs }, [
          h(TextInput, {
            value: inputState.value,
            onInput: handleInputChange,
            error: error.value,
            label: 'Enter base color',
            class: classes.input,
            size: 'md',
            radius: 'md',
          }),
          h(ColorPicker, {
            value: props.value,
            onChange: handleChange,
            onChangeEnd: updateQuery,
            size: 'lg',
            classNames: { saturation: classes.saturation, wrapper: classes.colorPicker },
          }),
          h(Switch, {
            class: classes.switch,
            label: 'Display colors info',
            size: 'md',
            checked: props.displayColorsInfo,
            onChange: (event: Event) =>
              props.setDisplayColorsInfo((event.currentTarget as HTMLInputElement).checked),
            mt: 'xl',
          }),
          h(
            Button,
            {
              fullWidth: true,
              leftSection: clipboard.copied.value
                ? h(PhCheck, { style: { width: rem(18) } })
                : h(PhCopy, { style: { width: rem(18) } }),
              rightSection: h('span'),
              justify: 'space-between',
              size: 'md',
              mt: 'xl',
              radius: 'md',
              onClick: () => clipboard.copy(window.location.href),
            },
            () => (clipboard.copied.value ? 'Copied' : 'Copy URL'),
          ),
        ]),
        h('div', { class: classes.presets }, [
          h(Input.Label, { size: 'md' }, () => 'Preset'),
          h(Group, { gap: 'xs' }, () => presetControls),
        ]),
      ])
    }
  },
})
