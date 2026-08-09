import { polymorphicFactory } from '../../core'
import { CardSection } from './CardSection/CardSection'
import CardComponent, { varsResolver } from './Card.vue'
import type { CardFactory } from './Card.types'
import classes from './Card.module.css'

export const Card = polymorphicFactory<CardFactory>(CardComponent, {
  classes,
  varsResolver,
  Section: CardSection,
})

export type {
  CardCssVariables,
  CardFactory,
  CardOwnProps,
  CardProps,
  CardSlots,
  CardStylesNames,
} from './Card.types'
