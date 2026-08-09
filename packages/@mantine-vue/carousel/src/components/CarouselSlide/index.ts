import { withBoxProps } from '@mantine-vue/core'
import CarouselSlideComponent from './CarouselSlide.vue'
import classes from '../../Carousel.module.css'
export const CarouselSlide = Object.assign(withBoxProps(CarouselSlideComponent), { classes })
export type { CarouselSlideProps, CarouselSlideStylesNames } from './CarouselSlide.types'
