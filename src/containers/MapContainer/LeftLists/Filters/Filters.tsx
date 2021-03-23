import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { variants } from 'src/styles'
import * as S from './Filters.styles'

interface FiltersProps {
  filters?: JSX.Element;
}

export function Filters(props: FiltersProps) {
  const { filters } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <S.FilterListButton
        aria-controls="simple-menu"
        onClick={handleClick}
        onKeyUp={handleClick}
        role="button"
        tabIndex={0}
      >
        <S.FilterListIcon />
      </S.FilterListButton>
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
        <S.MenuContainer>
          <Typography component="div" variant={variants.bodyRegular}>
            {filters}
          </Typography>
        </S.MenuContainer>
      </Menu>
    </>
  )
}
