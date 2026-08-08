import { withBoxProps } from '../../core'
import StackComponent from './Stack.vue'

export const Stack = withBoxProps(StackComponent)

export type { StackOwnProps, StackProps } from './Stack.types'
