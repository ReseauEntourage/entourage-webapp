import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DTOCreateEntourageAsAction, DTOCreateEntourageAsEvent, DTOUpdateEntourageAsAction,
  DTOUpdateEntourageAsEvent } from 'src/core/api'
import { selectIsUpdatingItems, feedActions } from 'src/core/useCases/feed'
import { usePrevious } from 'src/utils/hooks'

export function useCreateOrUpdateEntourage() {
  const dispatch = useDispatch()
  const isUpdatingItems = useSelector(selectIsUpdatingItems)
  const wasUpdatingItems = usePrevious(isUpdatingItems)
  const hasBeenUpdated = useMemo(() => wasUpdatingItems && !isUpdatingItems, [wasUpdatingItems, isUpdatingItems])
  const router = useRouter()

  const onCreateSucceeded = useCallback((entourageUuid: string) => {
    router.push('/actions/[actionId]', `/actions/${entourageUuid}`)
  }, [router])

  const createEntourage = useCallback((entourage: DTOCreateEntourageAsAction | DTOCreateEntourageAsEvent) => {
    dispatch(feedActions.createEntourage({ entourage, onCreateSucceeded }))
  }, [dispatch, onCreateSucceeded])

  const updateEntourage = useCallback((entourageUuid: string,
    entourage: DTOUpdateEntourageAsAction | DTOUpdateEntourageAsEvent) => {
    dispatch(feedActions.updateEntourage({ entourageUuid, entourage }))
  }, [dispatch])

  return { createEntourage, updateEntourage, hasBeenUpdated, isUpdating: isUpdatingItems }
}
