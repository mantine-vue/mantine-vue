<script lang="ts">
import { createVarsResolver, getRadius, getSize, getThemeColor } from '@mantine-vue/core'

const defaultProps = {
  size: 'md',
  color: 'dark',
  background: 'white',
  errorCorrectionLevel: 'M',
  quietZone: 1,
  dotStyle: 'square',
  cornerStyle: 'square',
  imageSize: 0.2,
  imagePadding: 1,
  imageExcavate: true,
} as const

const varsResolver = createVarsResolver<any>((theme, { size, radius, color, background }) => ({
  root: {
    '--qr-code-size': getSize(size, 'qr-code-size'),
    '--qr-code-radius': radius !== undefined ? getRadius(radius) : undefined,
    '--qr-code-color': color ? getThemeColor(color, theme) : undefined,
    '--qr-code-background':
      background === 'transparent'
        ? 'transparent'
        : background
          ? getThemeColor(background, theme)
          : undefined,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, getRadius as resolveRadius, useProps, useStyles } from '@mantine-vue/core'
import { dotPath } from './utils/dot-shapes'
import { finderPatternPaths } from './utils/finder-shapes'
import { generateQRMatrix, isFinderPattern } from './utils/qr-encoder'
import { getExcavationMask } from './utils/utils'
import type { QRCodeOwnProps } from './QRCode.types'
import classes from './QRCode.module.css'

defineOptions({
  name: 'QRCode',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<QRCodeOwnProps>(), {
  component: undefined,
  rootRef: undefined,
  size: undefined,
  radius: undefined,
  color: undefined,
  background: undefined,
  errorCorrectionLevel: undefined,
  quietZone: undefined,
  dotStyle: undefined,
  cornerStyle: undefined,
  image: undefined,
  imageSize: undefined,
  imageRadius: undefined,
  imagePadding: undefined,
  imageExcavate: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

const attrs = useAttrs()
const props = useProps('QRCode', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'QRCode',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

const rootElement = ref<Element | null>(null)
const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })

const qrData = computed(() => {
  if (!props.value) {
    return null
  }

  try {
    return generateQRMatrix(props.value, props.errorCorrectionLevel)
  } catch {
    return null
  }
})

const svgContent = computed(() => {
  if (!qrData.value) {
    return null
  }

  const { modules, size: matrixSize } = qrData.value
  const quietZone = props.quietZone ?? defaultProps.quietZone
  const imageSizeRatio = props.imageSize ?? defaultProps.imageSize
  const imagePadding = props.imagePadding ?? defaultProps.imagePadding
  const dotStyle = props.dotStyle ?? defaultProps.dotStyle
  const cornerStyle = props.cornerStyle ?? defaultProps.cornerStyle
  const viewBoxSize = matrixSize + quietZone * 2
  const excavationMask =
    props.image && props.imageExcavate
      ? getExcavationMask(matrixSize, Math.ceil(matrixSize * imageSizeRatio), imagePadding)
      : null

  let modulesPath = ''
  for (let row = 0; row < matrixSize; row += 1) {
    for (let column = 0; column < matrixSize; column += 1) {
      if (
        !modules[row][column] ||
        isFinderPattern(row, column, matrixSize) ||
        excavationMask?.[row][column]
      ) {
        continue
      }

      modulesPath += dotPath(column + quietZone, row + quietZone, 1, dotStyle)
    }
  }

  const finders = [
    { key: 'top-left', row: 0, column: 0 },
    { key: 'top-right', row: 0, column: matrixSize - 7 },
    { key: 'bottom-left', row: matrixSize - 7, column: 0 },
  ].map((position) => ({
    key: position.key,
    ...finderPatternPaths(position.column + quietZone, position.row + quietZone, 1, cornerStyle),
  }))

  const imageElement = props.image
    ? (() => {
        const imageSize = matrixSize * imageSizeRatio
        return {
          x: (viewBoxSize - imageSize) / 2,
          y: (viewBoxSize - imageSize) / 2,
          size: imageSize,
          radius: props.imageRadius !== undefined ? resolveRadius(props.imageRadius) : '0',
        }
      })()
    : null

  return { viewBoxSize, modulesPath, finders, imageElement }
})
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :root-ref="setRootRef"
  >
    <svg
      v-if="svgContent"
      v-bind="getStyles('svg')"
      :viewBox="`0 0 ${svgContent.viewBoxSize} ${svgContent.viewBoxSize}`"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      :aria-label="`QR Code: ${props.value}`"
    >
      <rect
        v-bind="getStyles('background')"
        x="0"
        y="0"
        :width="svgContent.viewBoxSize"
        :height="svgContent.viewBoxSize"
      />
      <path
        v-if="svgContent.modulesPath"
        v-bind="getStyles('modules')"
        :d="svgContent.modulesPath"
        fill-rule="nonzero"
      />
      <g v-for="finder in svgContent.finders" :key="finder.key" v-bind="getStyles('finderPattern')">
        <path v-bind="getStyles('finderOuter')" :d="finder.outer" fill-rule="evenodd" />
        <path v-bind="getStyles('finderInner')" :d="finder.inner" />
      </g>
      <image
        v-if="svgContent.imageElement"
        v-bind="getStyles('image')"
        :href="props.image"
        :x="svgContent.imageElement.x"
        :y="svgContent.imageElement.y"
        :width="svgContent.imageElement.size"
        :height="svgContent.imageElement.size"
        :clip-path="`inset(0 round ${svgContent.imageElement.radius})`"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
    <svg v-else v-bind="getStyles('svg')" />
  </Box>
</template>
