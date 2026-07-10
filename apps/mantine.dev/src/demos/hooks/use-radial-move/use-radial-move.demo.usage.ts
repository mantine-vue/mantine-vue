import { defineComponent, h, ref } from 'vue'
import { useRadialMove } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const vueCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { useRadialMove } from '@mantine-vue/hooks'

const value = ref(115)
const { ref: radialRef } = useRadialMove((v) => { value.value = v })
</script>

<template>
  <div :ref="radialRef" class="root" :style="{ '--angle': value + 'deg' }">
    <div class="value">{{ value }}°</div>
    <div class="thumb" />
  </div>
</template>
`

const cssCode = `.root {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: grab;

  --empty-color: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6));
  --filled-color: light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-8));

  background-image: conic-gradient(
    var(--filled-color) 0deg,
    var(--filled-color) var(--angle, 0deg),
    var(--empty-color) var(--angle, 0deg)
  );
}

.value {
  background-color: var(--mantine-color-body);
  width: 132px;
  height: 132px;
  border-radius: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb {
  position: absolute;
  width: 14px;
  height: 160px;
  transform: rotate(var(--angle, 0deg));
}

.thumb::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: light-dark(var(--mantine-color-white), var(--filled-color));
  border: 2px solid light-dark(var(--filled-color), var(--mantine-color-white));
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}`

const Demo = defineComponent({
  name: 'UseRadialMoveUsageDemo',
  setup() {
    const value = ref(115)
    const { ref: radialRef } = useRadialMove((v) => {
      value.value = v
    })

    return () => {
      const angle = `${value.value}deg`

      const rootStyle = {
        position: 'relative' as const,
        width: '160px',
        height: '160px',
        borderRadius: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
        cursor: 'grab',
        '--angle': angle,
        '--empty-color': 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))',
        '--filled-color': 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-8))',
        backgroundImage: `conic-gradient(
          var(--filled-color) 0deg,
          var(--filled-color) ${angle},
          var(--empty-color) ${angle}
        )`,
      }

      const valueStyle = {
        backgroundColor: 'var(--mantine-color-body)',
        width: '132px',
        height: '132px',
        borderRadius: '132px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }

      const thumbStyle = {
        position: 'absolute' as const,
        width: '14px',
        height: '160px',
        transform: `rotate(${angle})`,
      }

      const thumbInnerStyle = {
        content: "''",
        position: 'absolute' as const,
        width: '14px',
        height: '14px',
        backgroundColor: 'var(--mantine-color-white)',
        border: '2px solid var(--mantine-color-blue-6)',
        borderRadius: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
      }

      const rootProps: Record<string, any> = { ref: radialRef, style: rootStyle }

      return h('div', rootProps, [
        h('div', { style: valueStyle }, `${value.value}°`),
        h('div', { style: thumbStyle }, [h('div', { style: thumbInnerStyle })]),
      ])
    }
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code: [
    { fileName: 'Demo.vue', code: vueCode, language: 'vue' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
