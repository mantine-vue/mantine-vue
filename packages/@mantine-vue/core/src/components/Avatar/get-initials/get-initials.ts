export function getInitials(name: string, limit = 2) {
  const parts = name.split(' ')

  if (parts.length === 1) {
    return name.slice(0, limit).toUpperCase()
  }

  return parts
    .map((part) => part[0])
    .slice(0, limit)
    .join('')
    .toUpperCase()
}
