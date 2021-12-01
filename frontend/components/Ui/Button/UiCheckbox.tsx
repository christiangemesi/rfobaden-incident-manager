import styled from 'styled-components'
import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { contrastDark, defaultTheme } from '@/theme'

interface Props {
  label: string
  value: string
  isDisabled?: boolean
  checked: boolean
  onChange?: () => void
}

const UiCheckbox: React.VFC<Props> = ({
  label = '',
  value = '',
  isDisabled = false,
  checked,
  onChange: handleChange,
},
) => {
  return (
    <StyledDiv>
      <StyledCheckbox onClick={handleChange} disabled={isDisabled} value={value}>
        {checked && !isDisabled ? <UiIcon.CheckboxInactive /> : <UiIcon.CheckboxActive />}
        <StyledCheckboxLabel>
          {label}
        </StyledCheckboxLabel>
      </StyledCheckbox>
    </StyledDiv>
  )
}

export default UiCheckbox

const StyledDiv = styled.div`
  display: inline-flex;
  align-items: center;
`

const StyledCheckboxLabel = styled.label`
  margin-left: 0.25rem;
  color: ${contrastDark};
`

const StyledCheckbox = styled.button`
  display: inherit;
  align-items: inherit;
  border: none;
  background: none;
  color: ${defaultTheme.colors.primary.value};
  
  :disabled {
    color: rgb(200, 200, 200);
    cursor: not-allowed;
    & > label {
      color: rgb(200, 200, 200);
    }
  }
`

