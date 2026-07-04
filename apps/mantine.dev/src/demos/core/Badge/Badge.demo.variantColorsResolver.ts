import { defineComponent, h } from 'vue'
import {
  Badge,
  darken,
  defaultVariantColorsResolver,
  Group,
  MantineThemeProvider,
  parseThemeColor,
  rgba,
} from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import {
  Badge,
  Group,
  MantineThemeProvider,
  defaultVariantColorsResolver,
  parseThemeColor,
  rgba,
  darken,
} from '@mantine-vue/core'

const variantColorResolver = (input: any) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input)
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  })

  if (parsedColor.isThemeColor && parsedColor.color === 'lime' && input.variant === 'filled') {
    return {
      ...defaultResolvedColors,
      color: 'var(--mantine-color-black)',
      hoverColor: 'var(--mantine-color-black)',
    }
  }

  if (input.variant === 'light') {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: \`1px solid \${parsedColor.value}\`,
      color: darken(parsedColor.value, 0.1),
    }
  }

  if (input.variant === 'danger') {
    return {
      background: 'var(--mantine-color-red-9)',
      hover: 'var(--mantine-color-red-8)',
      color: 'var(--mantine-color-white)',
      border: 'none',
    }
  }

  return defaultResolvedColors
}
</script>

<template>
  <MantineThemeProvider :theme="{ variantColorResolver }">
    <Group>
      <Badge color="lime.4" variant="filled" size="lg">Lime filled</Badge>
      <Badge color="orange" variant="light" size="lg">Orange light</Badge>
      <Badge variant="danger" size="lg">Danger</Badge>
    </Group>
  </MantineThemeProvider>
</template>
`

const variantColorResolver = (input: any) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input)
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  })

  if (parsedColor.isThemeColor && parsedColor.color === 'lime' && input.variant === 'filled') {
    return {
      ...defaultResolvedColors,
      color: 'var(--mantine-color-black)',
      hoverColor: 'var(--mantine-color-black)',
    }
  }

  if (input.variant === 'light') {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `1px solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1),
    }
  }

  if (input.variant === 'danger') {
    return {
      background: 'var(--mantine-color-red-9)',
      hover: 'var(--mantine-color-red-8)',
      color: 'var(--mantine-color-white)',
      border: 'none',
    }
  }

  return defaultResolvedColors
}

const Demo = defineComponent({
  name: 'BadgeVariantColorsResolverDemo',
  setup() {
    return () =>
      h(
        MantineThemeProvider,
        { theme: { variantColorResolver } },
        {
          default: () =>
            h(
              Group,
              {},
              {
                default: () => [
                  h(
                    Badge,
                    { color: 'lime.4', variant: 'filled', size: 'lg' },
                    { default: () => 'Lime filled' },
                  ),
                  h(
                    Badge,
                    { color: 'orange', variant: 'light', size: 'lg' },
                    { default: () => 'Orange light' },
                  ),
                  h(Badge, { variant: 'danger', size: 'lg' }, { default: () => 'Danger' }),
                ],
              },
            ),
        },
      )
  },
})

export const variantColorsResolver: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
}
