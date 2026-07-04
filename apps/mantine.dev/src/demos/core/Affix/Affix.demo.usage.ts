import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue'
import { PhArrowUp } from '@phosphor-icons/vue'
import { Affix, Button, Text, Transition } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhArrowUp } from '@phosphor-icons/vue'
import { Affix, Button, Text, Transition } from '@mantine-vue/core'

const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <Text ta="center">Affix is located at the bottom of the screen, scroll to see it</Text>
  <Affix :position="{ bottom: 20, right: 20 }">
    <Transition transition="slide-up" :mounted="scrollY > 0">
      <template #default="styles">
        <Button
          :left-section="h(PhArrowUp, { size: 16 })"
          :style="styles"
          @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
        >
          Scroll to top
        </Button>
      </template>
    </Transition>
  </Affix>
</template>
`

const Demo = defineComponent({
  name: 'AffixUsageDemo',
  setup() {
    const scrollY = ref(0)
    const handleScroll = () => {
      scrollY.value = window.scrollY
    }
    onMounted(() => window.addEventListener('scroll', handleScroll))
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))

    return () =>
      h('div', null, [
        h(
          Text,
          { ta: 'center' },
          () => 'Affix is located at the bottom of the screen, scroll to see it',
        ),
        h(
          Affix,
          { position: { bottom: 20, right: 20 } },
          {
            default: () =>
              h(
                Transition,
                { transition: 'slide-up', mounted: scrollY.value > 0 },
                {
                  default: (styles: any) =>
                    h(
                      Button,
                      {
                        leftSection: h(PhArrowUp, { size: 16 }),
                        style: styles,
                        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
                      },
                      () => 'Scroll to top',
                    ),
                },
              ),
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
