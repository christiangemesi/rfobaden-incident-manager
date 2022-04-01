import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import styled from 'styled-components'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = getSessionFromRequest(req)
  if (user === null) {
    return { redirect: { statusCode: 302, destination: '/anmelden' }}
  }
  return {
    props: {},
  }
}