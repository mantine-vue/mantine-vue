<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Alert,
  Avatar,
  Button,
  ColorInput,
  ColorSwatch,
  Divider,
  Drawer,
  Group,
  Radio,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
  UnstyledButton,
} from '@mantine-vue/core'
import { notifications } from '@mantine-vue/notifications'
import { QRCode } from '@mantine-vue/qr-code'
import { PhArrowCounterClockwise, PhFlask, PhQrCode } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { QR_MENU_CONFIG } from '../../config'
import type { RestaurantSummary } from '../../domain/types'
import { LOCALES } from '../../i18n'
import { useIsMobile } from '../../composables/use-is-mobile'
import {
  DENSITIES,
  FONT_PRESETS,
  LAYOUT_PRESETS,
  RADIUS_KEYS,
  THEME_PRESETS,
  type ColorSchemePreference,
  type Density,
  type LayoutPresetId,
  type RadiusKey,
} from '../../theme/presets'
import { imageSrc } from '../../utils/images'
import ConfirmButton from '../common/ConfirmButton.vue'
import LayoutPreview from './LayoutPreview.vue'

/**
 * Demo-only configurator: switch restaurants, languages, themes, fonts, layouts
 * and simulate QR scans or failures. It only writes preferences, so no business
 * logic depends on it.
 */
const ctx = useQrMenu()
const { t, overlays, preferences, appearance, layout, i18n, services, localize, settings } = ctx
const router = useRouter()
const isMobile = useIsMobile()

const restaurants = ref<RestaurantSummary[]>([])
watch(
  () => overlays.settings,
  async (opened) => {
    if (opened && restaurants.value.length === 0) {
      try {
        restaurants.value = await services.restaurants.list()
      } catch {
        notifications.show({ color: 'red', message: t('errors.network') })
      }
    }
  },
  { immediate: true },
)

const switchRestaurant = (id: string) => {
  preferences.setRestaurant(id)
  router.push({ name: 'rqm-menu' })
}

const colorSchemes = computed(() =>
  (['light', 'dark', 'auto'] as ColorSchemePreference[]).map((value) => ({
    value,
    label: t(`settings.colorSchemes.${value}`),
  })),
)

const swatches = THEME_PRESETS.map((preset) => preset.brand)

const qrTable = ref<string | null>(null)
watch(
  () => settings.value?.tables,
  (tables) => {
    qrTable.value = tables?.[0]?.id ?? null
  },
  { immediate: true },
)
const qrPath = computed(() =>
  qrTable.value
    ? `${QR_MENU_CONFIG.basePath}?r=${ctx.restaurantId.value}&table=${encodeURIComponent(qrTable.value)}`
    : '',
)
const qrUrl = computed(() =>
  typeof window === 'undefined' ? qrPath.value : `${window.location.origin}${qrPath.value}`,
)

const openTableLink = () => {
  overlays.settings = false
  router.push(qrPath.value)
}

const resetData = () => {
  ctx.resetDemoData()
  notifications.show({ color: 'teal', message: t('settings.dataCleared') })
}
</script>

