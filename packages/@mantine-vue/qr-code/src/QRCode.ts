import { polymorphicFactory } from '@mantine-vue/core'
import QRCodeComponent, { varsResolver } from './QRCode.vue'
import type { QRCodeFactory } from './QRCode.types'
import classes from './QRCode.module.css'

export const QRCode = polymorphicFactory<QRCodeFactory>(QRCodeComponent, {
  classes,
  varsResolver,
})

export type {
  QRCodeCornerStyle,
  QRCodeCssVariables,
  QRCodeDotStyle,
  QRCodeErrorCorrectionLevel,
  QRCodeFactory,
  QRCodeOwnProps,
  QRCodeProps,
  QRCodeStylesNames,
} from './QRCode.types'
