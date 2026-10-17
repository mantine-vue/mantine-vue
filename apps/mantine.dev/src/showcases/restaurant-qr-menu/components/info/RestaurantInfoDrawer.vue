<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  Button,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
} from '@mantine-vue/core'
import { Lightbox } from '@mantine-vue/lightbox'
import { QRCode } from '@mantine-vue/qr-code'
import {
  PhCheck,
  PhCopy,
  PhEnvelopeSimple,
  PhMapPin,
  PhPhone,
  PhWhatsappLogo,
  PhWifiHigh,
} from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import { getZonedTime, groupOpeningHours } from '../../domain/availability'
import { QR_MENU_CONFIG } from '../../config'
import { imageSrc } from '../../utils/images'
import OpenStatusBadge from '../common/OpenStatusBadge.vue'
import SmartImage from '../common/SmartImage.vue'
import SocialLinks from './SocialLinks.vue'

/** About the restaurant: hours, location, contact, Wi-Fi, gallery and share QR. */
const ctx = useQrMenu()
const { t, overlays, data, localize, format, clock } = ctx
const isMobile = useIsMobile()

const restaurant = computed(() => data.restaurant.value)
const hours = computed(() =>
  restaurant.value ? groupOpeningHours(restaurant.value.openingHours) : [],
)
const today = computed(() =>
  restaurant.value ? getZonedTime(clock.value, restaurant.value.timeZone).day : 0,
)
/** Week starting today, so the most relevant row is first. */
const week = computed(() => Array.from({ length: 7 }, (_, offset) => (today.value + offset) % 7))

const shareUrl = computed(() => {
  if (typeof window === 'undefined' || !restaurant.value) {
    return ''
  }
  return `${window.location.origin}${QR_MENU_CONFIG.basePath}?r=${restaurant.value.id}`
})

const galleryOpened = ref(false)
const galleryIndex = ref(0)
const gallerySlides = computed(() =>
  (restaurant.value?.gallery ?? []).map((image) => ({
    src: imageSrc(image, 1600),
    thumbSrc: imageSrc(image, 160),
    alt: localize(image.alt),
    caption: localize(image.alt),
  })),
)
const openGallery = (index: number) => {
  galleryIndex.value = index
  galleryOpened.value = true
}
</script>

