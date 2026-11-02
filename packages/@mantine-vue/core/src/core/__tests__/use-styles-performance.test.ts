import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { MantineProvider } from '../../index'
import { useStyles } from '../styles-api'

describe('@mantine-vue/core useStyles resolution caching', () => {
  it('resolves shared variables once for all selectors and once per relevant update', async () => {
    const varsResolver = vi.fn((_theme, props: Record<string, any>) => ({
      root: { '--test-color': props.color },
    }))
    const classNamesResolver = vi.fn((_theme, props: Record<string, any>) => ({
      root: `root-${props.color}`,
    }))
    const stylesResolver = vi.fn((_theme, props: Record<string, any>) => ({
      root: { color: props.color },
    }))
    const themeClassNamesResolver = vi.fn((_theme, props: Record<string, any>) => ({
      inner: `inner-${props.color}`,
    }))
    const themeStylesResolver = vi.fn((_theme, props: Record<string, any>) => ({
      inner: { color: props.color },
    }))
    const themeVarsResolver = vi.fn((_theme, props: Record<string, any>) => ({
      label: { '--theme-color': props.color },
    }))
    const state = reactive({ color: 'red' })

    const TestComponent = defineComponent({
      setup() {
        const getStyles = useStyles({
          name: 'TestComponent',
          props: state,
          classes: { root: 'root', inner: 'inner', label: 'label' },
          classNames: classNamesResolver,
          styles: stylesResolver,
          varsResolver,
        })

        return () =>
          h('div', getStyles('root'), [
            h('span', getStyles('inner')),
            h('span', getStyles('label')),
          ])
      },
    })

    const wrapper = mount({
      render: () =>
        h(
          MantineProvider,
          {
            env: 'test',
            theme: {
              components: {
                TestComponent: {
                  classNames: themeClassNamesResolver,
                  styles: themeStylesResolver,
                  vars: themeVarsResolver,
                },
              },
            },
          },
          () => h(TestComponent),
        ),
    })

    expect(varsResolver).toHaveBeenCalledTimes(1)
    expect(classNamesResolver).toHaveBeenCalledTimes(1)
    expect(stylesResolver).toHaveBeenCalledTimes(1)
    expect(themeClassNamesResolver).toHaveBeenCalledTimes(1)
    expect(themeStylesResolver).toHaveBeenCalledTimes(1)
    expect(themeVarsResolver).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.root').attributes('style')).toContain('--test-color: red')

    state.color = 'blue'
    await nextTick()

    expect(varsResolver).toHaveBeenCalledTimes(2)
    expect(classNamesResolver).toHaveBeenCalledTimes(2)
    expect(stylesResolver).toHaveBeenCalledTimes(2)
    expect(themeClassNamesResolver).toHaveBeenCalledTimes(2)
    expect(themeStylesResolver).toHaveBeenCalledTimes(2)
    expect(themeVarsResolver).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.root').attributes('style')).toContain('--test-color: blue')
  })

  it('preserves theme, component, selector option, variable and root style precedence', () => {
    const TestComponent = defineComponent({
      setup() {
        const getStyles = useStyles({
          name: 'TestComponent',
          props: {},
          classes: { root: 'base-root' },
          classNames: { root: 'component-root' },
          styles: { root: { color: 'blue', padding: '1px' } },
          varsResolver: () => ({ root: { '--shared': 'base', '--base-only': 'yes' } }),
          vars: { root: { '--shared': 'instance' } },
          className: 'root-class',
          style: { color: 'green', margin: '2px' },
        })

        return () =>
          h(
            'div',
            getStyles('root', {
              classNames: { root: 'option-root' },
              styles: { root: { color: 'purple', padding: '3px' } },
              className: 'option-class',
              style: { color: 'black' },
            }),
          )
      },
    })

    const wrapper = mount({
      render: () =>
        h(
          MantineProvider,
          {
            env: 'test',
            theme: {
              components: {
                TestComponent: {
                  classNames: { root: 'theme-root' },
                  styles: { root: { color: 'red', borderWidth: '1px' } },
                  vars: () => ({ root: { '--shared': 'theme', '--theme-only': 'yes' } }),
                },
              },
            },
          },
          () => h(TestComponent),
        ),
    })

    const root = wrapper.find('.base-root')
    expect(root.classes()).toEqual(
      expect.arrayContaining([
        'base-root',
        'mantine-TestComponent-root',
        'option-root',
        'root-class',
        'option-class',
      ]),
    )
    expect(root.classes()).not.toContain('component-root')
    expect(root.classes()).not.toContain('theme-root')
    expect(root.attributes('style')).toContain('color: black')
    expect(root.attributes('style')).toContain('padding: 3px')
    expect(root.attributes('style')).toContain('margin: 2px')
    // Selector-level records replace lower-precedence records as they did before caching.
    expect(root.attributes('style')).not.toContain('border-width: 1px')
    expect(root.attributes('style')).toContain('--shared: instance')
    expect(root.attributes('style')).toContain('--base-only: yes')
    expect(root.attributes('style')).toContain('--theme-only: yes')
  })
})
