import React from 'react'
import UiListElement from '@/components/Ui/List/Element/UiListElement'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import Priority from '@/models/Priority'
import UiListContainer from '@/components/Ui/List/Container/UiListContainer'
import UiGrid from '@/components/Ui/Grid/UiGrid'


const UiListElementExample: React.VFC = () => {
  return (
    <UiGrid.Col size={6}>

      <UiListContainer>
        <UiListElement priority={Priority.LOW} title="Bedrohung auf Holzbrücke" user="Christian Gemesi">
          <UiIcon.KeyMessage />
          <UiIcon.LocationRelevancy />
          <div>3/5</div>
        </UiListElement>

        <UiListElement priority={Priority.LOW} title="Bedrohung auf Holzbrücke" user="Christian Gemesi">
          <UiIcon.KeyMessage />
          <UiIcon.LocationRelevancy />
          <div>3/5</div>
        </UiListElement>

        <UiListElement priority={Priority.LOW} title="Bedrohung auf Holzbrücke" user="Christian Gemesi">
          <UiIcon.KeyMessage />
          <UiIcon.LocationRelevancy />
          <div>3/5</div>
        </UiListElement>

      </UiListContainer>
    </UiGrid.Col>
  )
}
export default UiListElementExample
