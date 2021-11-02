import styled from 'styled-components'
import { theme, devices } from 'src/styles'

export const ModalContainer = styled.div`
  margin: ${theme.spacing(3, 0)};

  @media ${devices.mobile} {
    margin: ${theme.spacing(2, 0)};
  }

  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ActionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: ${theme.spacing(2)}px;
`

export const ImageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${theme.spacing(4)}px;
`
