import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { colors, variants, theme } from 'src/styles'

export const Container = styled.div<{ isActive: boolean; }>`
  display: flex;
  padding: ${theme.spacing(3, 2)};
  align-items: center;
  background-color: ${(props) => props.isActive && colors.main.greyLight};
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const Picture = styled.div`
  margin-right: ${theme.spacing(1)}px;
`

export const Texts = styled.div`
  overflow: hidden;
  text-align: left;
`

export const Title = styled(Typography).attrs(() => ({
  variant: variants.title1,
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
