import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'

//mdiArrowDecisionOutline, mdiAccount, 
const DashboardPage: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1}>Dashboard</UiTitle>
      {data.map((card) => (
        <Card key={card.label}>
          <card.icon size={5} />
          <CardTitle level={4}>{card.label}</CardTitle>
        </Card>
      ))}
    </UiContainer>
  )
}

const data = [
  { icon: UiIcon.IncidentManagement, label: 'Ereignis verwaltung' }, 
  { icon: UiIcon.User, label: 'Benutzer verwaltung' },
]

const Card = styled.div`
  width: 100%;
  height: 15rem;
  padding: 1.5rem 2rem;

  color: ${({ theme }) => theme.colors.secondary.contrast};
  background-color: ${({ theme }) => theme.colors.secondary.value};

  border-radius: 0.5rem;
  text-align: center;
`

const CardTitle = styled(UiTitle)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export default DashboardPage
