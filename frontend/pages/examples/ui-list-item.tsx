import React from 'react'
import UiListItem from '@/components/Ui/ListItem/UiListItem'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiListItemExample: React.VFC = () => {
  return (
    <UiListItem>
      <UiIcon.PriorityHigh />
      <UiActionButton>
        test
      </UiActionButton>
      <UiIcon.SubmitAction />
    </UiListItem>
  )
}
export default UiListItemExample