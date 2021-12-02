import React from 'react'
import { UiInputProps } from '@/components/Ui/Input'
import styled, { css } from 'styled-components'
import { contrastDark, defaultTheme } from '@/theme'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'
import Priority from '@/models/Priority'

const UiPrioritySlider: React.VFC<UiInputProps<Priority>> = ({
  value = Priority.MEDIUM,
  onChange: handleChange,
  errors = [],
}) => {

  return (
    <div>
      <StyledDiv>

        <StyledSlider value={value} />
        <StyledContainer>
          <StyledIconDiv onClick={() => handleChange(Priority.LOW)} priority={Priority.LOW}>
            <UiIcon.PriorityLow />
          </StyledIconDiv>
          <StyledIconDiv onClick={() => handleChange(Priority.MEDIUM)} priority={Priority.MEDIUM}>
            <UiIcon.PriorityMedium />
          </StyledIconDiv>
          <StyledIconDiv onClick={() => handleChange(Priority.HIGH)} priority={Priority.HIGH}>
            <UiIcon.PriorityHigh />
          </StyledIconDiv>
        </StyledContainer>

      </StyledDiv>
      <UiInputErrors errors={errors} />
    </div>
  )
}

export default UiPrioritySlider

const StyledIconDiv = styled.div<{priority: Priority}>`
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

const StyledDiv = styled.div`
  display: inline-flex;
  position: relative;
  cursor: pointer;
`

const StyledSlider = styled.div<{value: Priority}>`
  height: 40px;
  width: 40px;
  background: ${defaultTheme.colors.primary.value};
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

const StyledContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  
  width: 120px;
  height: 40px;
  border: 1px solid ${contrastDark};
  border-radius: 10px;
  z-index: 1;
`