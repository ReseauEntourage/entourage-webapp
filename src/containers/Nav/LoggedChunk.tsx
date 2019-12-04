import React, { useCallback } from 'react'
import { refetchQuery } from 'react-query'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { queryKeys } from 'src/network/queries'
import { openModal } from 'src/components/Modal'
import { setTokenIntoCookies, createAnonymousUser } from 'src/network/services'
import { ProfileModal } from './ProfileModal'

interface LoggedChunkProps {}

export function LoggedChunk(/* props: LoggedChunkProps */) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openProfileModal = useCallback(() => {
    openModal(<ProfileModal />)
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
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyUp={handleClick}
        style={{
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <AccountCircleIcon color="secondary" fontSize="large" />
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={openProfileModal}>
          Mon Profil
        </MenuItem>
        <MenuItem onClick={logout}>
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  )
}
