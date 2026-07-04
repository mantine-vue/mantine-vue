import { defineComponent, h, type PropType } from 'vue'

const STRIP_CELLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1']

export const DigitColumn = defineComponent({
  name: 'RollingNumberDigitColumn',
  props: {
    digit: { type: String, required: true },
    previousDigit: { type: [String, null] as PropType<string | null>, default: null },
    empty: { type: Boolean, default: false },
    valueDirection: { type: String as PropType<'up' | 'down'>, required: true },
    getStyles: {
      type: Function as PropType<(selector: string, options?: any) => Record<string, any>>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const digitIndex = Number.parseInt(props.digit, 10)
      const previousDigitIndex =
        props.previousDigit !== null ? Number.parseInt(props.previousDigit, 10) : digitIndex
      const wrapsForward =
        props.valueDirection === 'up' &&
        props.previousDigit !== null &&
        digitIndex < previousDigitIndex &&
        digitIndex <= 1
      const animateToIndex = wrapsForward ? digitIndex + 10 : digitIndex
      const direction = digitIndex >= previousDigitIndex ? 'up' : 'down'
      const columnStyles = props.getStyles('digitColumn')

      return h(
        'span',
        {
          ...props.getStyles('digit'),
          'data-empty': props.empty || undefined,
          'aria-hidden': 'true',
        },
        h(
          'span',
          {
            key: props.digit,
            ...columnStyles,
            style: {
              ...columnStyles.style,
              transform: `translateY(${-digitIndex}em)`,
              '--rn-roll-from': `translateY(${-previousDigitIndex}em)`,
              '--rn-roll-to': `translateY(${-animateToIndex}em)`,
            },
            'data-direction': direction,
          },
          STRIP_CELLS.map((digit, index) => h('span', { key: index }, digit)),
        ),
      )
    }
  },
})
