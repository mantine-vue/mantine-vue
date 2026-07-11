import { describe, expect, it, vi } from 'vitest'
import { formRootRule, isEmail, isNotEmpty, useForm } from '../index'

describe('@mantine-vue/form', () => {
  it('sets field values and tracks dirty/touched state', () => {
    const form = useForm({ initialValues: { name: '' } })

    form.setFieldValue('name', 'Ada')

    expect(form.values.value.name).toBe('Ada')
    expect(form.isDirty('name')).toBe(true)
    expect(form.isTouched('name')).toBe(true)
  })

  it('validates values with Mantine-like validators', () => {
    const form = useForm({
      initialValues: { email: '' },
      validate: { email: isEmail('Invalid email') },
    })

    expect(form.validate()).toEqual({ hasErrors: true, errors: { email: 'Invalid email' } })
    form.setFieldValue('email', 'hello@example.com')
    expect(form.isValid()).toBe(true)
  })

  it('returns input props for Vue templates', () => {
    const form = useForm({
      initialValues: { name: '' },
      validate: { name: isNotEmpty('Required') },
    })

    const props = form.getInputProps('name')
    props.onInput({ target: { value: 'Grace' } } as any)

    expect(form.values.value.name).toBe('Grace')
  })

  it('accepts raw values from Vue component onChange handlers', () => {
    const form = useForm({ initialValues: { frameworks: [] as string[] } })

    form.getInputProps('frameworks').onChange(['vue', 'react'])

    expect(form.values.value.frameworks).toEqual(['vue', 'react'])
  })

  it('submits transformed values and handles validation failures', () => {
    const submitted: unknown[] = []
    const failed: unknown[] = []
    const event = { preventDefault: vi.fn() } as any
    const form = useForm({
      initialValues: { email: '' },
      validate: { email: isEmail('Invalid email') },
      transformValues: (values) => ({ email: values.email.toLowerCase() }),
    })

    form.onSubmit(
      (values) => submitted.push(values),
      (errors) => failed.push(errors),
    )(event)

    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(submitted).toEqual([])
    expect(failed).toEqual([{ email: 'Invalid email' }])

    form.setFieldValue('email', 'HELLO@EXAMPLE.COM')
    form.onSubmit((values) => submitted.push(values))(event)

    expect(submitted).toEqual([{ email: 'hello@example.com' }])
  })

  it('returns a submit event handler from onSubmit', () => {
    const submitted: unknown[] = []
    const event = { preventDefault: vi.fn() } as any
    const form = useForm({ initialValues: { name: 'Ada' } })

    const handleSubmit = form.onSubmit((values) => submitted.push(values))

    expect(submitted).toEqual([])

    handleSubmit(event)

    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(submitted).toEqual([{ name: 'Ada' }])
  })

  it('supports inline Vue template style submit calls with $event', () => {
    const submitted: unknown[] = []
    const event = { preventDefault: vi.fn() } as any
    const form = useForm({ initialValues: { name: 'Ada' } })

    form.onSubmit((values) => submitted.push(values))(event)

    expect(submitted).toEqual([{ name: 'Ada' }])
  })

  it('supports onSubmitPreventDefault modes', () => {
    const neverEvent = { preventDefault: vi.fn() } as any
    const neverForm = useForm({
      initialValues: { name: '' },
      onSubmitPreventDefault: 'never',
    })

    neverForm.onSubmit(() => null)(neverEvent)
    expect(neverEvent.preventDefault).not.toHaveBeenCalled()

    const failedEvent = { preventDefault: vi.fn() } as any
    const failedForm = useForm({
      initialValues: { name: '' },
      validate: { name: isNotEmpty('Required') },
      onSubmitPreventDefault: 'validation-failed',
    })

    failedForm.onSubmit(() => null)(failedEvent)
    expect(failedEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('supports nested rules and formRootRule', () => {
    const form = useForm({
      initialValues: {
        user: { firstName: '' },
        fruits: [{ name: '' }],
      },
      validate: {
        user: {
          firstName: isNotEmpty('First name is required'),
        },
        fruits: {
          name: isNotEmpty('Fruit name is required'),
          [formRootRule]: (value) => (value.length < 2 ? 'Add at least two fruits' : null),
        },
      },
    })

    expect(form.validate()).toEqual({
      hasErrors: true,
      errors: {
        'user.firstName': 'First name is required',
        'fruits.0.name': 'Fruit name is required',
        fruits: 'Add at least two fruits',
      },
    })
  })

  it('supports list helpers and reset status helpers', () => {
    const form = useForm({
      initialValues: { fruits: [{ name: 'Banana' }, { name: 'Orange' }] },
      initialErrors: { 'fruits.1.name': 'Invalid fruit' },
    })

    form.insertListItem('fruits', { name: 'Apple' }, 1)
    expect(form.values.value.fruits.map((item) => item.name)).toEqual(['Banana', 'Apple', 'Orange'])
    expect(form.errors.value).toEqual({ 'fruits.2.name': 'Invalid fruit' })

    form.reorderListItem('fruits', { from: 2, to: 0 })
    expect(form.values.value.fruits.map((item) => item.name)).toEqual(['Orange', 'Banana', 'Apple'])

    form.setFieldValue('fruits.0.name', 'Pear')
    expect(form.isDirty()).toBe(true)
    form.resetDirty()
    expect(form.isDirty()).toBe(false)

    form.setFieldValue('fruits.0.name', 'Plum')
    expect(form.isTouched()).toBe(true)
    form.resetTouched()
    expect(form.isTouched()).toBe(false)
  })
})
