import { defineComponent, h, ref } from 'vue'
import { Button, Group, Skeleton, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Skeleton, Button, Group, Text } from '@mantine-vue/core'

const loading = ref(true)
</script>

<template>
  <Skeleton :visible="loading">
    <Text>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor nihil amet tempore
      magnam optio, numquam nostrum inventore tempora assumenda saepe, aut repellat. Temporibus
      aspernatur aperiam magnam debitis facere odio?
    </Text>
    <Text>
      Laborum fuga quam voluptas aut pariatur delectus repudiandae commodi tempora debitis
      dolores vero cumque magni cum, deserunt, ad tempore consectetur libero molestias similique
      nemo eum! Dolore maxime voluptate inventore atque.
    </Text>
  </Skeleton>

  <Group justify="center" mt="xs">
    <Button @click="loading = !loading">Toggle Skeleton</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'SkeletonContentDemo',
  setup() {
    const loading = ref(true)
    return () =>
      h('div', [
        h(
          Skeleton,
          { visible: loading.value },
          {
            default: () => [
              h(
                Text,
                {},
                {
                  default: () =>
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor nihil amet tempore magnam optio, numquam nostrum inventore tempora assumenda saepe, aut repellat. Temporibus aspernatur aperiam magnam debitis facere odio?',
                },
              ),
              h(
                Text,
                {},
                {
                  default: () =>
                    'Laborum fuga quam voluptas aut pariatur delectus repudiandae commodi tempora debitis dolores vero cumque magni cum, deserunt, ad tempore consectetur libero molestias similique nemo eum! Dolore maxime voluptate inventore atque.',
                },
              ),
            ],
          },
        ),
        h(
          Group,
          { justify: 'center', mt: 'xs' },
          {
            default: () =>
              h(
                Button,
                {
                  onClick: () => {
                    loading.value = !loading.value
                  },
                },
                {
                  default: () => 'Toggle Skeleton',
                },
              ),
          },
        ),
      ])
  },
})

export const content: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
