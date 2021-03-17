import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { variants } from 'src/styles'
import { FilterEntourageType } from 'src/utils/types'
import * as S from './FeedFiltersSelector.styles'
import { SectionFilter } from './SectionFilter/SectionFilter'

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
            <SectionFilter type={FilterEntourageType.ASK_FOR_HELP} />
            <Divider />
            <SectionFilter type={FilterEntourageType.CONTRIBUTION} />
          </Typography>
        </S.MenuContainer>
      </Menu>
    </>
  )
}
