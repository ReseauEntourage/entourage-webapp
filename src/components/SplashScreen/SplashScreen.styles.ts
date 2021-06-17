import styled, { keyframes } from 'styled-components'

const animation = keyframes`
  0% {
    transform: scale(1) ;
    opacity: 1;
  }
  50% {
    transform: scale(0.9);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

export const Container = styled.div`
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AnimatedContainer = styled.div`
  animation: ${animation} 3s ease-in-out 1s infinite both;
`

export const Logo = styled.img`
  width: 175px;
  filter: drop-shadow(5px 5px 5px #eeeeee);
`

