import React from 'react'
import styled from 'styled-components'

//TODO idk why this is red
const Toggle = ({ onChange }) => {
  return (
    <InputWrapper>
      <Input type="checkbox" onChange={onChange} />
      <Slider />
    </InputWrapper>
  )
}
export default Toggle

const InputWrapper = styled.label`
  position:relative;
`
const Input = styled.input `
  position:absolute;
  left:-9999px;
  top: -9999px;
  
  &:checked + span {
    background-color: #1890ff;
    &:before{
      left: calc(100% - 2px);
      transform:translate(-100%);
    }
  }
`
const Slider = styled.span`
  display: flex;
  cursor: pointer;
  width: 40px;
  height: 20px;
  border-radius: 80px;
  background-color: #bfbfbf;
  position: relative;
  transition: background-color 0.2s;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    transition: 0.2s;
    background: #fff;
  }
  
  &:active:before {
    width: 28px;
  }
`