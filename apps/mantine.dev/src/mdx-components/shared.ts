import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { RouterLink } from 'vue-router'

// Shared content blocks reused across many component pages. Each renders a
// titled section so the table of contents picks up the heading id.

function Title(id: string, text: string): VNodeChild {
  return h('h2', { id, class: 'mdx-h2' }, text)
}
function P(children: VNodeChild[]): VNodeChild {
  return h('p', { class: 'mdx-p' }, children)
}
function C(text: string): VNodeChild {
  return h('code', { class: 'mdx-code-inline' }, text)
}
function L(href: string, text: string): VNodeChild {
  return h(RouterLink, { to: href, class: 'mdx-link' }, { default: () => text })
}
function Li(children: VNodeChild[]): VNodeChild {
  return h('li', { class: 'mdx-li' }, children)
}
function Ul(children: VNodeChild[]): VNodeChild {
  return h('ul', { class: 'mdx-ul' }, children)
}
function CodeBlock(code: string, language = 'tsx'): VNodeChild {
  return h('pre', { class: 'mdx-pre' }, [h('code', { class: `language-${language}` }, code.trim())])
}

export const MdxGradient = defineComponent({
  name: 'MdxGradient',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('gradient-variant', 'Gradient variant'),
      P([
        'When the ',
        C('variant'),
        ' prop is set to ',
        C('gradient'),
        ', you can control the gradient with the ',
        C('gradient'),
        ' prop, which accepts an object with ',
        C('from'),
        ', ',
        C('to'),
        ' and ',
        C('deg'),
        ' properties. If the ',
        C('gradient'),
        ' prop is not set, ',
        C(props.component),
        ' will use ',
        C('theme.defaultGradient'),
        ' which can be configured on the ',
        L('/theming/theme-object', 'theme object'),
        '.',
      ]),
      P([
        'Note that ',
        C('variant="gradient"'),
        ' supports only linear gradients with two colors. If you need a more complex gradient, use the ',
        L('/styles/styles-api', 'Styles API'),
        ' to modify ',
        C(props.component),
        ' styles.',
      ]),
    ]
  },
})

export const MdxAutoContrast = defineComponent({
  name: 'MdxAutoContrast',
  props: {
    component: { type: String, default: 'Component' },
    withVariant: { type: Boolean, default: true },
  },
  setup(props) {
    return () => [
      Title('auto-contrast', 'autoContrast'),
      P([
        C(props.component),
        ' supports the ',
        C('autoContrast'),
        ' prop and ',
        L('/theming/theme-object', 'theme.autoContrast'),
        '. If ',
        C('autoContrast'),
        ' is set either on ',
        C(props.component),
        ' or on the theme, the content color will be adjusted to have sufficient contrast with the value specified in the ',
        C('color'),
        ' prop.',
      ]),
      P([
        'Note that the ',
        C('autoContrast'),
        ' feature works only if you use the ',
        C('color'),
        ' prop to change the background color.',
        ...(props.withVariant
          ? [' ', C('autoContrast'), ' works only with the ', C('filled'), ' variant.']
          : []),
      ]),
    ]
  },
})

export const MdxStylesApiSelectors = defineComponent({
  name: 'MdxStylesApiSelectors',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('styles-api', 'Styles API'),
      P([
        C(props.component),
        ' supports the ',
        L('/styles/styles-api', 'Styles API'),
        '; you can add styles to any inner element of the component with the ',
        C('classNames'),
        ' prop. Follow the ',
        L('/styles/styles-api', 'Styles API'),
        ' documentation to learn more.',
      ]),
    ]
  },
})

