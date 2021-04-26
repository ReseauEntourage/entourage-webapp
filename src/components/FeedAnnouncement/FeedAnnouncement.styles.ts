import { Avatar } from '@material-ui/core/'
import styled from 'styled-components'
import { colors, theme } from 'src/styles'

export const Icon = styled(Avatar)`
  width: 14px !important;
  height: 14px !important;
  padding: 4px !important;
  background-color: ${colors.main.greyishBrown};
`

export const Image = styled.div<{ img: string; }>`
  padding-top: 0 !important;
`

export const Container = styled.div`
  flex: 1;
  display: flex;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(2)}px;
  padding: ${theme.spacing(2, 2, 1, 2)};
  border-left: solid 5px transparent;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  border-left: solid 5px transparent;
  padding: ${theme.spacing(0, 2, 1, 2)};
`

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(1, 0)};
`

export const AnnouncementImage = styled.img`
 width: 100%;
  display: flex;
`
