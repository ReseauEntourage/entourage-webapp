export function toCamelCase(str: string): string {
  return str.toLowerCase()
    .replace(/(__)|(-–)/g,
      (group) => group.replace('--', '-')
        .replace('__', '_')).replace(/([-_][a-z])/g,
      (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', ''))
}
