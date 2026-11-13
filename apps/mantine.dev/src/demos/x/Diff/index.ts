import { createVueDemo } from '@/demo'
import UsageDemo from './Diff.demo.usage.vue'
import usageCode from './Diff.demo.usage.vue?raw'
import SplitDemo from './Diff.demo.split.vue'
import splitCode from './Diff.demo.split.vue?raw'
import DiffMethodDemo from './Diff.demo.diffMethod.vue'
import diffMethodCode from './Diff.demo.diffMethod.vue?raw'
import ContextLinesDemo from './Diff.demo.contextLines.vue'
import contextLinesCode from './Diff.demo.contextLines.vue?raw'
import ColorsDemo from './Diff.demo.colors.vue'
import colorsCode from './Diff.demo.colors.vue?raw'

export const DiffDemos = {
  usage: createVueDemo(UsageDemo, usageCode),
  split: createVueDemo(SplitDemo, splitCode),
  diffMethod: createVueDemo(DiffMethodDemo, diffMethodCode),
  contextLines: createVueDemo(ContextLinesDemo, contextLinesCode),
  colors: createVueDemo(ColorsDemo, colorsCode),
}
