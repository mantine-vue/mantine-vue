import { defineComponent, h } from 'vue'
import { Button, Group, Stack, Text } from '@mantine-vue/core'
import {
  QRCode,
  useQRCodeDownload,
  type QRCodeCornerStyle,
  type QRCodeDotStyle,
  type QRCodeErrorCorrectionLevel,
} from '@mantine-vue/qr-code'
import type { MantineDemo } from '@/demo'

const value = 'https://mantine-vue.dev'

function code(template: string, setup = '') {
  return `<script setup lang="ts">
${setup}import { QRCode } from '@mantine-vue/qr-code'
</script>

<template>
${template}
</template>`
}

function qrDemo(name: string, props: Record<string, unknown>, source: string): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name,
      setup: () => () => h(QRCode, { value, ...props }),
    }),
    code: code(`  ${source}`),
    centered: true,
  }
}

export const usage = qrDemo('QRCodeUsageDemo', {}, `<QRCode value="${value}" />`)

const Configurator = defineComponent({
  name: 'QRCodeConfiguratorDemo',
  inheritAttrs: false,
  setup:
    (_, { attrs }) =>
    () =>
      h(QRCode, {
        ...attrs,
        value: typeof attrs.value === 'string' ? attrs.value : value,
      }),
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Configurator,
  code: code('  <QRCode{{props}} />'),
  centered: true,
  controls: [
    { type: 'string', prop: 'value', initialValue: value, libraryValue: null },
    { type: 'color', prop: 'color', initialValue: 'dark', libraryValue: 'dark' },
    { type: 'color', prop: 'background', initialValue: 'white', libraryValue: 'white' },
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' },
    { type: 'size', prop: 'radius', initialValue: 'sm', libraryValue: null },
    {
      type: 'segmented',
      prop: 'dotStyle',
      initialValue: 'square',
      libraryValue: 'square',
      data: ['square', 'rounded', 'dots'],
    },
    {
      type: 'segmented',
      prop: 'cornerStyle',
      initialValue: 'square',
      libraryValue: 'square',
      data: ['square', 'rounded', 'dots'],
    },
    {
      type: 'select',
      prop: 'errorCorrectionLevel',
      initialValue: 'M',
      libraryValue: 'M',
      data: [
        { value: 'L', label: 'L (7%)' },
        { value: 'M', label: 'M (15%)' },
        { value: 'Q', label: 'Q (25%)' },
        { value: 'H', label: 'H (30%)' },
      ],
    },
    {
      type: 'number',
      prop: 'quietZone',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 4,
      step: 1,
    },
  ],
}

function labeledGroupDemo(
  name: string,
  items: { label: string; props: Record<string, unknown> }[],
  source: string,
): MantineDemo {
  return {
    type: 'code',
    component: defineComponent({
      name,
      setup: () => () =>
        h(Group, { justify: 'center' }, () =>
          items.map((item) =>
            h(Stack, { key: item.label, align: 'center', gap: 'xs' }, () => [
              h(QRCode, { value, size: 'lg', ...item.props }),
              h(Text, { size: 'xs' }, () => item.label),
            ]),
          ),
        ),
    }),
    code: source,
  }
}

const colorsList = ['red', 'blue', 'violet', 'teal', 'orange', 'cyan']
export const colors = labeledGroupDemo(
  'QRCodeColorsDemo',
  colorsList.map((color) => ({ label: color, props: { color } })),
  code(
    `  <Group>
    <Stack v-for="color in colors" :key="color" align="center" gap="xs">
      <QRCode value="https://mantine-vue.dev" :color="color" />
      <Text size="xs">{{ color }}</Text>
    </Stack>
  </Group>`,
    `import { Group, Stack, Text } from '@mantine-vue/core'
const colors = ['red', 'blue', 'violet', 'teal', 'orange', 'cyan']
`,
  ),
)

const shapeItems = ['square', 'rounded', 'dots'] as const
export const dotStyles = labeledGroupDemo(
  'QRCodeDotStylesDemo',
  shapeItems.map((dotStyle) => ({ label: dotStyle, props: { dotStyle } })),
  code(
    `  <Group>
    <Stack v-for="style in ['square', 'rounded', 'dots']" :key="style" align="center">
      <QRCode value="${value}" size="lg" :dot-style="style" />
      <Text size="xs">{{ style }}</Text>
    </Stack>
  </Group>`,
    `import { Group, Stack, Text } from '@mantine-vue/core'\n`,
  ),
)

export const cornerStyles = labeledGroupDemo(
  'QRCodeCornerStylesDemo',
  shapeItems.map((cornerStyle) => ({ label: cornerStyle, props: { cornerStyle } })),
  code(
    `  <Group>
    <Stack v-for="style in ['square', 'rounded', 'dots']" :key="style" align="center">
      <QRCode value="${value}" size="lg" :corner-style="style" />
      <Text size="xs">{{ style }}</Text>
    </Stack>
  </Group>`,
    `import { Group, Stack, Text } from '@mantine-vue/core'\n`,
  ),
)

const correctionLabels: Record<QRCodeErrorCorrectionLevel, string> = {
  L: 'L (7%)',
  M: 'M (15%)',
  Q: 'Q (25%)',
  H: 'H (30%)',
}
export const errorCorrection = labeledGroupDemo(
  'QRCodeErrorCorrectionDemo',
  (Object.keys(correctionLabels) as QRCodeErrorCorrectionLevel[]).map((level) => ({
    label: correctionLabels[level],
    props: { errorCorrectionLevel: level },
  })),
  code(
    `  <Group>
    <Stack v-for="level in ['L', 'M', 'Q', 'H']" :key="level" align="center">
      <QRCode value="${value}" size="lg" :error-correction-level="level" />
      <Text size="xs">{{ level }}</Text>
    </Stack>
  </Group>`,
    `import { Group, Stack, Text } from '@mantine-vue/core'\n`,
  ),
)

const image =
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png'
export const withImage: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'QRCodeImageDemo',
    setup: () => () =>
      h(Group, { justify: 'center' }, () => [
        h(QRCode, { value, size: 'xl', image, errorCorrectionLevel: 'H' }),
        h(QRCode, {
          value,
          size: 'xl',
          image,
          errorCorrectionLevel: 'H',
          dotStyle: 'dots' as QRCodeDotStyle,
          cornerStyle: 'dots' as QRCodeCornerStyle,
          imageRadius: 'md',
        }),
      ]),
  }),
  code: code(
    `  <Group>
    <QRCode value="${value}" size="xl" :image="image" error-correction-level="H" />
    <QRCode value="${value}" size="xl" :image="image" error-correction-level="H"
      dot-style="dots" corner-style="dots" image-radius="md" />
  </Group>`,
    `import { Group } from '@mantine-vue/core'
const image = '${image}'
`,
  ),
}

