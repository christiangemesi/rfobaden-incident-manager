import React, { ChangeEvent, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'

interface Props extends UiInputProps<string | null> {
  /**
   * Text of the input label.
   */
  label?: string

  /**
   * The type of the input.
   */
  type?: 'text' | 'password'

  /**
   * Text of the input placeholder.
   */
  placeholder?: string

  /**
   * Content used for displaying advanced input options.
   */
  children?: ReactNode

  /**
   * Event caused by clicking on the advanced input options.
   */
  onClick?: () => void
}

/**
 * `UiTextInput` is an input component for a text values.
 */
const UiTextInput: React.VFC<Props> = ({
  value,
  placeholder = '',
  onChange: setValue,
  label,
  type = 'text',
  errors = [],
  children,
  onClick: handleClick,
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
  const hasError = errors.length !== 0
  const hasChildren = children !== undefined

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
          type={type}
          placeholder={placeholder}
          hasChildren={hasChildren} />
        {hasChildren && (
          <AdditionalInput isClickable={handleClick !== undefined} onClick={handleClick}>
            {children}
          </AdditionalInput>
        )}
      </InputAndErrorBox>

      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiTextInput

const StyledInput = styled.input<{ hasChildren: boolean }>`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  height: 38px;
  border: 1px solid ${({ theme }) => theme.colors.light.contrast};
  font-family: ${({ theme }) => theme.fonts.body};

  ${({ hasChildren }) => hasChildren && css`
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
  `}

  transition: 250ms ease;
  transition-property: border-color;
`

const AdditionalInput = styled.div<{ isClickable: boolean }>`
  background: ${({ theme }) => theme.colors.primary.value};
  margin-top: 0.25rem;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.light.contrast};
  border-radius: 0 0.5rem 0.5rem 0;
  width: 40px;
  height: 38px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary.contrast};

  transition: 250ms ease;
  transition-property: border-color;

  ${({ isClickable }) => isClickable && css`
    cursor: pointer;
  `}
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

        & + ${AdditionalInput} {
          border-color: ${({ theme }) => theme.colors.primary.value};
        }
      }
    }
  `}

  ${({ hasError }) => hasError && css`
    & > ${StyledInput} {

      border-color: ${({ theme }) => theme.colors.error.value};

      & + ${AdditionalInput} {
        border-color: ${({ theme }) => theme.colors.error.value};
      }
    }
  `}
`
