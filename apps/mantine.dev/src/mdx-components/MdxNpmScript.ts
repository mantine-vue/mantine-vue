import { defineComponent, h } from 'vue'
import { Group, Tabs } from '@mantine-vue/core'
import { useLocalStorage } from '@mantine-vue/hooks'
import { MdxCodeHighlight } from './MdxPre'
import { NpmIcon } from './icons/NpmIcon'
import { YarnIcon } from './icons/YarnIcon'
import classes from './MdxNpmScript.module.css'

export const MdxNpmScript = defineComponent({
  name: 'MdxNpmScript',
  props: {
    yarnScript: { type: String, required: true },
    npmScript: { type: String, required: true },
  },
  setup(props) {
    const [tab, setTab] = useLocalStorage<string>({
      key: 'script-tab-value',
      defaultValue: 'yarn',
    })

    return () =>
      h(
        Tabs,
        {
          value: tab.value,
          onChange: (value: string | null) => setTab(value!),
          variant: 'pills',
          classNames: classes,
        },
        {
          default: () => [
            h(Tabs.List, null, () => [
              h(Tabs.Tab, { value: 'yarn' }, () =>
                h(Group, { gap: 5 }, () => [
                  h(YarnIcon, { class: classes.icon, size: 16 }),
                  h('span', null, 'yarn'),
                ]),
              ),
              h(Tabs.Tab, { value: 'npm' }, () =>
                h(Group, { gap: 5 }, () => [
                  h(NpmIcon, { class: classes.icon, size: 16 }),
                  h('span', null, 'npm'),
                ]),
              ),
            ]),
            h(Tabs.Panel, { value: 'yarn' }, () =>
              h(MdxCodeHighlight, {
                class: classes.code,
                code: props.yarnScript,
                language: 'bash',
                'data-without-radius': true,
              }),
            ),
            h(Tabs.Panel, { value: 'npm' }, () =>
              h(MdxCodeHighlight, { class: classes.code, code: props.npmScript, language: 'bash' }),
            ),
          ],
        },
      )
  },
})
