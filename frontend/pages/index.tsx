import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import UiBadge from '@/components/Ui/Badge/UiBadge'

const HomePage: React.VFC = () => {
  return (
    <div>
      <UiIcon.PriorityHigh />
      <StyledName>
        Daniel
      </StyledName>
    </div>
  )
}
export default HomePage

const StyledName = styled.div`
  color: ${({ theme }) => theme.colors.error.value};
`
