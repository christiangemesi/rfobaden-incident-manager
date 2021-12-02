import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiListElement from '@/components/Ui/List/Element/UiListElement'



const UiListElementExample: React.VFC = () => {
  return (
    <UiListElement title="test">
      <UiIcon.PriorityHigh />
      <div>Bedrohung auf Holzbrücke</div>
      <div>User: Christian Gemesi</div>
      <UiIcon.KeyMessage />
      <UiIcon.LocationRelevancy />
      <div> 3/5 </div>
    </UiListElement>
  )
}
export default UiListElementExample
