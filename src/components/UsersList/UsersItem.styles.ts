import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { StarBadge as StarBadgeBase } from 'src/components/StarBadge'
import { colors, variants } from 'src/styles'

export const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
  &:not(:last-child) {
    border-bottom: solid 1px ${colors.borderColor};
  }

  &:hover {
    background-color: #eeeeee;
  }
`

export const OwnerContainer = styled(Typography).attrs(() => ({
  variant: variants.footNote,
}))`
  color: ${colors.main.white} !important;
  background-color: ${colors.main.greyishBrown};
  border-radius: 20px;
  padding: 0px 7px;
`

export const StarBadge = styled(StarBadgeBase).attrs(() => ({
  containerStyle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
}))``

export const ParnerContainer = styled(Typography).attrs(() => ({
  variant: variants.footNote,
}))`
  font-style: italic;
`