export const MdxPolymorphic = defineComponent({
  name: 'MdxPolymorphic',
  props: {
    component: { type: String, default: 'Component' },
    defaultElement: { type: String, default: 'div' },
    changeToElement: { type: String, default: 'a' },
    withNext: { type: [Boolean, String] as PropType<boolean | string>, default: false },
    package: { type: String, default: '@mantine-vue/core' },
  },
  setup(props) {
    return () => [
      Title('polymorphic-component', 'Polymorphic component'),
      P([
        C(props.component),
        ' is a ',
        L('/guides/polymorphic', 'polymorphic component'),
        ' – its default root element is ',
        C(props.defaultElement),
        ', but it can be changed to any other element or component with the ',
        C('component'),
        ' prop:',
      ]),
      CodeBlock(`import { ${props.component} } from '${props.package}';

function Demo() {
  return <${props.component} component="${props.changeToElement}" />;
}`),
    ]
  },
})

export const MdxWrapperProps = defineComponent({
  name: 'MdxWrapperProps',
  props: {
    component: { type: String, default: 'Component' },
    package: { type: String, default: '@mantine-vue/core' },
  },
  setup(props) {
    return () => [
      Title('browser-support', 'Add props to the root element'),
      P([
        'All props passed to the component are forwarded to the input element. If you need to add props to the root element, use ',
        C('wrapperProps'),
        '. In the following example:',
      ]),
      Ul([
        Li([C('data-testid="wrapper"'), ' is added to the root element']),
        Li([C('data-testid="input"'), ' is added to the input element']),
      ]),
      CodeBlock(
        `<script setup lang="ts">
import { ${props.component} } from '${props.package}'
</script>

<template>
  <${props.component} :wrapperProps="{ 'data-testid': 'wrapper' }" data-testid="input" />
</template>`,
        'vue',
      ),
    ]
  },
})

export const MdxClearSectionMode = defineComponent({
  name: 'MdxClearSectionMode',
  setup() {
    return () => [
      Title('clear-section-mode', 'Clear section mode'),
      P([
        'The ',
        C('clearSectionMode'),
        ' prop determines how the clear button and ',
        C('rightSection'),
        ' are rendered:',
      ]),
      Ul([
        Li([C("'both'"), ' (default) – render both the clear button and ', C('rightSection')]),
        Li([
          C("'rightSection'"),
          ' – render only the user-supplied ',
          C('rightSection'),
          ', ignore clear button',
        ]),
        Li([C("'clear'"), ' – render only the clear button, ignore ', C('rightSection')]),
      ]),
    ]
  },
})

export const MdxInputFeatures = defineComponent({
  name: 'MdxInputFeatures',
  props: {
    component: { type: String, default: 'Component' },
    element: { type: String, default: 'input' },
  },
  setup(props) {
    return () =>
      P([
        C(props.component),
        ' component supports ',
        L('/core/input', 'Input'),
        ' and ',
        L('/core/input', 'Input.Wrapper'),
        ' component features and all ',
        C(props.element),
        ' element props. The ',
        C(props.component),
        ' documentation does not include all features supported by the component – see the ',
        L('/core/input', 'Input'),
        ' documentation to learn about all available features.',
      ])
  },
})

export const MdxInputSections = defineComponent({
  name: 'MdxInputSections',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('left-and-right-sections', 'Left and right sections'),
      P([
        C(props.component),
        ' supports ',
        C('leftSection'),
        ' and ',
        C('rightSection'),
        ' props. These sections are rendered with absolute positioning inside the input wrapper. You can use them to display icons, input controls, or any other elements.',
      ]),
      P(['You can use the following props to control sections styles and content:']),
      Ul([
        Li([
          C('rightSection'),
          ' / ',
          C('leftSection'),
          ' – node to render on the corresponding side of input',
        ]),
        Li([
          C('rightSectionWidth'),
          '/',
          C('leftSectionWidth'),
          ' – controls the width of the right section and padding on the corresponding side of the input. By default, it is controlled by the component ',
          C('size'),
          ' prop.',
        ]),
        Li([
          C('rightSectionPointerEvents'),
          '/',
          C('leftSectionPointerEvents'),
          ' – controls the ',
          C('pointer-events'),
          ' property of the section. If you want to render a non-interactive element, set it to ',
          C('none'),
          ' to pass clicks through to the input.',
        ]),
      ]),
    ]
  },
})

