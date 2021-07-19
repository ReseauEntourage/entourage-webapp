import styled from 'styled-components'
import { ImageWithFallback } from 'src/components/ImageWithFallback'
import { theme } from 'src/styles'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

export const Scroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`

export const Image = styled(ImageWithFallback)`
  width: 100%;
`

export const ContentContainer = styled.div`
  padding: ${theme.spacing(2, 0)};
`
