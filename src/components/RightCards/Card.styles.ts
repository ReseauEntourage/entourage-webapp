import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { variants, colors, theme } from 'src/styles'

export const Description = styled(Typography).attrs(() => ({
  variant: variants.bodyRegular,
}))`
  white-space: pre-line;
  a {
    color: ${colors.main.primary};
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const HorizontalContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${theme.spacing(2)}px;
`

export const SoliguideCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(2)}px;
  border: 1px ${colors.main.primary} solid;
`

export const SoliguideLogo = styled.img`
  width: 100%;
`
