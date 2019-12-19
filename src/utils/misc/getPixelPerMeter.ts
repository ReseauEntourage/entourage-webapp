export function getPixelPerMeter(lat: number, zoom: number) {
  // get from here: https://medium.com/techtrument/how-many-miles-are-in-a-pixel-a0baf4611fff
  const meterPerPixel = 156543.03392 * (Math.cos((lat * Math.PI) / 180) / (2 ** zoom))
  const pixelPerMeter = 1 / meterPerPixel

  return pixelPerMeter
}
