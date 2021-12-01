import React, { ChangeEvent, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import { UiInputProps } from '@/components/Ui/Input'
import { contrastDark, defaultTheme } from '@/theme'

interface Props extends UiInputProps<string | null> {
  label?: string
  type?: 'text' | 'password'
  placeholder?: string
  children?: ReactNode
  onClick?: () => void
}

const UiTextInput: React.VFC<Props> = ({
  value,
  placeholder='',
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
      <StyledDiv hasError={hasError}>
        <StyledInput value={value ?? ''} onChange={handleChange} type={type} placeholder={placeholder} hasChildren={hasChildren} />
        {hasChildren ?
          <StyledAdditionalInput onClick={handleClick}>
            {children}
          </StyledAdditionalInput>: null}
      </StyledDiv>

      <UiInputErrors errors={errors} />
    </Label>
  )
}
export default UiTextInput

const StyledInput = styled.input<{hasChildren: boolean}>`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  border-style: solid;
  border-width: 1px;
  outline: none;
  border-color: inherit;
  width: 100%;


  ${({ hasChildren }) => hasChildren && css`
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
  `}

`
const StyledAdditionalInput = styled.div`
  background: ${defaultTheme.colors.primary.value};
  border-color: inherit;
  margin-top: 0.25rem;
  outline: none;  
  border-style: solid;
  border-width: 1px;
  border-radius: 0  0.5rem 0.5rem 0;
  width: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  
  * {
    color: ${defaultTheme.colors.primary.contrast};
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

const StyledDiv = styled.div<{hasError: boolean}>`
  display: flex;

  ${({ hasError }) => !hasError && css`
    :active, :focus {
      border-color:  ${defaultTheme.colors.primary.value};
    }
  `}

  ${({ hasError }) => hasError && css`
      border-color: ${defaultTheme.colors.error.value};
  `}
  
  transition: 250ms ease;
  transition-property: border-color;
`