export const download: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'QRCodeDownloadDemo',
    setup() {
      const qr = useQRCodeDownload({ fileName: 'my-qr-code' })
      return () =>
        h(Stack, { align: 'center' }, () => [
          h(QRCode, { rootRef: qr.ref, value, size: 'xl' }),
          h(Group, {}, () => [
            h(
              Button,
              { variant: 'light', onClick: () => qr.download({ format: 'svg' }) },
              () => 'Download SVG',
            ),
            h(
              Button,
              { variant: 'light', onClick: () => qr.download({ format: 'png' }) },
              () => 'Download PNG',
            ),
          ]),
        ])
    },
  }),
  code: `<script setup lang="ts">
import { Button, Group, Stack } from '@mantine-vue/core'
import { QRCode, useQRCodeDownload } from '@mantine-vue/qr-code'
const { ref: qrRef, download } = useQRCodeDownload({ fileName: 'my-qr-code' })
</script>
<template>
  <Stack align="center">
    <QRCode :root-ref="qrRef" value="${value}" size="xl" />
    <Group>
      <Button variant="light" @click="download({ format: 'svg' })">Download SVG</Button>
      <Button variant="light" @click="download({ format: 'png' })">Download PNG</Button>
    </Group>
  </Stack>
</template>`,
  centered: true,
}

const StylesDemo = defineComponent({
  name: 'QRCodeStylesApiDemo',
  inheritAttrs: false,
  setup:
    (_, { attrs }) =>
    () =>
      h(QRCode, { value, size: 'xl', ...attrs }),
})
export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      svg: 'SVG element',
      background: 'Background rectangle',
      modules: 'Combined path of all data modules',
      finderPattern: 'Group for each finder pattern',
      finderOuter: 'Outer ring of each finder pattern',
      finderInner: 'Inner shape of each finder pattern',
      image: 'Center image overlay',
    },
  },
  component: StylesDemo,
  code: code(`  <QRCode{{props}} value="${value}" size="xl" />`),
  centered: true,
}

export const useCases = labeledGroupDemo(
  'QRCodeUseCasesDemo',
  [
    { label: 'URL', props: { dotStyle: 'rounded', cornerStyle: 'rounded' } },
    {
      label: 'WiFi',
      props: { value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;', color: 'blue', dotStyle: 'dots' },
    },
    {
      label: 'vCard',
      props: {
        value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEND:VCARD',
        color: 'teal',
        errorCorrectionLevel: 'H',
      },
    },
  ],
  code(
    `  <Group>
    <QRCode value="${value}" dot-style="rounded" corner-style="rounded" />
    <QRCode value="WIFI:T:WPA;S:MyNetwork;P:MyPassword;;" color="blue" dot-style="dots" />
    <QRCode :value="vCard" color="teal" error-correction-level="H" />
  </Group>`,
    `import { Group } from '@mantine-vue/core'
const vCard = 'BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nTEL:+1234567890\\nEND:VCARD'
`,
  ),
)

export const QRCodeDemos = {
  usage,
  configurator,
  colors,
  dotStyles,
  cornerStyles,
  errorCorrection,
  withImage,
  download,
  stylesApi,
  useCases,
}
