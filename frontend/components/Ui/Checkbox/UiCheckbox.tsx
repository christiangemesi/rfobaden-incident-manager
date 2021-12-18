import styled, { css } from 'styled-components'
import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ColorName } from '@/theme'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props extends UiInputProps<boolean> {
  label: string
  isDisabled?: boolean
  color?: ColorName
}

const UiCheckbox: React.VFC<Props> = ({
  label = '',
  value,
  isDisabled = false,
  errors = [],
  onChange: handleChange,
  color = 'primary',
}) => {
  return (
    <div>
      <Container onClick={() => handleChange(!value)} isDisabled={isDisabled}>
        <CheckboxLabel color={color}>
          <Checkbox color={color}>
            {value && !isDisabled ? <UiIcon.CheckboxInactive /> : <UiIcon.CheckboxActive />}
          </Checkbox>
          {label}
        </CheckboxLabel>
      </Container>
      <UiInputErrors errors={errors} />
    </div>
  )
}

export default UiCheckbox

const Container = styled.div<{ isDisabled: boolean }>`
  display: inline-flex;
  align-items: center;
  
  ${({ isDisabled }) => isDisabled && css`
  & > ${CheckboxLabel} {
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

const CheckboxLabel = styled.label<{ color: ColorName }>`
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
  color: ${({ theme, color }) => theme.colors[color].value};
  
  &:hover {
    cursor: pointer;
  }
`

const Checkbox = styled.div<{ color: ColorName }>`
  color: ${({ theme, color }) => theme.colors[color].value};
  border: none;
  background: none;
`