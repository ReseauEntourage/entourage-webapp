import Divider from '@material-ui/core/Divider'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import { ToggleOnOutlined } from '@material-ui/icons'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ForumIcon from '@material-ui/icons/Forum'
import FreeBreakfastOutlinedIcon from '@material-ui/icons/FreeBreakfastOutlined';
import GroupIcon from '@material-ui/icons/Group'
import MicIcon from '@material-ui/icons/Mic'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { variants, theme } from 'src/styles'
// import * as S from './FeedFilyersSelector.styles'

const MenuContainer = styled.div`
  a {
    text-decoration: none !important;
  }
`

interface IconExternalLinkProps {
  icon: JSX.Element;
  label: string;
}

function IconExternalLink(props: IconExternalLinkProps) {
  const { icon, label } = props
  return (
    <MenuItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      {label}
      <ToggleOnOutlined />
    </MenuItem>
  )
}

interface SwitchFilterProps {
  icon: JSX.Element;
  label: string;
  checked: boolean;
  onChange: () => void;
}

interface LineFilterProps {
  index: number
  icon: JSX.Element;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Container = styled.div`
  padding-left: ${theme.spacing(1)}px;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: ${theme.spacing(0, 1)};
  grid-template-areas:
    'title title switch'
    'icon label switch'
    'icon label switch'
    'icon label switch';
  align-items: center;
  // justify-items: center;
`


interface ElementProps {
  index: number
}

export const Icon = styled.div<ElementProps>`
  grid-area: icon;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const Label = styled.div<ElementProps>`
  grid-area: label;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

export const SSwitch = styled.div<ElementProps>`
  grid-area: switch;
  ${({ index }) => `
    grid-row: ${index + 1} / ${index + 2};
  `}
`

function SwitchFilter(props: SwitchFilterProps) {
  const { icon, label, onChange } = props
  const [checked, setChecked] = useState(false);
  const toggle = () => setChecked(value => !value)

  return (
    <Container>
      <SectionFilter
        index={0}
        checked={checked}
        label="Devenir Ambassadeur Entourage"
        onChange={toggle}
      />
      <LineFilter
        index={1}
        checked={checked}
        icon={<FreeBreakfastOutlinedIcon color="primary"/>}
        label="Devenir Ambassadeur Entourage"
        onChange={toggle}
      />
      <LineFilter
        index={2}
        checked={checked}
        icon={<MicIcon />}
        label="Devenir Ambassadeur Entourage"
        onChange={toggle}
      />
      <LineFilter
        index={3}
        checked={checked}
        icon={<MicIcon />}
        label="Devenir Ambassadeur Entourage"
        onChange={toggle}
      />
    </Container>
  )
}

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  grid-area: title;
`

function SectionFilter(props: Omit<LineFilterProps, 'icon'>) {
  const { index, label, checked, onChange } = props

  return (
    <>
      <Title>{label}</Title>
      <SSwitch index={index}><Switch checked={checked} onChange={onChange} /></SSwitch>
    </>
  )
}

function LineFilter(props: LineFilterProps) {
  const { index, icon, label, checked, onChange } = props

  return (
    <>
      <Icon index={index}>{icon}</Icon>
      <Label index={index}>{label}</Label>
      <SSwitch index={index}><Switch checked={checked} onChange={onChange} color={"primary"}/></SSwitch>
    </>
  )
}

export function FeedFiltersSelector() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
          padding: theme.spacing(2, 2, 2, 0),
        }}
        tabIndex={0}
      >
        <Button>Filters</Button>
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
          horizontal: 'right',
        }}
      >
        <MenuContainer>
          <Typography component="div" variant={variants.bodyRegular}>
            <Divider />
            <SwitchFilter
              checked={true}
              icon={<MicIcon />}
              label="Devenir Ambassadeur Entourage"
              onChange={() => null}
            />
            <IconExternalLink
              icon={<ForumIcon />}
              label="Se former à la rencontre"
            />
            <IconExternalLink
              icon={<GroupIcon />}
              label="Entourer une personne isolée"
            />
            <IconExternalLink
              icon={<FavoriteIcon />}
              label="Soutenir entourage"
              // eslint-disable-next-line
            />
          </Typography>
        </MenuContainer>
      </Menu>
    </>
  )
}
