import styled, { css } from 'styled-components'
import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { contrastDark, defaultTheme } from '@/theme'
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
},
) => {
  return (
    <div>
      <StyledDiv onClick={() => handleChange(!value)}>
        <StyledCheckboxLabel isDisabled={isDisabled}>
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

const StyledDiv = styled.div`
  *  {
    :hover {
      cursor: pointer;
    }
  }
`

const StyledCheckboxLabel = styled.label<{ isDisabled: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.25rem;
  color: ${contrastDark}
  
  ${({ isDisabled }) => isDisabled && css`
    color: rgb(200, 200, 200);

    & > div {
      color: rgb(200, 200, 200);
    }

    :hover {
      cursor: not-allowed;
    }

    & > label {
      color: rgb(200, 200, 200);
    }
  `}
`

const StyledCheckbox = styled.div`
  color: ${defaultTheme.colors.primary.value};
  border: none;
  background: none;
`