import { polymorphicFactory } from '../../../core'
import CardSectionComponent from './CardSection.vue'
import type { CardSectionFactory } from './CardSection.types'
import classes from '../Card.module.css'

export const CardSection = polymorphicFactory<CardSectionFactory>(CardSectionComponent, {
  classes,
})

export type {
  CardSectionFactory,
  CardSectionOwnProps,
  CardSectionProps,
  CardSectionSlots,
  CardSectionStylesNames,
} from './CardSection.types'