<template>
  <Drawer
    :opened="overlays.info"
    :position="isMobile ? 'bottom' : 'right'"
    :size="isMobile ? '92%' : 'md'"
    :radius="isMobile ? 'lg' : 0"
    :title="restaurant ? localize(restaurant.name) : t('header.info')"
    :closeButtonProps="{ 'aria-label': t('app.close') }"
    @close="overlays.info = false"
  >
    <Stack v-if="restaurant" gap="lg">
      <section>
        <OpenStatusBadge />
        <Text size="sm" mt="sm" lh="1.6">{{ localize(restaurant.description) }}</Text>
      </section>

      <section v-if="restaurant.gallery.length">
        <Title :order="3" size="h6" mb="xs">{{ t('info.gallery') }}</Title>
        <SimpleGrid :cols="3" spacing="xs">
          <UnstyledButton
            v-for="(image, index) in restaurant.gallery"
            :key="image.url"
            :class="$style.galleryItem"
            :aria-label="`${t('details.openGallery')} – ${localize(image.alt)}`"
            @click="openGallery(index)"
          >
            <SmartImage :asset="image" :width="160" :ratio="1" radius="md" />
          </UnstyledButton>
        </SimpleGrid>
        <Lightbox
          v-model:opened="galleryOpened"
          v-model:current-index="galleryIndex"
          :slides="gallerySlides"
          withZoom
          withThumbnails
          loop
          :labels="{
            closeLabel: t('app.close'),
            previousSlideLabel: t('details.previousPhoto'),
            nextSlideLabel: t('details.nextPhoto'),
          }"
        />
      </section>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('info.hours') }}</Title>
        <Table variant="vertical" layout="fixed" fz="sm" withTableBorder>
          <Table.Tbody>
            <Table.Tr v-for="day in week" :key="day" :class="{ [$style.today]: day === today }">
              <Table.Th w="45%">
                {{ format.weekday(day) }}
                <Badge v-if="day === today" size="xs" ms="xs" variant="light" tt="none">{{
                  t('info.today')
                }}</Badge>
              </Table.Th>
              <Table.Td class="qrm-tabular">
                <template v-if="hours[day].length">
                  <div v-for="period in hours[day]" :key="period.open">
                    {{ format.clock(period.open) }} – {{ format.clock(period.close) }}
                  </div>
                </template>
                <Text v-else size="sm" c="dimmed">{{ t('info.closedDay') }}</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </section>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('info.location') }}</Title>
        <Text size="sm">{{ localize(restaurant.address.line) }}</Text>
        <Text size="sm" c="dimmed">{{ localize(restaurant.address.city) }}</Text>
        <Button
          component="a"
          :href="restaurant.address.mapUrl"
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
          radius="xl"
          size="xs"
          mt="xs"
        >
          <template #leftSection><PhMapPin :size="14" /></template>
          {{ t('info.openMap') }}
        </Button>
        <template v-if="restaurant.ordering.delivery">
          <Text size="sm" fw="600" mt="sm">{{ t('info.deliveryAreas') }}</Text>
          <Group gap="xs" :mt="4">
            <Badge
              v-for="area in restaurant.ordering.delivery.areas"
              :key="localize(area)"
              variant="default"
              tt="none"
            >
              {{ localize(area) }}
            </Badge>
          </Group>
        </template>
      </section>

      <section>
        <Title :order="3" size="h6" mb="xs">{{ t('info.contact') }}</Title>
        <Group gap="xs">
          <Button
            component="a"
            :href="`tel:${restaurant.contact.phone.replace(/\s/g, '')}`"
            variant="default"
            radius="xl"
            size="xs"
          >
            <template #leftSection><PhPhone :size="14" /></template>
            <span dir="ltr">{{ restaurant.contact.phone }}</span>
          </Button>
          <Button
            component="a"
            :href="`mailto:${restaurant.contact.email}`"
            variant="default"
            radius="xl"
            size="xs"
          >
            <template #leftSection><PhEnvelopeSimple :size="14" /></template>
            {{ t('info.email') }}
          </Button>
          <Button
            v-if="restaurant.contact.whatsapp"
            component="a"
            :href="`https://wa.me/${restaurant.contact.whatsapp.replace(/\D/g, '')}`"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            radius="xl"
            size="xs"
          >
            <template #leftSection><PhWhatsappLogo :size="14" /></template>
            {{ t('info.whatsapp') }}
          </Button>
        </Group>
        <Text size="sm" fw="600" mt="md" mb="xs">{{ t('info.follow') }}</Text>
        <SocialLinks :links="restaurant.social" />
      </section>

      <section v-if="restaurant.wifi">
        <Title :order="3" size="h6" mb="xs">
          <PhWifiHigh :size="16" :class="$style.inlineIcon" /> {{ t('info.wifi') }}
        </Title>
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text size="xs" c="dimmed">{{ t('info.network') }}</Text>
            <Code>{{ restaurant.wifi.network }}</Code>
            <Text size="xs" c="dimmed" mt="xs">{{ t('info.password') }}</Text>
            <Code>{{ restaurant.wifi.password }}</Code>
          </div>
          <CopyButton :value="restaurant.wifi.password">
            <template #default="{ copied, copy }">
              <Button
                size="xs"
                radius="xl"
                :variant="copied ? 'light' : 'default'"
                :color="copied ? 'teal' : undefined"
                @click="copy"
              >
                <template #leftSection>
                  <PhCheck v-if="copied" :size="14" />
                  <PhCopy v-else :size="14" />
                </template>
                {{ copied ? t('app.copied') : t('info.copyPassword') }}
              </Button>
            </template>
          </CopyButton>
        </Group>
      </section>

      <Divider />

      <section :class="$style.share">
        <Title :order="3" size="h6" mb="xs">{{ t('info.share') }}</Title>
        <QRCode
          :value="shareUrl"
          :size="160"
          radius="md"
          errorCorrectionLevel="M"
          :aria-label="t('info.shareHint')"
        />
        <Text size="xs" c="dimmed" mt="xs" ta="center">{{ t('info.shareHint') }}</Text>
        <CopyButton :value="shareUrl">
          <template #default="{ copied, copy }">
            <Button variant="subtle" size="xs" mt="xs" @click="copy">
              {{ copied ? t('app.linkCopied') : t('info.copyLink') }}
            </Button>
          </template>
        </CopyButton>
      </section>
    </Stack>
  </Drawer>
</template>

<style module>
.galleryItem {
  display: block;
  border-radius: var(--mantine-radius-md);
  overflow: hidden;
}

.today {
  background-color: var(--mantine-primary-color-light);
}

.inlineIcon {
  vertical-align: -2px;
}

.share {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
