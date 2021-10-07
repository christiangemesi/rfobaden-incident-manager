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
    setValue((e.target as HTMLInputElement).value)
  }, [setValue])

  const Label = label == null ? 'div' : StyledLabel

  return (
    <Label>
      {label}
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

`

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
`

const Errors = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`