import { withBoxProps } from '../../core'
import { CardSection } from './CardSection/CardSection'
import CardComponent, { varsResolver } from './Card.vue'
import classes from './Card.module.css'
export const Card = withBoxProps(
  Object.assign(CardComponent, { classes, varsResolver, Section: CardSection }),
)
export type {
  CardCssVariables,
  CardOwnProps,
  CardProps,
  CardSlots,
  CardStylesNames,
} from './Card.types'
