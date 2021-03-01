import React from 'react'
import { useSelector } from 'react-redux'
import { ModalSensitization } from '../ModalSensitization'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { useOnLoginCompleted, useOnSensitizationPopupHidden } from 'src/core/events'
import {
  selectIsLogged,
  selectShowSensitizationPopup,
  selectUserInfosAreIncomplete,
} from 'src/core/useCases/authUser'

export function useOpenModalsOnLogin() {
  const isLogged = useSelector(selectIsLogged)
  const userInfosAreIncompleted = useSelector(selectUserInfosAreIncomplete)
  const showSensitizationPopup = useSelector(selectShowSensitizationPopup)

  // TODO when react-query removed: change order to show ProfileModal first
  useOnLoginCompleted(() => {
    if (isLogged) {
      if (showSensitizationPopup) {
        openModal(<ModalSensitization />)
      } else if (userInfosAreIncompleted) {
        openModal(<ModalProfile />)
      }
    }
  })

  // TODO when react-query removed: subscribe to the updated profile event
  useOnSensitizationPopupHidden(() => {
    if (isLogged && userInfosAreIncompleted) {
      openModal(<ModalProfile />)
    }
  })
}
