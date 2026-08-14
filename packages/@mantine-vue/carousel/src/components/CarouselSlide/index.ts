import { factory } from '@mantine-vue/core'
import CarouselSlideComponent from './CarouselSlide.vue'
import type { CarouselSlideFactory } from './CarouselSlide.types'
import classes from '../../Carousel.module.css'
export const CarouselSlide = factory<CarouselSlideFactory>(CarouselSlideComponent, { classes })
export type {
  CarouselSlideFactory,
  CarouselSlideProps,
  CarouselSlideStylesNames,
} from './CarouselSlide.types'
