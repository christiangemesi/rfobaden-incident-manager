import React from 'react'
import styled, { css } from 'styled-components'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props extends UiInputProps<string | null> {
  label?: string,
  placeholder?: string,
  isRequired?: boolean,
  rows?: number
}

const processText = (v: string) => v.length === 0 ? null : v

const UiTextArea: React.VFC<Props> = ({
  label = '',
  value,
  placeholder = '',
  isRequired = false,
  rows = 3,
  onChange: handleChange,
  errors = [],
}) => {
  /*add star to label when isRequired*/
  return (
    <React.Fragment>
      <h2>{label}</h2>
      <TextArea
        value={value ?? ''}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => handleChange(processText(e.target.value))}
        hasErrors={errors.length !== 0}
      />
      <UiInputErrors errors={errors} />
    </React.Fragment>
  )
}
export default UiTextArea

const TextArea = styled.textarea<{ hasErrors: boolean }>`
  border-radius: 0.5rem;
  width: 100%;
  ${({ hasErrors, theme }) => hasErrors && css`
    border: 1px solid ${theme.colors.error.value}
  `}
`

