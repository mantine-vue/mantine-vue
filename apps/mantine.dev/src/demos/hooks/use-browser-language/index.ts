import { defineComponent, h } from 'vue'
import { Code, List, ListItem, Text } from '@mantine-vue/core'
import { useBrowserLanguage, usePreferredLanguages } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { Code, Text } from '@mantine-vue/core'
import { useBrowserLanguage } from '@mantine-vue/hooks'

const language = useBrowserLanguage()
</script>

<template>
  <Text>
    Your browser language: <Code>{{ language ?? 'unknown' }}</Code>
  </Text>
</template>`

export const usage: MantineDemo = {
  type: 'code',
  code: usageCode,
  component: defineComponent({
    name: 'UseBrowserLanguageUsageDemo',
    setup() {
      const language = useBrowserLanguage()
      return () =>
        h(Text, null, () => [
          'Your browser language: ',
          h(Code, null, () => language.value ?? 'unknown'),
        ])
    },
  }),
}

const languagesCode = `<script setup lang="ts">
import { Code, List, ListItem, Text } from '@mantine-vue/core'
import { usePreferredLanguages } from '@mantine-vue/hooks'

const languages = usePreferredLanguages()
</script>

<template>
  <Text mb="xs">Your preferred languages, most preferred first:</Text>
  <List with-padding>
    <ListItem v-for="language in languages" :key="language">
      <Code>{{ language }}</Code>
    </ListItem>
  </List>
</template>`

export const languages: MantineDemo = {
  type: 'code',
  code: languagesCode,
  component: defineComponent({
    name: 'UseBrowserLanguageLanguagesDemo',
    setup() {
      const preferred = usePreferredLanguages()
      return () => [
        h(Text, { mb: 'xs' }, () => 'Your preferred languages, most preferred first:'),
        h(List, { withPadding: true }, () =>
          preferred.value.map((language) =>
            h(ListItem, { key: language }, () => h(Code, null, () => language)),
          ),
        ),
      ]
    },
  }),
}

export const UseBrowserLanguageDemos = { usage, languages }
