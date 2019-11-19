export function getId(data: { id: number; uuid: string; }): string {
  return String(data.uuid || data.id)
}
