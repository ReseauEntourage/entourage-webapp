import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 200px;
  background-color: #fff;
`

interface Props {}

export function LeftCards(/* props: Props */) {
  return (
    <Container>
      LeftCards
    </Container>
  )
}
