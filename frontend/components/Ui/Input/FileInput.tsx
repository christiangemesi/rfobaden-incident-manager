import { UiInputProps } from '@/components/Ui/Input'
import React, { ChangeEvent, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'


interface Props extends UiInputProps<string | null> {
  label?: string
  type?: 'file'
  placeholder?: string
  children?: ReactNode
  onClick?: () => void
}

const FileInput: React.VFC<Props> = ({
  onChange: setValue,
  label,
  errors = [],
  children,
  onClick: handleClick,


}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file != undefined) {
      console.log('Uploaded :' + file.name)
    }

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
      <InputAndErrorBox hasError={hasError} />
      <input type="file" name="picture" onChange={handleChange} />
      <AdditionalInput isClickable={handleClick !== undefined} onClick={handleClick}>
        {children}
      </AdditionalInput>
    </Label>
  )
}

export default FileInput

const StyledInput = styled.input<{ hasChildren: boolean }>`
  padding: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
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
  border: 1px solid ${({ theme }) => theme.colors.tertiary.contrast};
  border-radius: 0 0.5rem 0.5rem 0;
  width: 40px;
  height: 35px;

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
