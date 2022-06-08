import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'

/**
 * `UiIconExample` is an example page for the {@link UiIcon} component.
 */
const UiIconButtonGroupExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={3}>Icons</UiTitle>
      <Title level={4}>Alerts</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.AlertError />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.AlertInfo />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.AlertSuccess />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.AlertWarning />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Priority</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.PriorityHigh />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.PriorityMedium />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.PriorityLow />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Entity Details</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.KeyMessage />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.LocationRelevancy />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Location />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Map />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Empty />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Dashboard</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.IncidentManagement />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Transport />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Archive />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Organization />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.UserManagement />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Monitoring />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Actions</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.CreateAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.EditAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.DeleteAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Trash />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.PrintAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.SubmitAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.CancelAction />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Attachments />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Upload />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.ResetPassword />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.SortAsc />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.SortDesc />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>User</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.UserInCircle />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Login />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Logout />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Header</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.Menu />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Changelog />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.AssignedList />
        </UiGrid.Col>
      </UiGrid>

      <Title level={4}>Divers</Title>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiIcon.CheckboxActive />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.CheckboxInactive />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Calendar />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Clock />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Loader />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.More />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Dot />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Previous />
        </UiGrid.Col>
        <UiGrid.Col>
          <UiIcon.Next />
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiIconButtonGroupExample

const Title = styled(UiTitle)`
  margin-top: 2rem;
  width: 100%;
  border-top: 1px solid gray;
`
