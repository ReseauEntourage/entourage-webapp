import styled from 'styled-components'
import { colors, theme } from 'src/styles'

interface ContainerProps {
  isActive?: boolean;
}

export const Container = styled.div<ContainerProps>`
  flex: 1;
  padding: ${theme.spacing(3, 2)};
  padding-right: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: solid 5px transparent;
  border-left-color: ${({ isActive }) => isActive && colors.main.primary};
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: ${theme.spacing(2)}px;
`

export const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px ${colors.borderColor} solid;
`

export const DirectionsButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
