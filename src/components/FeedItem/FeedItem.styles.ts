import styled from 'styled-components'
import { colors } from 'src/styles'
import { theme } from 'src/styles/theme'

interface ContainerProps {
  isActive?: boolean;
}

export const Container = styled.div<ContainerProps>`
  padding: ${theme.spacing(2)}px;
  display: flex;
  border-left: solid 5px transparent;
  border-left-color: ${({ isActive }) => isActive && colors.main.primary};
  &:hover {
    background-color: ${colors.main.greyLight};
  }
`

export const AvatarNumber = styled.div`
  background-color: #333;
  color: #fff;
  font-size: 9;
  font-weight: 400;
  line-height: 38;
  text-align: center;
`
