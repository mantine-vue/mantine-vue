<script setup lang="ts">
import { computed, useId } from 'vue'
import { Badge, Checkbox, Group, Radio, Stack, Text } from '@mantine-vue/core'
import { PhWarningCircle } from '@phosphor-icons/vue'
import { useQrMenu } from '../../app/use-qr-menu'
import type { ModifierGroupError } from '../../domain/modifiers'
import type { ModifierGroup } from '../../domain/types'

/**
 * One modifier group. Single-select groups render radio cards (with a "None"
 * option when optional), multi-select groups render checkbox cards and disable
 * the remaining options once the maximum is reached.
 */
const props = defineProps<{
  group: ModifierGroup
  selected: string[]
  error?: ModifierGroupError | null
}>()
const emit = defineEmits<{ toggle: [optionId: string]; clear: [] }>()

const { t, localize, price } = useQrMenu()
const headingId = useId()
const errorId = useId()

const required = computed(() => props.group.min > 0)
const atMax = computed(
  () => props.group.selection === 'multiple' && props.selected.length >= props.group.max,
)

const rule = computed(() => {
  const { min, max, selection } = props.group
  if (selection === 'single') {
    return t('details.chooseOne')
  }
  if (min > 0 && min === max) {
    return t('details.chooseExactly', { count: min })
  }
  if (min > 0) {
    return t('details.chooseBetween', { min, max })
  }
  return t('details.chooseUpTo', { max })
})

const errorMessage = computed(() => {
  const error = props.error
  if (!error) {
    return ''
  }
  const group = localize(props.group.name)
  switch (error.code) {
    case 'required':
      return t('errors.required', { group })
    case 'min':
      return t('errors.min', { group, min: error.limit ?? props.group.min })
    case 'max':
      return t('errors.max', { group, max: error.limit ?? props.group.max })
    default:
      return t('errors.unavailable', { group })
  }
})

const priceDelta = (amount: number) => (amount > 0 ? `+ ${price(amount)}` : '')
</script>

<template>
  <fieldset
    :class="$style.group"
    :data-error="error ? true : undefined"
    :aria-labelledby="headingId"
    :aria-describedby="error ? errorId : undefined"
    :data-group-id="group.id"
  >
    <Group justify="space-between" wrap="nowrap" align="flex-start" mb="xs">
      <div>
        <Text :id="headingId" component="legend" fw="700" size="md">{{
          localize(group.name)
        }}</Text>
        <Text size="xs" c="dimmed">
          {{ group.description ? localize(group.description) : rule }}
          <template v-if="group.selection === 'multiple'">
            · {{ t('details.selectedCount', { count: selected.length, max: group.max }) }}
          </template>
        </Text>
      </div>
      <Badge
        :color="
          required ? (error ? 'red' : selected.length >= group.min ? 'teal' : 'brand') : 'gray'
        "
        variant="light"
        size="sm"
        tt="none"
      >
        {{ required ? t('details.required') : t('details.optional') }}
      </Badge>
    </Group>

    <Stack :gap="6">
      <template v-if="group.selection === 'single'">
        <Radio.Card
          v-if="!required"
          :checked="selected.length === 0"
          :class="$style.option"
          radius="md"
          :name="group.id"
          value="__none__"
          @change="emit('clear')"
        >
          <Group wrap="nowrap" gap="sm">
            <Radio.Indicator size="sm" />
            <Text size="sm" flex="1">{{ t('details.none') }}</Text>
          </Group>
        </Radio.Card>
        <Radio.Card
          v-for="option in group.options"
          :key="option.id"
          :checked="selected.includes(option.id)"
          :disabled="option.available === false"
          :class="$style.option"
          radius="md"
          :name="group.id"
          :value="option.id"
          @change="!selected.includes(option.id) && emit('toggle', option.id)"
        >
          <Group wrap="nowrap" gap="sm">
            <Radio.Indicator size="sm" :disabled="option.available === false" />
            <Text size="sm" flex="1">{{ localize(option.name) }}</Text>
            <Text v-if="option.available === false" size="xs" c="dimmed">{{
              t('details.unavailable')
            }}</Text>
            <Text v-else size="sm" c="dimmed" class="qrm-tabular">{{
              priceDelta(option.priceDelta)
            }}</Text>
          </Group>
        </Radio.Card>
      </template>

      <template v-else>
        <Checkbox.Card
          v-for="option in group.options"
          :key="option.id"
          :checked="selected.includes(option.id)"
          :disabled="option.available === false || (atMax && !selected.includes(option.id))"
          :class="$style.option"
          radius="md"
          @change="emit('toggle', option.id)"
        >
          <Group wrap="nowrap" gap="sm">
            <Checkbox.Indicator
              size="sm"
              :disabled="option.available === false || (atMax && !selected.includes(option.id))"
            />
            <Text size="sm" flex="1">{{ localize(option.name) }}</Text>
            <Text v-if="option.available === false" size="xs" c="dimmed">{{
              t('details.unavailable')
            }}</Text>
            <Text v-else size="sm" c="dimmed" class="qrm-tabular">{{
              priceDelta(option.priceDelta)
            }}</Text>
          </Group>
        </Checkbox.Card>
      </template>
    </Stack>

    <Text v-if="error" :id="errorId" size="sm" c="red" mt="xs" role="alert" :class="$style.error">
      <PhWarningCircle :size="16" />
      {{ errorMessage }}
    </Text>
  </fieldset>
</template>

<style module>
.group {
  border: 0;
  margin: 0;
  padding: var(--mantine-spacing-sm) 0;
  min-width: 0;
  scroll-margin-top: 80px;

  &[data-error] {
    animation: shake 300ms ease;
  }
}

.option {
  padding: 12px 14px;
  transition:
    border-color 120ms ease,
    background-color 120ms ease;

  &[data-checked] {
    border-color: var(--mantine-primary-color-filled);
    background-color: var(--mantine-primary-color-light);
  }

  &:disabled,
  &[data-disabled] {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.group[data-error] .option:not([data-checked]) {
  border-color: var(--mantine-color-red-4);
}

.error {
  display: flex;
  align-items: center;
  gap: 6px;
}

@keyframes shake {
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>
