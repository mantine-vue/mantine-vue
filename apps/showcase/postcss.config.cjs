module.exports = {
  plugins: {
    'postcss-preset-mantine': {
      autoRem: true,
    },
    'postcss-simple-vars': {
      variables: {
        mantineBreakpointXs: '36em',
        mantineBreakpointSm: '48em',
        mantineBreakpointMd: '62em',
        mantineBreakpointLg: '75em',
        mantineBreakpointXl: '88em',
      },
    },
  },
}
