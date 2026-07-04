import { h } from 'vue'
import {
  PhArrowsLeftRight,
  PhChatCircle,
  PhGearSix,
  PhImage,
  PhMagnifyingGlass,
  PhTrash,
} from '@phosphor-icons/vue'
import { Button, Menu, Text } from '@mantine-vue/core'

export function DemoMenuItems({
  withRightSection = true,
  withTarget = true,
}: { withRightSection?: boolean; withTarget?: boolean } = {}) {
  return [
    withTarget && h(Menu.Target, null, { default: () => h(Button, null, () => 'Toggle menu') }),
    h(Menu.Dropdown, null, {
      default: () => [
        h(Menu.Label, null, () => 'Application'),
        h(Menu.Item, { leftSection: h(PhGearSix, { size: 14 }) }, () => 'Settings'),
        h(Menu.Item, { leftSection: h(PhChatCircle, { size: 14 }) }, () => 'Messages'),
        h(Menu.Item, { leftSection: h(PhImage, { size: 14 }) }, () => 'Gallery'),
        withRightSection &&
          h(
            Menu.Item,
            {
              leftSection: h(PhMagnifyingGlass, { size: 14 }),
              rightSection: h(Text, { size: 'xs', c: 'dimmed' }, () => '⌘K'),
            },
            () => 'Search',
          ),
        h(Menu.Divider),
        h(Menu.Label, null, () => 'Danger zone'),
        h(Menu.Item, { leftSection: h(PhArrowsLeftRight, { size: 14 }) }, () => 'Transfer my data'),
        h(
          Menu.Item,
          { color: 'red', leftSection: h(PhTrash, { size: 14 }) },
          () => 'Delete my account',
        ),
      ],
    }),
  ]
}
