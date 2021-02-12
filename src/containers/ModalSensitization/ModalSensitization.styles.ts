import styled from 'styled-components'
import { theme, devices } from 'src/styles'

export const ModalContainer = styled.div`
  margin: ${theme.spacing(3, 0)};

  @media ${devices.mobile} {
    margin: ${theme.spacing(2, 0)};
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const ImageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const QuoteContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: ${theme.spacing(0, 2)};
`
