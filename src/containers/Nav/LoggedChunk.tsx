import React, { useCallback } from 'react'
import { refetchQuery } from 'react-query'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { queryKeys } from 'src/network/queries'
import { openModal } from 'src/components/Modal'
import { setTokenIntoCookies, createAnonymousUser } from 'src/network/services'
import { ModalProfile } from 'src/containers/ModalProfile'

interface LoggedChunkProps {}

export function LoggedChunk(/* props: LoggedChunkProps */) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openModalProfile = useCallback(() => {
    openModal(<ModalProfile />)
    setAnchorEl(null)
  }, [])

  const logout = useCallback(async () => {
    setTokenIntoCookies('')
    await createAnonymousUser()
    refetchQuery(queryKeys.me, { force: true })
  }, [])

  return (
    <>
      <div
        aria-controls="simple-menu"
        onClick={handleClick}
        onKeyUp={handleClick}
        role="button"
        style={{
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        tabIndex={0}
      >
        <AccountCircleIcon color="secondary" fontSize="large" />
      </div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
        id="simple-menu"
        keepMounted={true}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={openModalProfile}>
          Mon Profil
        </MenuItem>
        <MenuItem onClick={logout}>
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  )
}
