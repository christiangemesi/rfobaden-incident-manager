import React from 'react'
import styled from 'styled-components'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props extends UiInputProps<boolean> {
  label?: string,
}

const UiToggle: React.VFC<Props> = ({
  value,
  onChange: handleChange,
  label,
  errors = [],
}) => {
  return (
    <div>
      <InputWrapper>
        <Input type="checkbox" onClick={() => handleChange(!value)}  />
        <Slider />
        {label}
      </InputWrapper>
      <UiInputErrors errors={errors} />
    </div>
  )
}
export default UiToggle

const InputWrapper = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
`
const Input = styled.input`
  position: absolute;
  left: -9999px;
  top: -9999px;
  
  &:checked + span {
    background-color: #1890ff;
    &:before {
      left: calc(100% - 2px);
      transform: translate(-100%);
    }
  }
`
const Slider = styled.span`
  display: inline-flex;
  cursor: pointer;
  width: 40px;
  height: 20px;
  border-radius: 80px;
  background-color: #bfbfbf;
  position: relative;
  transition: background-color 0.2s;
  margin-right: 0.5rem;

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