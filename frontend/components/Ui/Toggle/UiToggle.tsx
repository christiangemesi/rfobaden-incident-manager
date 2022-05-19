import React from 'react'
import styled from 'styled-components'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { noop } from '@/utils/control-flow'

interface Props extends UiInputProps<boolean | null> {
  /**
   * Text of the input label.
   */
  label?: string,
}

/**
 * `UiToggle` is an input component for boolean values.
 */
const UiToggle: React.VFC<Props> = ({
  value,
  onChange: handleChange,
  label,
  errors = [],
}) => {
  return (
    <div>
      <InputWrapper>
        <Input type="checkbox" checked={value ?? false} onClick={() => handleChange(!value)} onChange={noop} />
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
  :hover {
    cursor: pointer;
  }
`
const Input = styled.input`
  position: absolute;
  left: -9999px;
  top: -9999px;
  
  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary.value};
    
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
