import React from 'react'
import UiListContainer from '@/components/Ui/List/Container/UiListContainer'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiListItem from '@/components/Ui/List/Item/UiListItem'

const UiListContainerExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={3}>List-Container</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiListContainer>
            <UiIcon.PriorityHigh />
            <UiActionButton>
              test
            </UiActionButton>
            <UiIcon.SubmitAction />
          </UiListContainer>
        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>List-Item</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiListContainer>
            <UiListItem color="secondary">
              <UiIcon.PriorityHigh />
            </UiListItem>
            <UiListItem onClick={() => alert('test')}>
              <UiActionButton color="secondary">
                test
              </UiActionButton>
              <UiIcon.PriorityMedium />
              <UiIcon.PriorityLow />
              <UiIcon.EditAction />
            </UiListItem>
            <UiListItem>
              <UiIcon.PriorityMedium />
              <UiIcon.PriorityLow />
              <UiIcon.EditAction />
            </UiListItem>
          </UiListContainer>
        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>List-Element</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>

        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiListContainerExample