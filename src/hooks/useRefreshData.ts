import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { locationActions, selectMapPosition } from 'src/core/useCases/location'

export const useRefreshData = () => {
  const mapPosition = useSelector(selectMapPosition)
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(locationActions.setLocation({
      location: mapPosition,
      getDisplayAddressFromCoordinates: true,
    }))
  }, [dispatch, mapPosition])
}
