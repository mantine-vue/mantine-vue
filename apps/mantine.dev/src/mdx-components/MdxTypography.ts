import { defineComponent, h } from 'vue'
import { Code } from '@mantine-vue/core'
import classes from './MdxTypography.module.css'

function createMdxElement(name: string, element: 'p' | 'ul' | 'li', className: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () => h(element, { ...attrs, class: [className, attrs.class] }, slots.default?.())
    },
  })
}

export const MdxParagraph = createMdxElement('MdxParagraph', 'p', classes.paragraph)
export const MdxUl = createMdxElement('MdxUl', 'ul', classes.ul)
export const MdxLi = createMdxElement('MdxLi', 'li', classes.li)

export const MdxCode = defineComponent({
  name: 'MdxCode',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => h(Code, attrs, { default: () => slots.default?.() })
  },
})
