<script setup lang="ts">
import { Button, PhoneInput, Popover } from '@mantine-vue/core'
</script>

<template>
  <Popover :width="300" position="bottom" with-arrow shadow="md">
    <Popover.Target>
      <Button>Toggle popover</Button>
    </Popover.Target>
    <Popover.Dropdown>
      <PhoneInput
        label="Phone number"
        placeholder="Your phone number"
        default-country="us"
        :combobox-props="{ withinPortal: false }"
      >
        <template #flag="{ country }">
          <img
            :src="`https://hatscripts.github.io/circle-flags/flags/${country?.iso2 ?? 'xx'}.svg`"
            :alt="country?.name ?? 'Select country'"
            style="width: 20px; height: 20px; border-radius: 20px"
          />
        </template>
      </PhoneInput>
    </Popover.Dropdown>
  </Popover>
</template>
