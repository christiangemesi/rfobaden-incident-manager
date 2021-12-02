import styled, { css } from 'styled-components'
import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { contrastDark } from '@/theme'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props extends UiInputProps<boolean> {
  label: string
  isDisabled?: boolean
}

const UiCheckbox: React.VFC<Props> = ({
  label = '',
  value,
  isDisabled = false,
  errors = [],
  onChange: handleChange,
}) => {
  return (
    <div>
      <StyledDiv onClick={() => handleChange(!value)} isDisabled={isDisabled}>
        <StyledCheckboxLabel>
          <StyledCheckbox>
            {value && !isDisabled ? <UiIcon.CheckboxInactive /> : <UiIcon.CheckboxActive />}
          </StyledCheckbox>
          {label}
        </StyledCheckboxLabel>
      </StyledDiv>
      <UiInputErrors errors={errors} />
    </div>
  )
}

export default UiCheckbox

const StyledDiv = styled.div<{ isDisabled: boolean }>`
  display: inline-flex;
  align-items: center;
  
  ${({ isDisabled }) => isDisabled && css`
  & > ${StyledCheckboxLabel} {
    color: rgb(200, 200, 200);
    
    & > div {
      color: rgb(200, 200, 200);
      :hover {
        cursor: not-allowed;
      }
    }
    :hover {
      cursor: not-allowed;
    }
  }
`}
`

const StyledCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
  color: ${contrastDark};
  
  &:hover {
    cursor: pointer;
  }
`

const StyledCheckbox = styled.div`
  color: ${({ theme }) => theme.colors.primary.value};
  border: none;
  background: none;
`