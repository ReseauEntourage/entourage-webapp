import React from 'react'
import { openModal } from 'src/components/Modal'
import { ModalProfile } from 'src/containers/ModalProfile'
import { useOnLogin } from 'src/core/events'

export function useOpenModalProfileOnLogin() {
  useOnLogin((meResponse) => {
    const { firstName, lastName, address, hasPassword } = meResponse.data.user
    const userInfosIncompleted = !firstName || !lastName || !address

    if (hasPassword && userInfosIncompleted) {
      openModal(<ModalProfile />)
    }
  })
}
