import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiLink from '@/components/Ui/Link/UiLink'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'

const HomePage: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1} isCentered>
        IncidentManager
      </UiTitle>
      <Subtitle>
        Regionales Führungsorgan Baden
      </Subtitle>
      <UiGrid gap={1.5} justify="center">
        {data.map((card) => (
          <UiGrid.Col key={card.label} size={{ sm: 6, lg: 4, xxl: 3 }}>
            <UiLink href={card.link}>
              <Card>
                <card.icon size={5} />
                <CardTitle level={4}>{card.label}</CardTitle>
              </Card>
            </UiLink>
          </UiGrid.Col>
        ))}
      </UiGrid>
    </UiContainer>
  )
}
export default HomePage

const Subtitle = styled.div`
  width: 100%;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
`


const data = [
  { icon: UiIcon.IncidentManagement, label: 'Ereignisse', link: '/ereignisse', forAll: true }, 
  { icon: UiIcon.Transport, label: 'Transporte', link: '/benutzer', forAll: true },
  { icon: UiIcon.UserManagement, label: 'Benutzer', link: '/', forAll: false },
  { icon: UiIcon.Organization, label: 'Organizationen', link: '/', forAll: false },
]
  
const Card = styled.div`
  height: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};
  
  border-radius: 0.5rem;
  
  transition: 250ms ease;
  transition-property: filter;
  
  :hover:not(&[disabled]), :active:not(&[disabled]) {
    cursor: pointer;
    filter: brightness(90%);
  }
`
  
const CardTitle = styled(UiTitle)`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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