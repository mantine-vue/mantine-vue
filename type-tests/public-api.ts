import { Autocomplete, Box, Button } from '@mantine-vue/core'

type ButtonProps = InstanceType<typeof Button>['$props']
type AutocompleteProps = InstanceType<typeof Autocomplete>['$props']
type BoxPublicProps = InstanceType<typeof Box>['$props']
type IsAny<T> = 0 extends 1 & T ? true : false
type ExpectFalse<T extends false> = T
type _BoxMyIsNotAny = ExpectFalse<IsAny<BoxPublicProps['my']>>
type _BoxBgIsNotAny = ExpectFalse<IsAny<BoxPublicProps['bg']>>

const buttonProps: ButtonProps = { variant: 'filled', size: 'sm', fullWidth: true }
const autocompleteProps: AutocompleteProps = {
  modelValue: 'Vue',
  'onUpdate:modelValue': (value: string) => value.toUpperCase(),
}
const boxProps: BoxPublicProps = {
  my: 'xl',
  bg: 'red.5',
  mx: { base: 'xs', md: 24 },
  pos: 'relative',
}

void buttonProps
void autocompleteProps
void boxProps

// @ts-expect-error Box spacing props do not accept booleans.
const invalidBoxProps: BoxPublicProps = { my: true }
void invalidBoxProps

// @ts-expect-error Button variants are a closed public union.
const invalidButtonProps: ButtonProps = { variant: 'not-a-variant' }
void invalidButtonProps
