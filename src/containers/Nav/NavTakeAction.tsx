import Divider from '@material-ui/core/Divider'
import Link from '@material-ui/core/Link'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import EventIcon from '@material-ui/icons/Event'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ForumIcon from '@material-ui/icons/Forum'
import GroupIcon from '@material-ui/icons/Group'
import MicIcon from '@material-ui/icons/Mic'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { openModal } from 'src/components/Modal'
import { useLayoutContext } from 'src/containers/LayoutContext'
import { ModalCharter } from 'src/containers/ModalCharter'
import { ModalEditAction } from 'src/containers/ModalEditAction'
import { ModalEditEvent } from 'src/containers/ModalEditEvent'
import { variants, colors } from 'src/styles'
import { useFirebase } from 'src/utils/hooks'

const MenuContainer = styled.div`
  a {
    text-decoration: none !important;
  }
`

interface IconActionProps {
  description?: string;
  icon: JSX.Element;
  label: string;
  labelColor?: string;
  onClick: MenuItemProps['onClick'];
}

function IconAction(props: IconActionProps) {
  const { icon, label, labelColor, description, onClick } = props

  return (
    <MenuItem onClick={onClick} style={{ whiteSpace: 'normal' }}>
      <ListItemIcon style={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <div>
        <div style={{ color: labelColor }}>
          {label}
        </div>
        {description && (
          <Typography
            component="div"
            style={{ maxWidth: 220 }}
            variant={variants.footNote}
          >
            {description}
          </Typography>
        )}
      </div>
    </MenuItem>
  )
}

interface IconExternalLinkProps {
  icon: JSX.Element;
  label: string;
  link: string;
  onClick?: () => void;
}

function IconExternalLink(props: IconExternalLinkProps) {
  const { icon, label, link, onClick } = props
  return (
    <Link
      href={link}
      onClick={onClick}
      rel="noopener noreferrer"
      style={{
        textDecoration: 'none',
      }}
      target="_blank"
    >
      <MenuItem>
        <ListItemIcon style={{ minWidth: 40 }}>
          {icon}
        </ListItemIcon>
        {label}
      </MenuItem>
    </Link>
  )
}

interface NavTakeActionProps {
  children: JSX.Element;
}

export function NavTakeAction(props: NavTakeActionProps) {
  const { children } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { drawerIsOpen, setDrawerIsOpen } = useLayoutContext()
  const { sendEvent } = useFirebase()

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    sendEvent('View__ActionMenu')
    setAnchorEl(event.currentTarget)
  }

  const closeDrawerIfOpen = useCallback(() => {
    if (drawerIsOpen) {
      setDrawerIsOpen(false)
    }
  }, [drawerIsOpen, setDrawerIsOpen])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openActionModal = useCallback(() => {
    sendEvent('Action__ActionMenu__CreateAction')
    openModal(
      <ModalCharter
        onValidate={() => {
          openModal(<ModalEditAction />)
        }}
      />,
    )
    setAnchorEl(null)
    closeDrawerIfOpen()
  }, [closeDrawerIfOpen, sendEvent])

  const openEventModal = useCallback(() => {
    sendEvent('Action__ActionMenu__CreateEvent')
    openModal(<ModalEditEvent />)
    setAnchorEl(null)
    closeDrawerIfOpen()
  }, [closeDrawerIfOpen, sendEvent])

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
        {children}
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
              description="Demander de l'aide ou proposer un don"
              icon={<RecordVoiceOverIcon />}
              label="Créer une action solidaire"
              labelColor={colors.main.primary}
              onClick={openActionModal}
            />
            <IconAction
              description="Évènement à une date précise: atelier, café de quartier, tournoi sportif..."
              icon={<EventIcon />}
              label="Créer un évènement"
              labelColor={colors.main.primary}
              onClick={openEventModal}
            />
            <Divider />
            <IconExternalLink
              icon={<MicIcon />}
              label="Devenir Ambassadeur Entourage"
              link="https://www.entourage.social/devenir-ambassadeur/"
              onClick={() => sendEvent('Action__ActionMenu__Ambassador')}
            />
            <IconExternalLink
              icon={<ForumIcon />}
              label="Se former à la rencontre"
              link="http://www.simplecommebonjour.org/"
              onClick={() => sendEvent('Action__ActionMenu__Workshop')}
            />
            <IconExternalLink
              icon={<GroupIcon />}
              label="Entourer une personne isolée"
              link="https://entourage-asso.typeform.com/to/OIO0bI"
              onClick={() => sendEvent('Action__ActionMenu__GoodWaves')}
            />
            <IconExternalLink
              icon={<FavoriteIcon />}
              label="Soutenir entourage"
              /* eslint-disable-next-line max-len */
              link="https://entourage.iraiser.eu/effet-entourage/~mon-don?_ga=2.11026804.1529967740.1575371021-1827432881.1572366327"
              onClick={() => sendEvent('Action__ActionMenu__Donate')}
            />
          </Typography>
        </MenuContainer>
      </Menu>
    </>
  )
}
