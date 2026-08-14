import { h, ref } from 'vue'
import {
  Checkbox,
  Drawer,
  FloatingWindow,
  Grid,
  Group,
  Input,
  InputBase,
  Modal,
  PinInput,
  Radio,
  SimpleGrid,
  Switch,
  Tabs,
} from '@mantine-vue/core'
import type {
  CheckboxFactory,
  ComponentProps,
  DrawerFactory,
  GridColFactory,
  GridFactory,
  GroupFactory,
  InputBaseFactory,
  InputFactory,
  ModalFactory,
  PinInputFactory,
  RadioFactory,
  SimpleGridFactory,
  SwitchFactory,
} from '@mantine-vue/core'

type IsAny<T> = 0 extends 1 & T ? true : false
type NotAny<T> = IsAny<T> extends false ? true : false
type NotEmpty<T> = keyof T extends never ? false : true

const factoriesAreNotAny: [
  NotAny<CheckboxFactory>,
  NotAny<RadioFactory>,
  NotAny<SwitchFactory>,
  NotAny<GridFactory>,
  NotAny<GridColFactory>,
  NotAny<SimpleGridFactory>,
  NotAny<PinInputFactory>,
  NotAny<DrawerFactory>,
  NotAny<ModalFactory>,
  NotAny<GroupFactory>,
  NotAny<InputFactory>,
  NotAny<InputBaseFactory>,
] = [true, true, true, true, true, true, true, true, true, true, true, true]

const propsAreNotAny: [
  NotAny<InstanceType<typeof Checkbox>['$props']>,
  NotAny<InstanceType<typeof Grid>['$props']>,
  NotAny<InstanceType<typeof PinInput>['$props']>,
  NotAny<InstanceType<typeof Drawer>['$props']>,
] = [true, true, true, true]

const propsAreNotEmpty: [
  NotEmpty<InstanceType<typeof Checkbox>['$props']>,
  NotEmpty<InstanceType<typeof Grid>['$props']>,
  NotEmpty<InstanceType<typeof PinInput>['$props']>,
  NotEmpty<InstanceType<typeof Drawer>['$props']>,
] = [true, true, true, true]

const stackRef = ref<HTMLDivElement | null>(null)
const checkboxRootRef = h(Checkbox, { rootRef: stackRef })
const gridRootRef = h(Grid, { rootRef: (node: Element | null) => void node })

// Declared props preserve negative checks that `h()` inference can widen.
type CheckboxProps = InstanceType<typeof Checkbox>['$props']
type GridProps = InstanceType<typeof Grid>['$props']

// @ts-expect-error rootRef is typed against the root element, not an arbitrary string.
const badRootRef: CheckboxProps = { rootRef: 'nope' }

const checkboxClassNames = h(Checkbox, { classNames: { root: 'a', input: 'b', icon: 'c' } })
const switchClassNames = h(Switch, { classNames: { root: 'a', track: 'b', thumb: 'c' } })
const gridStyles = h(Grid, { styles: { root: { display: 'grid' }, inner: { gap: 4 } } })

// @ts-expect-error `track` is a Switch style name, not a Checkbox one.
const badCheckboxClassName: CheckboxProps = { classNames: { track: 'a' } }
const gridColClassName: GridProps = { classNames: { col: 'a' } }
// @ts-expect-error `track` is not one of Grid's style names.
const badGridClassName: GridProps = { classNames: { track: 'a' } }

const groupWithProps = Group.withProps({ gap: 'xl' })
const groupChained = groupWithProps.withProps({ justify: 'center' })
const groupRootRef = h(Group, { rootRef: (node: Element | null) => void node })

type InputProps = ComponentProps<typeof Input>
type InputAsTextarea = ComponentProps<typeof Input, 'textarea'>

const inputDefault: InputProps = { size: 'sm', placeholder: 'Type', variant: 'filled' }
const inputAsTextarea: InputAsTextarea = { component: 'textarea', rows: 4 }
const inputRefIsTheField: InputProps = {
  rootRef: (node: Element | null) => void (node as HTMLInputElement | null)?.focus(),
}
const inputBaseDefault: ComponentProps<typeof InputBase> = { label: 'Name', error: 'Required' }

