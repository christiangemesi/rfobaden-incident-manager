import React, { ChangeEvent, useCallback } from 'react'
import { UiFormInputProps } from '@/components/Ui/Form/Field/UiFormField'
import styled from 'styled-components'

interface Props extends UiFormInputProps<string> {
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
  const handleChange = useCallback((e: ChangeEvent) => {
    if (setValue) {
      setValue((e.target as HTMLInputElement).value)
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
      <StyledInput value={value} onChange={handleChange} type={type} />
      <Errors>
        {errors.map((error) => (
          <div key={error}>
            {error}
          </div>
        ))}
      </Errors>
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

const Errors = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: red;
  font-size: 0.9rem;
`