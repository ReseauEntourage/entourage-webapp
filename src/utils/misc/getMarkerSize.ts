export function getMarkerSize(zoom: number): number {
  if (zoom < 12) {
    return 16
  }
  if (zoom >= 12 && zoom < 15) {
    return 24
  }
  return 32
}