// @ts-expect-error `rows` belongs to textarea, not to the default `input` root.
const badInputRows: InputProps = { rows: 4 }
// @ts-expect-error `unstyled` is a real prop; `unstyledd` is not.
const badInputProp: InputProps = { unstyledd: true }

const dataAttributes: CheckboxProps = { 'data-testid': 'a', 'data-state': 'checked' }
const polymorphicDataAttributes: InputProps = { 'data-autofocus': true }

// @ts-expect-error `datax-` is not the `data-` prefix.
const badDataAttribute: CheckboxProps = { 'datax-testid': 'a' }

const checkboxGroup = Checkbox.Group
const checkboxIndicator = Checkbox.Indicator
const checkboxCard = Checkbox.Card
const radioGroup = Radio.Group
const switchGroup = Switch.Group
const gridCol = Grid.Col
const drawerRoot = Drawer.Root
const drawerStack = Drawer.Stack
const modalContent = Modal.Content

// @ts-expect-error Switch declares only a `Group` static.
const badSwitchStatic = Switch.Indicator
// @ts-expect-error SimpleGrid declares no statics at all.
const badSimpleGridStatic = SimpleGrid.Col

const varsAsResolver: CheckboxProps = {
  vars: () => ({ root: { '--checkbox-size': '2rem', '--checkbox-icon-size': '1rem' } }),
}

// @ts-expect-error `--nope` is not one of Checkbox's declared CSS variables.
const badVarName: CheckboxProps = { vars: () => ({ root: { '--nope': '1px' } }) }
// @ts-expect-error a record is not accepted; `vars` takes a resolver.
const badVarRecord: CheckboxProps = { vars: { root: { '--checkbox-size': '2rem' } } }

const checkboxVars = Checkbox.varsResolver
const gridVars = Grid.varsResolver
const pinInputVars = PinInput.varsResolver

// @ts-expect-error SimpleGrid declares no `vars`, so it has no resolver.
const badSimpleGridVars = SimpleGrid.varsResolver

const checkboxEmits = h(Checkbox, {
  'onUpdate:modelValue': (checked: boolean) => void checked,
  onChange: (checked: boolean) => void checked,
})
const pinInputEmits = h(PinInput, {
  'onUpdate:modelValue': (value: string) => value.toUpperCase(),
  onComplete: (value: string) => value.toUpperCase(),
})
const drawerEmits = h(Drawer, { opened: true, onClose: () => undefined })

// Non-polymorphic factory components use Vue's standard public-instance constructor, so
// `h()` contextually types native attributes, styles and slots without component assertions.
const tabsListVNode = h(
  Tabs.List,
  { style: { position: 'relative', marginBottom: '1rem' } },
  { default: () => [] },
)
const resizeHandleVNode = h(
  FloatingWindow.ResizeHandle,
  { 'aria-label': 'Resize floating window', style: { position: 'absolute', right: 0 } },
  { default: () => [] },
)

type PinInputProps = InstanceType<typeof PinInput>['$props']

// @ts-expect-error PinInput's `complete` carries a string, not a boolean.
const badPinInputEmit: PinInputProps = { onComplete: (value: boolean) => void value }

export {
  badCheckboxClassName,
  badDataAttribute,
  badInputProp,
  badInputRows,
  badVarName,
  badVarRecord,
  dataAttributes,
  varsAsResolver,
  groupChained,
  groupRootRef,
  groupWithProps,
  inputAsTextarea,
  inputBaseDefault,
  inputDefault,
  inputRefIsTheField,
  polymorphicDataAttributes,
  badGridClassName,
  badPinInputEmit,
  badRootRef,
  badSimpleGridStatic,
  badSimpleGridVars,
  badSwitchStatic,
  checkboxCard,
  checkboxClassNames,
  checkboxEmits,
  checkboxGroup,
  checkboxIndicator,
  checkboxRootRef,
  checkboxVars,
  drawerEmits,
  drawerRoot,
  drawerStack,
  factoriesAreNotAny,
  gridCol,
  gridColClassName,
  gridRootRef,
  gridStyles,
  gridVars,
  modalContent,
  pinInputEmits,
  pinInputVars,
  propsAreNotAny,
  propsAreNotEmpty,
  radioGroup,
  switchClassNames,
  switchGroup,
  tabsListVNode,
  resizeHandleVNode,
}
