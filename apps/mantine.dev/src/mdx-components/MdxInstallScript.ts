import { defineComponent, h } from 'vue'
import { MdxNpmScript } from './MdxNpmScript'

export const MdxInstallScript = defineComponent({
  name: 'MdxInstallScript',
  props: {
    packages: { type: String, required: true },
    dev: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h(MdxNpmScript, {
        yarnScript: `yarn add ${props.dev ? '--dev ' : ''}${props.packages}`,
        npmScript: `npm install ${props.dev ? '--save-dev ' : ''}${props.packages}`,
      })
  },
})
