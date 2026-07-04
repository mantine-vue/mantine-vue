import { defineComponent, h, type PropType } from 'vue'
import { Box, withBoxProps } from '@mantine-vue/core'
import { useCarouselContext } from './Carousel.context'
import classes from './Carousel.module.css'

export type CarouselSlideStylesNames = 'slide'

export interface CarouselSlideProps {
  classNames?: any
  styles?: any
  mod?: any
}

const CarouselSlideBaseComponent = defineComponent({
  name: 'CarouselSlide',
  inheritAttrs: false,
  props: {
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const ctx = useCarouselContext()

    return () =>
      h(
        Box,
        {
          mod: [{ orientation: ctx.orientation }, props.mod],
          role: 'group',
          'aria-roledescription': 'slide',
          'aria-label': 'Carousel slide',
          ...attrs,
          ...ctx.getStyles('slide', {
            className: attrs.class,
            style: attrs.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
        },
        slots,
      )
  },
})

export const CarouselSlide = Object.assign(withBoxProps(CarouselSlideBaseComponent), { classes })
