<script setup lang="ts">
import { PhoneInput, type PhoneInputCountryData } from '@mantine-vue/core'

const COUNTRIES_ES: Record<string, string> = {
  us: 'Estados Unidos',
  gb: 'Reino Unido',
  es: 'España',
  mx: 'México',
  ar: 'Argentina',
}

const getCountryLabel = (country: PhoneInputCountryData) =>
  COUNTRIES_ES[country.iso2] ?? country.name
const flag = (iso2: string) => `https://hatscripts.github.io/circle-flags/flags/${iso2}.svg`
</script>

<template>
  <PhoneInput
    label="Número de teléfono"
    placeholder="Tu número de teléfono"
    default-country="es"
    :only-countries="['us', 'gb', 'es', 'mx', 'ar']"
    nothing-found-message="No se encontraron países"
    search-placeholder="Buscar países"
    select-country-label="Seleccionar país"
    :get-country-label="getCountryLabel"
  >
    <template #flag="{ country }">
      <img
        :src="flag(country?.iso2 ?? 'xx')"
        :alt="country ? getCountryLabel(country) : 'Seleccionar país'"
        style="width: 20px; height: 20px; border-radius: 20px"
      />
    </template>
    <template #countryOption="{ country }">
      <span style="display: flex; align-items: center; gap: 8px; width: 100%">
        <img
          :src="flag(country.iso2)"
          :alt="getCountryLabel(country)"
          style="width: 20px; height: 20px; border-radius: 20px"
        />
        <span style="flex: 1">{{ getCountryLabel(country) }}</span>
        <span style="opacity: 0.5; font-size: var(--mantine-font-size-xs)">
          +{{ country.dialCode }}
        </span>
      </span>
    </template>
  </PhoneInput>
</template>
