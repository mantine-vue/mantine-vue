<script setup lang="ts">
import type { Component } from 'vue'
import { ActionIcon, Group, Tooltip } from '@mantine-vue/core'
import {
  PhFacebookLogo,
  PhGlobeSimple,
  PhInstagramLogo,
  PhTiktokLogo,
  PhWhatsappLogo,
  PhXLogo,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { SocialLink, SocialPlatform } from '../../domain/types'

withDefaults(defineProps<{ links: SocialLink[]; size?: 'md' | 'lg' }>(), { size: 'lg' })
const { t } = useQrMenu()

const ICONS: Record<SocialPlatform, Component> = {
  instagram: PhInstagramLogo,
  facebook: PhFacebookLogo,
  tiktok: PhTiktokLogo,
  x: PhXLogo,
  whatsapp: PhWhatsappLogo,
  website: PhGlobeSimple,
}
</script>

<template>
  <Group v-if="links.length" gap="xs">
    <Tooltip
      v-for="link in links"
      :key="link.platform"
      :label="link.handle ?? t(`info.social.${link.platform}`)"
    >
      <ActionIcon
        component="a"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        variant="default"
        radius="xl"
        :size="size"
        :aria-label="`${t(`info.social.${link.platform}`)} ${t('app.newWindow')}`"
      >
        <component :is="ICONS[link.platform]" :size="size === 'lg' ? 20 : 16" />
      </ActionIcon>
    </Tooltip>
  </Group>
</template>
