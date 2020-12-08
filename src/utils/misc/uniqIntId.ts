let index = 0

export function uniqIntId() {
  index += 1
  const now = Date.now()
  const output = now + index

  return output
}