export const MdxInputAccessibility = defineComponent({
  name: 'MdxInputAccessibility',
  props: {
    component: { type: String, default: 'Component' },
    package: { type: String, default: '@mantine-vue/core' },
  },
  setup(props) {
    return () => {
      const pkg = props.package || '@mantine-vue/core'
      const comp = props.component
      return [
        Title('accessibility', 'Accessibility'),
        P([
          'If ',
          C(comp),
          ' is used without the ',
          C('label'),
          ' prop, it will not be announced properly by screen readers:',
        ]),
        CodeBlock(
          `<script setup lang="ts">\nimport { ${comp} } from '${pkg}'\n</script>\n\n<template>\n  <!-- Inaccessible input – screen reader will not announce it properly -->\n  <${comp} />\n</template>`,
          'vue',
        ),
        P([
          'Set ',
          C('aria-label'),
          ' to make the input accessible. In this case the label will not be visible, but screen readers will announce it:',
        ]),
        CodeBlock(
          `<script setup lang="ts">\nimport { ${comp} } from '${pkg}'\n</script>\n\n<template>\n  <!-- Accessible input – it has aria-label -->\n  <${comp} aria-label="My input" />\n</template>`,
          'vue',
        ),
        P([
          'If the ',
          C('label'),
          ' prop is set, the input will be accessible and it is not required to set ',
          C('aria-label'),
          ':',
        ]),
        CodeBlock(
          `<script setup lang="ts">\nimport { ${comp} } from '${pkg}'\n</script>\n\n<template>\n  <!-- Accessible input – it has associated label element -->\n  <${comp} label="My input" />\n</template>`,
          'vue',
        ),
      ]
    }
  },
})

export const MdxComboboxDisclaimer = defineComponent({
  name: 'MdxComboboxDisclaimer',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('combobox', 'Made with Combobox'),
      P([
        C(props.component),
        ' is an ',
        h('b', null, 'opinionated'),
        ' component built on top of the ',
        L('/core/combobox', 'Combobox'),
        ' component. It has a limited set of features to cover only basic use cases. If you need more advanced features, you can build your own component with ',
        L('/core/combobox', 'Combobox'),
        '. You can find examples of custom ',
        props.component.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(),
        ' components on ',
        L('/combobox/?e=BasicSelect', 'the examples page'),
        '.',
      ]),
    ]
  },
})

export const MdxComboboxData = defineComponent({
  name: 'MdxComboboxData',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => {
      const c = props.component
      const isStringOnly = c === 'Autocomplete' || c === 'TagsInput'
      const pkg = '@mantine-vue/core'

      const stringArrayCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c} :data="['React', 'Angular']" />\n</template>`

      const arrayCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c}\n    :data="[\n      { value: 'react', label: 'React' },\n      { value: 'ng', label: 'Angular' },\n    ]"\n  />\n</template>`

      const stringGroupsCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c}\n    :data="[\n      { group: 'Frontend', items: ['React', 'Angular'] },\n      { group: 'Backend', items: ['Express', 'Django'] },\n    ]"\n  />\n</template>`

      const groupsCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c}\n    :data="[\n      { group: 'Frontend', items: [{ value: 'react', label: 'React' }, { value: 'ng', label: 'Angular' }] },\n      { group: 'Backend', items: [{ value: 'express', label: 'Express' }, { value: 'django', label: 'Django' }] },\n    ]"\n  />\n</template>`

      const nodes: VNodeChild[] = [
        Title('data-formats', 'Data formats'),
        P([C(c), ' ', C('data'), ' prop accepts data in one of the following formats:']),
        P([
          `Array of ${isStringOnly ? 'strings' : 'primitive values (strings, numbers, booleans)'}:`,
        ]),
        CodeBlock(stringArrayCode, 'vue'),
      ]

      if (!isStringOnly) {
        nodes.push(
          P([
            'Array of objects with ',
            C('value'),
            ', ',
            C('label'),
            ' and optional ',
            C('disabled'),
            ' keys:',
          ]),
          CodeBlock(arrayCode, 'vue'),
        )
      }

      nodes.push(
        P([
          `Array of groups with ${isStringOnly ? 'string' : 'primitive value (string, number, boolean)'} options:`,
        ]),
        CodeBlock(stringGroupsCode, 'vue'),
      )

      if (!isStringOnly) {
        nodes.push(P(['Array of groups with object options:']), CodeBlock(groupsCode, 'vue'))
      }

      return nodes
    }
  },
})

