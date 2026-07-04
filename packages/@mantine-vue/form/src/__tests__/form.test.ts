import { describe, expect, it } from 'vitest'
import { isEmail, isNotEmpty, useForm } from '../index'

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
})
