import styled, { css } from 'styled-components'
import React, { useCallback } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { ColorName } from '@/theme'
import { UiInputProps } from '@/components/Ui/Input'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'

interface Props extends UiInputProps<boolean> {

  /**
   * Text of the input label.
   */
  label?: string

  /**
   * Disables the Checkbox.
   */
  isDisabled?: boolean

  /**
   * The color of the Checkbox.
   */
  color?: ColorName
}

/**
 * `UiCheckbox` is an input component of a boolean value.
 */
const UiCheckbox: React.VFC<Props> = ({
  label,
  value,
  isDisabled = false,
  errors = [],
  onChange: handleChange,
}) => {
  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    handleChange(!value)
  }, [handleChange, value])

  return (
    <div>
      <Container onClick={handleSelect} isDisabled={isDisabled}>
        <CheckboxLabel>
          <Checkbox>
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

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
  
  &:hover {
    cursor: pointer;
  }
`

const Checkbox = styled.div`
  border: none;
  background: none;
`
