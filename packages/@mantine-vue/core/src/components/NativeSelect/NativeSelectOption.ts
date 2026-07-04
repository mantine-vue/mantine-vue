import { defineComponent, h, type PropType, type VNode } from 'vue'
import type {
  NativeSelectParsedItem,
  NativeSelectParsedItemGroup,
  NativeSelectPrimitive,
} from './get-parsed-data/get-parsed-data'

export type NativeSelectOptionData<Value extends NativeSelectPrimitive = string> =
  | NativeSelectParsedItem<Value>
  | NativeSelectParsedItemGroup<Value>

function isGroup<Value extends NativeSelectPrimitive>(
  input: NativeSelectOptionData<Value>,
): input is NativeSelectParsedItemGroup<Value> {
  return 'group' in input
}

export function renderNativeSelectOption<Value extends NativeSelectPrimitive>(
  data: NativeSelectOptionData<Value>,
): VNode {
  if (isGroup(data)) {
    return h(
      'optgroup',
      { label: data.group },
      data.items.map((item) => renderNativeSelectOption(item)),
    )
  }

  const { value, label, ...others } = data

  return h('option', { ...others, value }, label)
}

export const NativeSelectOption = defineComponent({
  name: 'NativeSelectOption',
  props: {
    data: { type: Object as PropType<NativeSelectOptionData>, required: true },
  },
  setup(props) {
    return () => renderNativeSelectOption(props.data)
  },
})