export const MdxComboboxFiltering = defineComponent({
  name: 'MdxComboboxFiltering',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('options-filtering', 'Options filtering'),
      P([
        'By default, ',
        C(props.component),
        ' filters options by checking if the option label contains the input value. You can change this behavior with the ',
        C('filter'),
        ' prop. The ',
        C('filter'),
        ' function receives an object with the following properties as a single argument:',
      ]),
      Ul([
        Li([
          C('options'),
          ' – array of options or options groups, all options are in ',
          C('{ value: string; label: string; disabled?: boolean }'),
          ' format',
        ]),
        Li([C('search'), ' – current search query']),
        Li([C('limit'), ' – value of the ', C('limit'), ' prop passed to ', C(props.component)]),
      ]),
      P([
        'Example of a custom filter function that matches options by words instead of letter sequence:',
      ]),
    ]
  },
})

export const MdxComboboxLargeData = defineComponent({
  name: 'MdxComboboxLargeData',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => [
      Title('large-data-sets', 'Large data sets'),
      P([
        'The best strategy for large data sets is to limit the number of options that are rendered at the same time. You can do this with the ',
        C('limit'),
        ' prop. Note that if you use a custom ',
        C('filter'),
        ' function, you need to implement your own logic to limit the number of options in ',
        C('filter'),
        '.',
      ]),
      P([
        'Example of ',
        C(props.component),
        ' with 100,000 options, 5 options are rendered at the same time:',
      ]),
    ]
  },
})

export const MdxComboboxProps = defineComponent({
  name: 'MdxComboboxProps',
  props: { component: { type: String, default: 'Component' } },
  setup(props) {
    return () => {
      const c = props.component
      const pkg = '@mantine-vue/core'
      const portalCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c} :combobox-props="{ withinPortal: false }" :data="[]" />\n</template>`
      const zIndexCode = `<script setup lang="ts">\nimport { ${c} } from '${pkg}'\n</script>\n\n<template>\n  <${c} :combobox-props="{ zIndex: 1000 }" :data="[]" />\n</template>`
      return [
        Title('combobox-props', 'Combobox props'),
        P([
          'You can override ',
          L('/core/combobox', 'Combobox'),
          ' props with ',
          C('comboboxProps'),
          '. This is useful when you need to change some of the props that are not exposed by ',
          C(c),
          ', for example ',
          C('withinPortal'),
          ':',
        ]),
        CodeBlock(portalCode, 'vue'),
        Title('change-z-index', 'Change dropdown z-index'),
        CodeBlock(zIndexCode, 'vue'),
      ]
    }
  },
})

const COMMON_REFS: Record<string, string> = {
  div: 'HTMLDivElement',
  button: 'HTMLButtonElement',
  input: 'HTMLInputElement',
  textarea: 'HTMLTextAreaElement',
  select: 'HTMLSelectElement',
  a: 'HTMLAnchorElement',
}

export const MdxGetElementRef = defineComponent({
  name: 'MdxGetElementRef',
  props: {
    component: { type: String, default: 'Component' },
    refType: { type: String, default: 'div' },
    package: { type: String, default: '@mantine-vue/core' },
  },
  setup(props) {
    return () => {
      const refType = COMMON_REFS[props.refType] ?? props.refType
      return [
        Title('get-element-ref', 'Get element ref'),
        CodeBlock(`import { ref } from 'vue';
import { ${props.component} } from '${props.package}';

const elementRef = ref<${refType} | null>(null);
// <${props.component} ref="elementRef" />`),
      ]
    }
  },
})
