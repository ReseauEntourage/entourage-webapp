import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { colors, variants } from 'src/styles'
import { theme } from 'src/styles/theme'

export const Container = styled.div<{ isActive: boolean; }>`
  display: flex;
  padding: ${theme.spacing(1)}px;
  align-items: center;
  border-bottom: solid 1px ${colors.borderColor};
  background-color: ${(props) => props.isActive && colors.main.greyLight};
`

export const Picture = styled.div`
  margin-right: ${theme.spacing(1)}px;
`

export const Texts = styled.div`
  overflow: hidden;
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title2,
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const Excerpt = styled(Typography).attrs(() => ({
  variant: variants.footNote,
  component: 'div',
}))`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
