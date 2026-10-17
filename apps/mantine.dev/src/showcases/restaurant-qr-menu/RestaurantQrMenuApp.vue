<script setup lang="ts">
import { createQrMenuContext } from './app/create-qr-menu-context'
import QrMenuProvider from './components/shell/QrMenuProvider.vue'
import QrMenuShell from './components/shell/QrMenuShell.vue'
import './styles.css'

const context = createQrMenuContext()
</script>

<template>
  <QrMenuProvider :context="context">
    <QrMenuShell />
  </QrMenuProvider>
</template>
