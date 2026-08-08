/**
 * Converts the small subset of markdown used in JSDoc comments and Styles API
 * descriptions into HTML.
 */
export function replaceMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/!important!/g, '<b>Important</b>')
    .replace(/@deprecated/g, '<i>Deprecated:</i>')
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (_, list: string) => {
      const items = list.replace(/(?:^|\n)- (.+)/g, '<li>$1</li>')
      return `<ul>${items}</ul>`
    })
}
