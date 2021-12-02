import React from 'react'
import UiList from '@/components/Ui/List/UiList'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiListElement from '@/components/Ui/List/Element/UiListElement'
import Priority from '@/models/Priority'

const UiListContainerExample: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={3}>List-Container</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiList>
            <UiIcon.PriorityHigh />
            <UiActionButton>
              test
            </UiActionButton>
            <UiIcon.SubmitAction />
          </UiList>
        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>List-Item</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col>
          <UiList>
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
          </UiList>
        </UiGrid.Col>
      </UiGrid>
      <UiTitle level={3}>List-Element</UiTitle>
      <UiGrid gap={0.5}>
        <UiGrid.Col size={6}>

          <UiList>
            <UiListElement priority={Priority.LOW} title="Bedrohung auf Holzbrücke" user="Christian Gemesi">
              <UiIcon.KeyMessage />
              <UiIcon.LocationRelevancy />
              <div>5/10</div>
            </UiListElement>

            <UiListElement priority={Priority.HIGH} title="Zimmer brennt" user="Andri Wild">
              <UiIcon.KeyMessage />
              <UiIcon.LocationRelevancy />
              <div>3/5</div>
            </UiListElement>

            <UiListElement priority={Priority.MEDIUM} title="Überflutung Keller" user="Arian">
              <div>3/5</div>
            </UiListElement>

          </UiList>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default UiListContainerExample