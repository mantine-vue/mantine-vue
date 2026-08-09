import { withBoxProps } from '@mantine-vue/core'
import CarouselComponent, { varsResolver } from './Carousel.vue'
import { CarouselSlide } from '../CarouselSlide'
import classes from '../../Carousel.module.css'
export const Carousel = Object.assign(withBoxProps(CarouselComponent), {
  classes,
  varsResolver,
  Slide: CarouselSlide,
})
export type { CarouselEmits, CarouselProps, CarouselStylesNames } from './Carousel.types'
