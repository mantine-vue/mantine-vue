import type { QuarterLevelGroupProps } from '../QuarterLevelGroup/QuarterLevelGroup.types'

/** Props accepted by `QuarterLevel`, renders quarters of a single year with a header. */
export type QuarterLevelProps = Omit<QuarterLevelGroupProps, 'numberOfColumns'>
