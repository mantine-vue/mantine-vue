import { factory } from '@mantine-vue/core'
import CarouselComponent, { varsResolver } from './Carousel.vue'
import type { CarouselFactory } from './Carousel.types'
import { CarouselSlide } from '../CarouselSlide'
import classes from '../../Carousel.module.css'
export const Carousel = factory<CarouselFactory>(CarouselComponent, {
  classes,
  varsResolver,
  Slide: CarouselSlide,
})
export type {
  CarouselCssVariables,
  CarouselEmits,
  CarouselFactory,
  CarouselProps,
  CarouselStylesNames,
} from './Carousel.types'
