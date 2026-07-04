import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import {
  MantineProvider,
  Progress,
  ProgressLabel,
  ProgressRoot,
  ProgressSection,
} from '../../index'

function withProvider(component: any) {
  return mount({
    render: () => h(MantineProvider, { env: 'test' }, () => component()),
  })
}

describe('@mantine-vue/core Progress', () => {
  it('renders single section through Progress shorthand', () => {
    const wrapper = withProvider(() =>
      h(Progress, {
        value: 40,
        color: 'blue',
        striped: true,
        animated: true,
        'aria-label': 'Loading',
      }),
    )
    const section = wrapper.find('[role="progressbar"]')

    expect(wrapper.find('.mantine-Progress-root').exists()).toBe(true)
    expect(section.attributes('aria-valuenow')).toBe('40')
    expect(section.attributes('aria-valuetext')).toBe('40%')
    expect(section.attributes('aria-label')).toBe('Loading')
    expect(section.attributes('data-striped')).toBe('true')
    expect(section.attributes('data-animated')).toBe('true')
    expect(section.attributes('style')).toContain('--progress-section-size: 40%')
  })

  it('supports compound root, section, and label components', () => {
    const wrapper = withProvider(() =>
      h(
        ProgressRoot,
        { size: 'xl', radius: 'sm', orientation: 'vertical', transitionDuration: 250 },
        () => [
          h(ProgressSection, { value: 25, color: 'teal' }, () =>
            h(ProgressLabel, null, () => '25%'),
          ),
          h(ProgressSection, { value: 50, withAria: false }, () =>
            h(ProgressLabel, null, () => '50%'),
          ),
        ],
      ),
    )

    const root = wrapper.find('.mantine-Progress-root')
    const sections = wrapper.findAll('.mantine-Progress-section')

    expect(root.attributes('data-orientation')).toBe('vertical')
    expect(root.attributes('style')).toContain('--progress-size: var(--progress-size-xl)')
    expect(root.attributes('style')).toContain('--progress-radius: var(--mantine-radius-sm)')
    expect(root.attributes('style')).toContain('--progress-transition-duration: 250ms')
    expect(sections).toHaveLength(2)
    expect(sections[0].attributes('aria-valuenow')).toBe('25')
    expect(sections[1].attributes('role')).toBeUndefined()
    expect(wrapper.findAll('.mantine-Progress-label').map((item) => item.text())).toEqual([
      '25%',
      '50%',
    ])
  })

  it('exposes static components', () => {
    expect(Progress.Root).toBe(ProgressRoot)
    expect(Progress.Section).toBe(ProgressSection)
    expect(Progress.Label).toBe(ProgressLabel)
  })
})
