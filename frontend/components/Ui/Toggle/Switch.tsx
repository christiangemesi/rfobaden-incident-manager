import React from 'react'

import styled from 'styled-components'

const InputWrapper = styled.label`
  position:relative;
`

class Toggle extends React.Component<{ onChange: any }> {
  render() {
    const { onChange: onChange } = this.props
    return (
      <InputWrapper>
        <Input type="checkbox" onChange={onChange} />
        <Slider />
      </InputWrapper>
    )
  }
}

export default Toggle


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
  width: 50px;
  height: 25px;
  border-radius: 100px;
  background-color: #bfbfbf;
  position: relative;
  transition: background-color 0.2s;

  &:before {
    conten: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 21px;
    height: 21px;
    border-radius: 21px;
    transition: 0.2s;
    background: #000;
  }

  &:active:before {
    width: 28px;
  }
`


