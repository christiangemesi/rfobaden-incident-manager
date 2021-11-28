import React, { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'

interface Props extends UiInputProps<string | null> {
  label?: string
  type?: 'text' | 'password'
}

const UiTextInput: React.VFC<Props> = ({
  value,
  onChange: setValue,
  label,
  type = 'text',
  errors = [],
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      const newValue = e.target.value
      if (newValue.length === 0) {
        setValue(null)
      } else {
        setValue(newValue)
      }
    }
  }, [setValue])

  const Label = label == null ? 'div' : StyledLabel

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <StyledInput value={value ?? ''} onChange={handleChange} type={type} />
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiTextInput

const StyledInput = styled.input`
  padding: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  outline: none;
  
  border: 1px solid gray;
  :active, :focus {
    border-color: cornflowerblue;
  }
`

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;

  // Affects only label text
  & > span:first-child {
    font-size: 0.9rem;
    font-weight: bold;
  }
`
