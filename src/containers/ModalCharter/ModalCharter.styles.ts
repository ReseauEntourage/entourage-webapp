import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, theme, devices } from 'src/styles'

export const CharteItem = styled.div`
  display: grid;
  grid-template-areas:
    "CharItemIcon CharItemTitle"
    "CharItemIcon CharItemContent";
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  margin: ${theme.spacing(3, 0)};

  @media ${devices.mobile} {
    margin: ${theme.spacing(2, 0)};
  }
`

export const CharItemIcon = styled.div`
  grid-area: CharItemIcon;
  display: flex;
  align-items: center;
  margin: ${theme.spacing(0, 3)};

  @media ${devices.mobile} {
    margin: ${theme.spacing(0, 2)};
  }
`

export const CharItemTitle = styled(Typography).attrs(() => ({
  variant: variants.title1,
}))`
  grid-area: CharItemTitle;
  text-transform: uppercase;
`

export const CharItemContent = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
}))`
  grid-area: CharItemContent;
`

export const CharterLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${theme.spacing(4, 0)};
`
