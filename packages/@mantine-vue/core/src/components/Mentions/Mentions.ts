import { Combobox } from '../Combobox'
import { Mention } from './Mention'
import MentionsComponent, { mergedClasses, varsResolver } from './Mentions.vue'

export const Mentions = Object.assign(MentionsComponent, {
  classes: { ...Combobox.classes, ...mergedClasses },
  varsResolver,
  Mention,
})

export type {
  MentionsCssVariables,
  MentionsEmits,
  MentionsOwnProps,
  MentionsOwnProps as MentionsProps,
  MentionsStylesNames,
} from './Mentions.types'
