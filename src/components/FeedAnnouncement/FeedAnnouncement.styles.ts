import { Avatar } from '@material-ui/core/'
import styled from 'styled-components'
import { colors, theme } from 'src/styles'

export const Icon = styled(Avatar)`
  width: 16px !important;
  height: 16px !important;
  padding: 6px !important;
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
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(0, 2, 2, 2)};
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
