<script setup lang="ts">
import data from '@emoji-mart/data'
import { emojiMartAdapter, EmojiPicker } from '@mantine-vue/emoji'

const emojiData = emojiMartAdapter(data)
</script>

<template>
  <EmojiPicker
    :data="emojiData"
    :category-labels="{
      frequent: 'Utilisés fréquemment',
      people: 'Smileys et personnes',
      nature: 'Animaux et nature',
      foods: 'Nourriture et boissons',
      activity: 'Activités',
      places: 'Voyages et lieux',
      objects: 'Objets',
      symbols: 'Symboles',
      flags: 'Drapeaux',
    }"
    :labels="{
      search: 'Rechercher',
      noResults: 'Aucun emoji trouvé',
      skinTone: 'Teinte de peau',
      searchResults: 'Résultats de recherche',
    }"
  />
</template>
