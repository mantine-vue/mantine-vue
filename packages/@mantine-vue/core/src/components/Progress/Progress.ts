import { withBoxProps } from '../../core'
import { ProgressLabel } from './ProgressLabel/ProgressLabel'
import { ProgressRoot } from './ProgressRoot/ProgressRoot'
import { ProgressSection } from './ProgressSection/ProgressSection'
import ProgressComponent from './Progress.vue'
import classes from './Progress.module.css'

export const Progress = Object.assign(withBoxProps(ProgressComponent), {
  classes,
  Root: ProgressRoot,
  Section: ProgressSection,
  Label: ProgressLabel,
})

export type { ProgressOwnProps, ProgressProps, ProgressStylesNames } from './Progress.types'
