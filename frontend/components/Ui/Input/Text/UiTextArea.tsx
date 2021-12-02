import React from 'react'
import styled, { css } from 'styled-components'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { contrastDark, defaultTheme } from '@/theme'

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
  const Label = label == null ? 'div' : StyledLabel
  const hasError = errors.length !== 0

  /* TODO add star to label when isRequired*/
  return (
    <Label>
      {label !== null && (
        <span>
          {label}
        </span>
      )}
      <StyledDiv hasError={hasError}>
        <StyledTextArea
          value={value ?? ''}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => handleChange(processText(e.target.value))}
          hasErrors={hasError}
        />
      </StyledDiv>
      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiTextArea

const StyledTextArea = styled.textarea`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  font-family: ${defaultTheme.fonts.body};
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  min-width: 100%; // so you cant resize it horizontally
  min-height: 2.1rem; // so you cant resize smaller then 1 row
  border: 1px solid ${contrastDark};
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

const StyledDiv = styled.div<{ hasError: boolean }>`
  display: flex;

  ${({ hasError }) => !hasError && css`
    & > ${StyledTextArea} {
      :active, :focus {
        border-color: ${defaultTheme.colors.primary.value};
      }
    }
  `}

  ${({ hasError }) => hasError && css`
    & > ${StyledTextArea} {
      border-color: ${defaultTheme.colors.error.value};
    }
  `}
`

