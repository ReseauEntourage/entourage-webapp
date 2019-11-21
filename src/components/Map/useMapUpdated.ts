// @ts-ignore
// NOT CURRENTLY USED

// import { usePrevious } from 'src/hooks'
// import { useMapContext } from './context'

// export function useMapUpdated() {
//   const currentMapContext = useMapContext()
//   const prevMapContext = usePrevious(currentMapContext)

//   const currentValue = currentMapContext.value
//   const prevValue = prevMapContext && prevMapContext.value

//   if (!prevValue) {
//     return false
//   }

//   const zoomChanged = prevValue.zoom !== currentValue.zoom
//   const latChanged = prevValue.center.lat !== currentValue.center.lat
//   const lngChanged = prevValue.center.lng !== currentValue.center.lng

//   return zoomChanged || latChanged || lngChanged
// }
