import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
  value: number
}

const firstRotate = keyframes`
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
`

const UICircularProgress: React.VFC<Props> = ({ value= 0 }) => {
  return (
    <EmptyCircle>
      <Indicator />
      <CoverIndicator />
    </EmptyCircle>
  )
}
export default UICircularProgress

const CircleBase = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  border-style: solid;
  border-width: 20px;
`

const EmptyCircle = styled(CircleBase)`
  border-color: red; // empty color
  justify-content: center;
  align-items: center;
  transform: rotate(-45deg); // So that it starts at the top center
`

const Indicator = styled(CircleBase)`
  position: absolute;
  border-left-color: blue; //progress color
  border-top-color: blue;
  border-right-color: transparent;
  border-bottom-color: transparent;
  transform: rotate(50deg);
  animation: ${firstRotate} 2s linear infinite;
`

const CoverIndicator = styled(CircleBase)`
  position: absolute;
  border-left-color: red; //empty color
  border-top-color: red;
  border-right-color: transparent;
  border-bottom-color: transparent;
`

