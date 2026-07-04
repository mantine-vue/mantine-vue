import { defineComponent, h } from 'vue'
import {
  Group,
  MantineThemeProvider,
  ThemeIcon,
  darken,
  defaultVariantColorsResolver,
  parseThemeColor,
  rgba,
} from '@mantine-vue/core'
import { PhFingerprint, PhImage, PhWarning } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'
import type { VariantColorResolverInput } from '@mantine-vue/core'

const code = `
<script setup lang="ts">
import {
  ThemeIcon,
  Group,
  MantineThemeProvider,
  defaultVariantColorsResolver,
  parseThemeColor,
  rgba,
  darken,
} from '@mantine-vue/core'
import { PhImage, PhFingerprint, PhWarning } from '@phosphor-icons/vue'

const variantColorResolver = (input) => {
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
      <ThemeIcon color="lime.4" variant="filled" size="lg">
        <PhImage :size="20" />
      </ThemeIcon>
      <ThemeIcon color="orange" variant="light" size="lg">
        <PhFingerprint :size="20" />
      </ThemeIcon>
      <ThemeIcon variant="danger" size="lg">
        <PhWarning :size="20" />
      </ThemeIcon>
    </Group>
  </MantineThemeProvider>
</template>
`

const variantColorResolver = (input: VariantColorResolverInput) => {
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
  name: 'ThemeIconVariantColorsResolverDemo',
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
                    ThemeIcon,
                    { color: 'lime.4', variant: 'filled', size: 'lg' },
                    {
                      default: () => h(PhImage, { size: 20 }),
                    },
                  ),
                  h(
                    ThemeIcon,
                    { color: 'orange', variant: 'light', size: 'lg' },
                    {
                      default: () => h(PhFingerprint, { size: 20 }),
                    },
                  ),
                  h(
                    ThemeIcon,
                    { variant: 'danger', size: 'lg' },
                    {
                      default: () => h(PhWarning, { size: 20 }),
                    },
                  ),
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
