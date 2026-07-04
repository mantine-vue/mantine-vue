import { defineComponent, h, type PropType } from 'vue'
import { CodeHighlightControl } from '../CodeHighlightControl/CodeHighlightControl'
import { ExpandIcon } from './ExpandIcon'

export const ExpandCodeButton = defineComponent({
  name: 'ExpandCodeButton',
  props: {
    expanded: { type: Boolean, required: true },
    onExpand: { type: Function as PropType<(value: boolean) => void>, required: true },
    collapseCodeLabel: { type: String, default: 'Collapse code' },
    expandCodeLabel: { type: String, default: 'Expand code' },
  },
  setup(props) {
    return () =>
      h(
        CodeHighlightControl,
        {
          onClick: () => props.onExpand(!props.expanded),
          tooltipLabel: props.expanded ? props.collapseCodeLabel : props.expandCodeLabel,
          'aria-label': props.expanded ? props.collapseCodeLabel : props.expandCodeLabel,
        },
        () => h(ExpandIcon, { expanded: props.expanded }),
      )
  },
})
