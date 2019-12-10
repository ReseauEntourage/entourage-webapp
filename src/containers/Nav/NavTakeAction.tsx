import Divider from '@material-ui/core/Divider'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import EventIcon from '@material-ui/icons/Event'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ForumIcon from '@material-ui/icons/Forum'
import GroupIcon from '@material-ui/icons/Group'
import MicIcon from '@material-ui/icons/Mic'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { openModal } from 'src/components/Modal'
import { ModalCharte } from 'src/containers/ModalCharte'
import { ModalCreateAction } from 'src/containers/ModalCreateAction'
import { texts } from 'src/i18n'
import { variants } from 'src/styles'

const MenuContainer = styled.div`
  a {
    text-decoration: none !important;
  }
`

interface IconActionProps {
  icon: JSX.Element;
  label: string;
  onClick: MenuItemProps['onClick'];
}

function IconAction(props: IconActionProps) {
  const { icon, label, onClick } = props

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon style={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      {label}
    </MenuItem>
  )
}

interface IconExternalLinkProps {
  icon: JSX.Element;
  label: string;
  link: string;
}

function IconExternalLink(props: IconExternalLinkProps) {
  const { icon, label, link } = props
  return (
    <a href={link} rel="noopener noreferrer" target="_blank">
      <MenuItem>
        <ListItemIcon style={{ minWidth: 40 }}>
          {icon}
        </ListItemIcon>
        {label}
      </MenuItem>
    </a>
  )
}

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
        <AddCircleIcon color="primary" style={{ fontSize: 30, marginRight: 10 }} />
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
        <MenuContainer>
          <Typography component="div" variant={variants.bodyRegular}>
            <IconAction
              icon={<RecordVoiceOverIcon />}
              label="Créer une action solidaire"
              onClick={openActionModal}
            />
            <IconAction
              icon={<EventIcon />}
              label="Créer un évènement"
              onClick={openEventModal}
            />
            <Divider />
            <IconExternalLink
              icon={<MicIcon />}
              label="Devenir ambassadeur entourage"
              link="https://www.entourage.social/devenir-ambassadeur/"
            />
            <IconExternalLink
              icon={<ForumIcon />}
              label="Se former à la rencontre"
              link="http://www.simplecommebonjour.org/"
            />
            <IconExternalLink
              icon={<GroupIcon />}
              label="Participer à nos évènements"
              link="https://www.facebook.com/pg/EntourageReseauCivique/events/?ref=page_internal"
            />
            <IconExternalLink
              icon={<FavoriteIcon />}
              label="Soutenir entourage"
              // eslint-disable-next-line
              link="https://entourage.iraiser.eu/effet-entourage/~mon-don?_ga=2.11026804.1529967740.1575371021-1827432881.1572366327"
            />
          </Typography>
        </MenuContainer>
      </Menu>
    </>
  )
}
