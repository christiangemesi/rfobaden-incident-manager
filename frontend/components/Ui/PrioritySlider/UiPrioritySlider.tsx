import React from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import styled, { css } from 'styled-components'
import { contrastDark, defaultTheme } from '@/theme'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import Priority from '@/models/Priority'

/**
 * `UiPrioritySlider` is an input component with which an {@link Priority} value can be selected.
 */
const UiPrioritySlider: React.VFC<UiInputProps<Priority | null>> = ({
  value,
  onChange: handleChange,
  errors = [],
}) => {

  return (
    <div>
      <Slider>

        <Selector value={value} />
        <IconContainer>
          <Icon  priority={Priority.LOW} onClick={() => handleChange(Priority.LOW)}>
            <UiIcon.PriorityLow />
          </Icon>
          <Icon priority={Priority.MEDIUM} onClick={() => handleChange(Priority.MEDIUM)}>
            <UiIcon.PriorityMedium />
          </Icon>
          <Icon priority={Priority.HIGH} onClick={() => handleChange(Priority.HIGH)}>
            <UiIcon.PriorityHigh />
          </Icon>
        </IconContainer>

      </Slider>
      <UiInputErrors errors={errors} />
    </div>
  )
}

export default UiPrioritySlider

const Icon = styled.div<{priority: Priority}>`
  height: 40px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ priority }) => priority==Priority.LOW && css`
    color: ${({ theme } ) => theme.colors.success.value};
  `}

  ${({ priority }) => priority==Priority.MEDIUM && css`
    color: ${({ theme } ) => theme.colors.warning.value};
  `}

  ${({ priority }) => priority==Priority.HIGH && css`
    color: ${({ theme } ) => theme.colors.error.value};
  `}
`

const Slider = styled.div`
  display: inline-flex;
  position: relative;
  cursor: pointer;
`

const Selector = styled.div<{ value: Priority | null }>`
  height: 40px;
  width: 40px;
  ${({ value }) => value !== null && css`
    background: ${defaultTheme.colors.primary.value};
  `}
  position: absolute;

  
  ${({ value }) => value==Priority.LOW && css`
    right: 80px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  `}
  ${({ value }) => value==Priority.MEDIUM && css`
    right: 40px;
  `}
  ${({ value }) => value==Priority.HIGH && css`
    right: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;

  `}
  transition: 250ms ease;
  transition-property: right, border-radius;
`

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  
  width: 120px;
  height: 40px;
  border: 1px solid ${contrastDark};
  border-radius: 10px;
  z-index: 1;
`