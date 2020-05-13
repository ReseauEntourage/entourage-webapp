import Box from '@material-ui/core/Box'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const SearchContainer = styled.div`
  flex: 0;
`

export const FeedContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
`
