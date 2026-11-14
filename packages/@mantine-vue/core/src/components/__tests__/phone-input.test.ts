import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MantineProvider } from '../../core'
import { PhoneInput } from '../PhoneInput'

const wrappers: VueWrapper[] = []

function render(props: Record<string, any> = {}) {
  const wrapper = mount(MantineProvider, {
    props: { env: 'test' },
    slots: { default: () => h(PhoneInput, { defaultCountry: 'us', ...props }) },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
})

const flush = async () => {
  await nextTick()
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

const input = () => document.querySelector<HTMLInputElement>('input[type="tel"]')!
const countryButton = () => document.querySelector<HTMLButtonElement>('button[aria-haspopup]')!

async function typeValue(value: string) {
  const element = input()
  element.focus()
  element.value = value
  element.setSelectionRange(value.length, value.length)
  element.dispatchEvent(new Event('input', { bubbles: true }))
  await flush()
}

describe('@mantine-vue/core/PhoneInput', () => {
  it('renders input with type="tel"', () => {
    render()
    expect(input()).toBeTruthy()
  })

  it('renders default country in the country button', () => {
    render({ defaultCountry: 'gb' })
    expect(countryButton().getAttribute('aria-label')).toBe('United Kingdom')
    expect(countryButton().textContent).toContain('GB')
  })

  it('renders select country label when no country is selected', () => {
    render({ defaultCountry: undefined, selectCountryLabel: 'Pick a country' })
    expect(countryButton().getAttribute('aria-label')).toBe('Pick a country')
  })

  it('works as uncontrolled with defaultValue and infers country from it', () => {
    render({ defaultCountry: 'gb', defaultValue: '+12025551234' })
    expect(input().value).toBe('+1 (202) 555-1234')
    expect(countryButton().textContent).toContain('US')
  })

  it('emits raw and formatted values', async () => {
    const onChange = vi.fn()
    const onUpdate = vi.fn()
    render({ onChange, 'onUpdate:modelValue': onUpdate })
    await typeValue('+1 2025551234')
    expect(onChange).toHaveBeenLastCalledWith('+12025551234', {
      formattedValue: '+1 (202) 555-1234',
      country: expect.objectContaining({ iso2: 'us', dialCode: '1' }),
    })
    expect(onUpdate).toHaveBeenLastCalledWith('+12025551234')
    expect(input().value).toBe('+1 (202) 555-1234')
  })

  it('supports controlled value', async () => {
    const value = ref('+12025551234')
    const wrapper = mount(MantineProvider, {
      props: { env: 'test' },
      slots: { default: () => h(PhoneInput, { modelValue: value.value }) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect(input().value).toBe('+1 (202) 555-1234')
    value.value = '+442071234567'
    await flush()
    expect(countryButton().textContent).toContain('GB')
  })

  it('opens dropdown on country button click and selects country', async () => {
    const onCountryChange = vi.fn()
    render({ onlyCountries: ['us', 'gb'], onCountryChange })
    expect(countryButton().getAttribute('aria-expanded')).toBe('false')
    countryButton().click()
    await flush()
    const options = document.querySelectorAll<HTMLElement>('[role="option"]')
    expect(countryButton().getAttribute('aria-expanded')).toBe('true')
    expect(options).toHaveLength(2)
    options[1].click()
    await flush()
    expect(countryButton().textContent).toContain('GB')
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ iso2: 'gb' }))
    expect(input().value).toBe('+44 ')
  })

  it('excludes countries and shows preferred countries first', async () => {
    render({ excludeCountries: ['gb'], preferredCountries: ['de', 'fr'] })
    countryButton().click()
    await flush()
    const options = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'))
    expect(options[0].textContent).toContain('Germany')
    expect(options[1].textContent).toContain('France')
    expect(options.some((option) => option.textContent?.includes('United Kingdom'))).toBe(false)
  })

  it('filters countries with search and getCountryLabel', async () => {
    render({
      onlyCountries: ['us', 'de'],
      getCountryLabel: (country: any) => (country.iso2 === 'de' ? 'Deutschland' : country.name),
    })
    countryButton().click()
    await flush()
    const search = document.querySelector<HTMLInputElement>(
      'input[placeholder="Search countries"]',
    )!
    search.value = 'deutsch'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    const options = document.querySelectorAll('[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0].textContent).toContain('Germany')
  })

  it('hides search when searchable is false', async () => {
    render({ searchable: false })
    countryButton().click()
    await flush()
    expect(document.querySelector('input[placeholder="Search countries"]')).toBeNull()
  })

  it('disables country button when disabled or readOnly', () => {
    render({ disabled: true })
    expect(countryButton().disabled).toBe(true)
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
    render({ readOnly: true })
    expect(countryButton().disabled).toBe(true)
  })

  it('auto-detects country from typed dial code when withCountryAutoDetect is set', async () => {
    const onCountryChange = vi.fn()
    render({ withCountryAutoDetect: true, onCountryChange })
    await typeValue('+44 2071234567')
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ iso2: 'gb' }))
    expect(countryButton().textContent).toContain('GB')
  })

  it('does not display dial code prefix when international is false', async () => {
    const onChange = vi.fn()
    render({ international: false, onChange })
    await typeValue('2025551234')
    expect(onChange).toHaveBeenLastCalledWith('+12025551234', expect.anything())
    expect(input().value).toBe('(202) 555-1234')
  })

  it('restores dial code when input is cleared', async () => {
    const onChange = vi.fn()
    render({ defaultValue: '+12025551234', onChange })
    await typeValue('')
    expect(onChange).toHaveBeenLastCalledWith('+1', expect.anything())
  })

  it('clamps raw value to mask length', async () => {
    const onChange = vi.fn()
    render({ onChange })
    await typeValue('+1 202555123456789')
    expect(onChange).toHaveBeenLastCalledWith('+12025551234', expect.anything())
  })

  it('renders custom flags and options', async () => {
    render({
      onlyCountries: ['us'],
      renderFlag: (country: any) => h('i', { 'data-flag': country?.iso2 ?? 'none' }),
    })
    expect(countryButton().querySelector('[data-flag="us"]')).toBeTruthy()
    countryButton().click()
    await flush()
    expect(document.querySelector('[role="option"] [data-flag="us"]')).toBeTruthy()
  })

  it('renders chevron when withChevron is set', () => {
    render({ withChevron: true })
    expect(countryButton().querySelector('[data-combobox-chevron]')).toBeTruthy()
  })

  it('emits dropdown open and close events', async () => {
    const onDropdownOpen = vi.fn()
    const onDropdownClose = vi.fn()
    render({ onDropdownOpen, onDropdownClose })
    countryButton().click()
    await flush()
    expect(onDropdownOpen).toHaveBeenCalledTimes(1)
    countryButton().click()
    await flush()
    expect(onDropdownClose).toHaveBeenCalledTimes(1)
  })

  it('renders nothing found message', async () => {
    render({ nothingFoundMessage: 'Nothing found' })
    countryButton().click()
    await flush()
    const search = document.querySelector<HTMLInputElement>(
      'input[placeholder="Search countries"]',
    )!
    search.value = 'zzzz'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    expect(document.body.textContent).toContain('Nothing found')
  })
})
