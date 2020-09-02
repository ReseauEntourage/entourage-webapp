import React from 'react'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { useOnLogin } from 'src/core/events'
import { useQueryGetUserInfosAreIncompleted } from 'src/core/store'

export function useOpenModalProfileOnLogin() {
  const getUserInfosAreIncompleted = useQueryGetUserInfosAreIncompleted()

  useOnLogin(() => {
    if (getUserInfosAreIncompleted()) {
      openModal(<ModalProfile />)
    }
  })
}
