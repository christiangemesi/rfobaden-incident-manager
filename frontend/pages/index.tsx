import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'

const HomePage: React.VFC = () => {
  return (
    <UiContainer>
      <div>
        <UiTitle level={1} isCentered>
          IncidentManager
        </UiTitle>
        <Subtitle>
          Regionales Führungsorgan Baden
        </Subtitle>
      </div>
    </UiContainer>
  )
}
export default HomePage

const Subtitle = styled.div`
  width: 100%;
  text-align: center;
  margin-top: -0.5rem;
`