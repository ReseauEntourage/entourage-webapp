import styled from 'styled-components'
import { colors, theme } from 'src/styles'

interface ContainerProps {
  isActive?: boolean;
}

export const Container = styled.div<ContainerProps>`
  flex: 1;
  padding: ${theme.spacing(3, 2)};
  display: flex;
  border-left: solid 5px transparent;
  border-left-color: ${({ isActive }) => isActive && colors.main.primary};
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const AvatarNumber = styled.div`
  background-color: #333;
  color: ${colors.main.white};
  font-size: 9;
  font-weight: 400;
  line-height: 38;
  text-align: center;
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: ${theme.spacing(1)}px;
  }
`