<template>
  <Drawer
    :opened="overlays.settings"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '92%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.settings = false"
  >
    <template #title>
      <Group gap="xs">
        <PhFlask :size="20" />
        <Text fw="700">{{ t('settings.title') }}</Text>
      </Group>
    </template>

    <Stack gap="lg">
      <Alert color="blue" variant="light" radius="md">{{ t('settings.subtitle') }}</Alert>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('settings.restaurant') }}</Title>
        <Radio.Group
          :model-value="preferences.state.restaurantId"
          @update:model-value="(value: string | null) => value && switchRestaurant(value)"
        >
          <Stack gap="xs">
            <Radio.Card
              v-for="item in restaurants"
              :key="item.id"
              :value="item.id"
              radius="md"
              :class="$style.card"
            >
              <Group wrap="nowrap" gap="sm">
                <Radio.Indicator />
                <Avatar :src="imageSrc(item.logo, 64)" radius="xl" size="sm" />
                <div>
                  <Text size="sm" fw="600">{{ localize(item.name) }}</Text>
                  <Text size="xs" c="dimmed"
                    >{{ localize(item.tagline) }} · {{ item.currency }}</Text
                  >
                </div>
              </Group>
            </Radio.Card>
          </Stack>
        </Radio.Group>
      </section>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('settings.language') }}</Title>
        <SegmentedControl
          :model-value="i18n.locale.value"
          :data="LOCALES.map((locale) => ({ value: locale.code, label: locale.nativeLabel }))"
          fullWidth
          radius="xl"
          @update:model-value="(value: string | number) => ctx.setLocale(String(value))"
        />
      </section>

      <Divider />

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('settings.appearance') }}</Title>
        <Stack gap="md">
          <div>
            <Text size="sm" fw="500" :mb="4">{{ t('settings.colorScheme') }}</Text>
            <SegmentedControl
              :model-value="preferences.state.colorScheme"
              :data="colorSchemes"
              fullWidth
              radius="xl"
              size="xs"
              @update:model-value="
                (value: string | number) =>
                  preferences.setColorScheme(value as ColorSchemePreference)
              "
            />
          </div>

          <div>
            <Text size="sm" fw="500" mb="xs">{{ t('settings.theme') }}</Text>
            <SimpleGrid :cols="3" spacing="xs">
              <UnstyledButton
                v-for="preset in THEME_PRESETS"
                :key="preset.id"
                :class="$style.preset"
                :data-active="appearance.preset.id === preset.id || undefined"
                :aria-pressed="appearance.preset.id === preset.id"
                @click="preferences.setThemePreset(preset.id)"
              >
                <Group :gap="4" justify="center">
                  <ColorSwatch :color="preset.brand" :size="20" />
                  <ColorSwatch :color="preset.accent" :size="14" />
                </Group>
                <Text size="xs" fw="600" :mt="6">{{ t(`settings.themes.${preset.id}`) }}</Text>
              </UnstyledButton>
            </SimpleGrid>
          </div>

          <SimpleGrid :cols="2" spacing="sm">
            <ColorInput
              :model-value="appearance.brand"
              :label="t('settings.primaryColor')"
              :swatches="swatches"
              :swatchesPerRow="6"
              format="hex"
              radius="md"
              size="xs"
              @update:model-value="
                (value: string) => preferences.updateAppearance({ brandColor: value })
              "
            />
            <ColorInput
              :model-value="appearance.accent"
              :label="t('settings.accentColor')"
              :swatches="THEME_PRESETS.map((preset) => preset.accent)"
              :swatchesPerRow="6"
              format="hex"
              radius="md"
              size="xs"
              @update:model-value="
                (value: string) => preferences.updateAppearance({ accentColor: value })
              "
            />
          </SimpleGrid>
          <Button
            v-if="
              preferences.state.appearance.brandColor || preferences.state.appearance.accentColor
            "
            variant="subtle"
            size="compact-xs"
            @click="preferences.updateAppearance({ brandColor: null, accentColor: null })"
          >
            {{ t('settings.useThemeColors') }}
          </Button>

          <Select
            :model-value="appearance.font.id"
            :data="
              FONT_PRESETS.map((font) => ({
                value: font.id,
                label: t(`settings.fonts.${font.id}`),
              }))
            "
            :label="t('settings.font')"
            :allowDeselect="false"
            radius="md"
            size="sm"
            @update:model-value="
              (value: string | null) => value && preferences.updateAppearance({ font: value })
            "
          />

          <div>
            <Text size="sm" fw="500" :mb="4">{{ t('settings.radius') }}</Text>
            <SegmentedControl
              :model-value="appearance.radius"
              :data="RADIUS_KEYS.map((key) => ({ value: key, label: key.toUpperCase() }))"
              fullWidth
              size="xs"
              @update:model-value="
                (value: string | number) =>
                  preferences.updateAppearance({ radius: value as RadiusKey })
              "
            />
          </div>

          <div>
            <Text size="sm" fw="500" :mb="4">{{ t('settings.density') }}</Text>
            <SegmentedControl
              :model-value="appearance.density"
              :data="
                DENSITIES.map((density) => ({
                  value: density,
                  label: t(`settings.densities.${density}`),
                }))
              "
              fullWidth
              size="xs"
              radius="xl"
              @update:model-value="
                (value: string | number) =>
                  preferences.updateAppearance({ density: value as Density })
              "
            />
          </div>
        </Stack>
      </section>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('settings.layout') }}</Title>
        <SimpleGrid :cols="2" spacing="xs">
          <UnstyledButton
            v-for="preset in LAYOUT_PRESETS"
            :key="preset.id"
            :class="$style.preset"
            :data-active="layout.id === preset.id || undefined"
            :aria-pressed="layout.id === preset.id"
            @click="preferences.setLayout(preset.id as LayoutPresetId)"
          >
            <LayoutPreview :layout="preset" />
            <Text size="sm" fw="700" mt="xs">{{ t(`settings.layouts.${preset.id}`) }}</Text>
            <Text size="xs" c="dimmed">{{ t(`settings.layoutHints.${preset.id}`) }}</Text>
          </UnstyledButton>
        </SimpleGrid>
      </section>

      <Divider />

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('settings.simulation') }}</Title>
        <Stack gap="md">
          <div v-if="settings?.modes.includes('dine-in') && settings.tables.length">
            <Group justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
              <Select
                v-model="qrTable"
                :data="
                  settings.tables.map((table) => ({
                    value: table.id,
                    label: t('table.label', { table: table.label }),
                  }))
                "
                :label="t('settings.qr')"
                :allowDeselect="false"
                radius="md"
                size="sm"
                flex="1"
              >
                <template #leftSection><PhQrCode :size="16" /></template>
              </Select>
              <Button size="sm" radius="md" variant="light" @click="openTableLink">{{
                t('settings.openLink')
              }}</Button>
            </Group>
            <Group mt="sm" wrap="nowrap" align="center" gap="md">
              <QRCode
                v-if="qrUrl"
                :value="qrUrl"
                :size="112"
                radius="sm"
                :aria-label="t('settings.qr')"
              />
              <Text size="xs" c="dimmed">{{ t('settings.qrHint') }}</Text>
            </Group>
          </div>

          <div>
            <Text size="sm" fw="500" :mb="4">{{ t('settings.restaurantStatus') }}</Text>
            <SegmentedControl
              :model-value="preferences.state.demo.openState"
              :data="
                (['auto', 'open', 'closed'] as const).map((value) => ({
                  value,
                  label: t(`settings.statuses.${value}`),
                }))
              "
              fullWidth
              size="xs"
              radius="xl"
              @update:model-value="
                (value: string | number) =>
                  preferences.setDemo({ openState: value as 'auto' | 'open' | 'closed' })
              "
            />
          </div>

          <Switch
            :checked="preferences.state.demo.unreliableNetwork"
            :label="t('settings.network')"
            :description="t('settings.networkHint')"
            @update:checked="(value: boolean) => preferences.setDemo({ unreliableNetwork: value })"
          />
        </Stack>
      </section>

      <Group justify="space-between" pb="md">
        <Button variant="default" radius="xl" size="xs" @click="preferences.resetAppearance()">
          <template #leftSection><PhArrowCounterClockwise :size="14" /></template>
          {{ t('settings.resetAppearance') }}
        </Button>
        <ConfirmButton :message="t('settings.resetDataConfirm')" size="xs" @confirm="resetData">
          {{ t('settings.resetData') }}
        </ConfirmButton>
      </Group>
    </Stack>
  </Drawer>
</template>

<style module>
.card {
  padding: 10px 12px;

  &[data-checked] {
    border-color: var(--mantine-primary-color-filled);
    background-color: var(--mantine-primary-color-light);
  }
}

.preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--mantine-spacing-xs);
  border: 1px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-md);
  text-align: center;
  transition: border-color 120ms ease;

  &[data-active] {
    border-color: var(--mantine-primary-color-filled);
    box-shadow: 0 0 0 1px var(--mantine-primary-color-filled);
  }

  &:focus-visible {
    outline: 2px solid var(--mantine-primary-color-filled);
    outline-offset: 2px;
  }
}
</style>
