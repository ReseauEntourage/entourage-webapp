import AvatarMUI from '@material-ui/core/Avatar'
import styled from 'styled-components'
import { colors } from 'src/styles'

export const NoProfilePicture = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 100%;
  background-color: ${colors.main.primary};
`

export const Container = styled.div`
  border-radius: 100%;
`

export const AvatarPicture = styled(AvatarMUI)`
  width: 36px;
  height: 36px;
  max-width: 100%;
  max-height: 100%;
`
