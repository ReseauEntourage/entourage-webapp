import React, { useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { openModal } from 'src/components/Modal'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'
import { ModalCreateAction } from 'src/containers/ModalCreateAction'
import { ModalCharte } from 'src/containers/ModalCharte'

export function NavTakeAction() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openActionModal = useCallback(() => {
    openModal(
      <ModalCharte
        onValidate={() => {
          openModal(<ModalCreateAction />)
        }}
      />,
    )
    setAnchorEl(null)
  }, [])

  const openEventModal = useCallback(() => {
    // openModal(<ProfileModal />)
    setAnchorEl(null)
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
        {texts.nav.takeAction}
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
        <Typography variant={variants.bodyRegular}>
          <MenuItem onClick={openActionModal}>
            Créer une action solidaire
          </MenuItem>
          <MenuItem onClick={openEventModal}>
            Créer un évènement
          </MenuItem>
        </Typography>
      </Menu>
    </>
  )
}
