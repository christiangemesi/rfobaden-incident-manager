import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiLink from '@/components/Ui/Link/UiLink'

//mdiArrowDecisionOutline, mdiAccount, 
const DashboardPage: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1}>Dashboard</UiTitle>
      {data.map((card) => (
        <UiLink key={card.label} href={card.link}>
          <UiGrid.Col size={{ sm: 6, lg: 4, xxl: 3 }}>
            <Card>
              <card.icon size={5} />
              <CardTitle level={4}>{card.label}</CardTitle>
            </Card>
          </UiGrid.Col>
        </UiLink>
      ))}
    </UiContainer>
  )
}

const data = [
  { icon: UiIcon.IncidentManagement, label: 'Ereignis verwaltung', link: '/ereignisse' }, 
  { icon: UiIcon.User, label: 'Benutzer verwaltung', link: '/benutzer' },
]

const Card = styled.div`
  width: 100%;
  height: 15rem;
  padding: 1.5rem 2rem;

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
