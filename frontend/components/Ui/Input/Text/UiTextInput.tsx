import React, { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'
import { contrastDark, defaultTheme } from '@/theme'

interface Props extends UiInputProps<string | null> {
  label?: string
  type?: 'text' | 'password'
  placeholder?: string
}

const UiTextInput: React.VFC<Props> = ({
  value,
  placeholder='',
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
      <StyledInput value={value ?? ''} onChange={handleChange} type={type} placeholder={placeholder} />
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiTextInput

const StyledInput = styled.input`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  outline: none;
  border-style: solid;
  border-width: 1px;
  border-color: ${contrastDark};

  :active, :focus {
    border-color:  ${defaultTheme.colors.primary.value};
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
