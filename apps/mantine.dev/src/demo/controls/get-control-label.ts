function upperFirst(value: string) {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`
}

export function getControlLabel(label: string) {
  return upperFirst(label.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase())
}
