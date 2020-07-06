import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useCallback } from 'react'
import { Avatar } from 'src/components/Avatar'
import { openModal } from 'src/components/Modal'
import { constants } from 'src/constants'
import { ModalProfile } from 'src/containers/ModalProfile'
import { useQueryMe } from 'src/core/store'
import { texts } from 'src/i18n'
import { useOnClickLogout } from './useOnClickLogout'

export function LoggedChunk() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const me = useQueryMe()
  const iAmAssoAdmin = me.data?.data.user.partnerAdmin

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

  const openAdminAsso = useCallback(() => {
    window.open(constants.ADMIN_ASSO_LINK, '_blank')
  }, [])

  const onClickLogout = useOnClickLogout()
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
        <Avatar src={me.data?.data?.user.avatarUrl} />
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
          {texts.nav.profile}
        </MenuItem>
        {iAmAssoAdmin && (
          <MenuItem onClick={openAdminAsso}>
            {texts.nav.adminAsso}
          </MenuItem>
        )}
        <MenuItem onClick={onClickLogout}>
          {texts.nav.logout}
        </MenuItem>
      </Menu>
    </>
  )
}
