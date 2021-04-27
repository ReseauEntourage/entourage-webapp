import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commonActions } from 'src/core/useCases/common'
import { locationActions, selectLocation } from 'src/core/useCases/location'

export const useRefreshData = () => {
  const location = useSelector(selectLocation)
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(commonActions.fetchData())
    dispatch(locationActions.setLocation({
      location,
      getDisplayAddressFromCoordinates: true,
    }))
    dispatch(locationActions.setMapHasMoved(false))
  }, [dispatch, location])
}
