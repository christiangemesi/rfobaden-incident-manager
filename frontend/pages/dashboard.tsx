import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiLink from '@/components/Ui/Link/UiLink'

const DashboardPage: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1}>Dashboard</UiTitle>
      <UiGrid gap={1.5}>
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

const data = [
  { icon: UiIcon.IncidentManagement, label: 'Ereignis verwaltung', link: '/ereignisse' }, 
  { icon: UiIcon.User, label: 'Benutzer verwaltung', link: '/benutzer' },
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

export default DashboardPage
