<script setup lang="ts">
import { Box } from '../../core'
import { Button } from '../Button'
import { Group } from '../Group'
import { useTourContext } from './Tour.context'
const ctx = useTourContext()
</script>
<template>
  <Box v-bind="ctx.getStyles('navigation')"
    ><Group justify="space-between" wrap="nowrap">
      <Button
        variant="default"
        size="compact-sm"
        v-bind="ctx.getStyles('navigationButton')"
        @click="ctx.close"
        >{{ ctx.labels.skip }}</Button
      >
      <Box component="span" aria-live="polite" v-bind="ctx.getStyles('stepCounter')">{{
        ctx.labels.stepCounter(ctx.step + 1, ctx.stepsCount)
      }}</Box>
      <Group gap="xs" wrap="nowrap"
        ><Button
          v-if="ctx.step > 0"
          variant="default"
          size="compact-sm"
          v-bind="ctx.getStyles('navigationButton')"
          @click="ctx.setStep(ctx.step - 1)"
          >{{ ctx.labels.back }}</Button
        >
        <Button
          size="compact-sm"
          :color="ctx.color"
          v-bind="ctx.getStyles('navigationButton')"
          @click="ctx.step === ctx.stepsCount - 1 ? ctx.close() : ctx.setStep(ctx.step + 1)"
          >{{ ctx.step === ctx.stepsCount - 1 ? ctx.labels.close : ctx.labels.next }}</Button
        >
      </Group></Group
    ></Box
  >
</template>
