import { factory } from '../../core'
import { ProgressLabel } from './ProgressLabel/ProgressLabel'
import { ProgressRoot } from './ProgressRoot/ProgressRoot'
import { ProgressSection } from './ProgressSection/ProgressSection'
import type { ProgressFactory } from './Progress.types'
// `Progress` renders through `ProgressRoot`, so it shares that component's resolver.
import { varsResolver } from './ProgressRoot/ProgressRoot.vue'
import ProgressComponent from './Progress.vue'
import classes from './Progress.module.css'

export const Progress = factory<ProgressFactory>(ProgressComponent, {
  classes,
  varsResolver,
  Root: ProgressRoot,
  Section: ProgressSection,
  Label: ProgressLabel,
})

export type {
  ProgressFactory,
  ProgressOwnProps,
  ProgressProps,
  ProgressStylesNames,
} from './Progress.types'
