import React, { ChangeEvent, useCallback } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'

interface Props extends UiInputProps<number | null> {
  /**
   * Text of the input label.
   */
  label?: string

  /**
   * Text of the input placeholder.
   */
  placeholder?: string
}

/**
 * `UiNumberInput` is input component for a numerical value.
 */
const UiNumberInput: React.VFC<Props> = ({
  value,
  placeholder = '',
  onChange: setValue,
  label,
  errors = [],
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber)
  }, [setValue])

  const Label = label == null ? 'div' : StyledLabel
  const hasError = errors.length !== 0
  const hasChildren = false

  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <InputAndErrorBox hasError={hasError}>
        <StyledInput
          value={value ?? ''}
          onChange={handleChange}
          type="number"
          placeholder={placeholder}
          hasChildren={hasChildren} />
      </InputAndErrorBox>
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiNumberInput

const StyledInput = styled.input<{ hasChildren: boolean }>`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.activeClosed.contrast};
  font-family: ${({ theme }) => theme.fonts.body};

  ${({ hasChildren }) => hasChildren && css`
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
  `}

  transition: 250ms ease;
  transition-property: border-color;
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

const InputAndErrorBox = styled.div<{ hasError: boolean }>`
  display: flex;

  ${({ hasError }) => !hasError && css`
    & > ${StyledInput} {
      :active, :focus {
        border-color: ${({ theme }) => theme.colors.primary.value};
      }
    }
  `}

  ${({ hasError }) => hasError && css`
    & > ${StyledInput} {
      border-color: ${({ theme }) => theme.colors.error.value};
    }
  `}
`
