import React from 'react'
import UiListContainer from '@/components/Ui/List/Container/UiListContainer'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiListContainerExample: React.VFC = () => {
  return (
    <UiListContainer>
      <UiIcon.PriorityHigh />
      <UiActionButton>
        test
      </UiActionButton>
      <UiIcon.SubmitAction />
    </UiListContainer>
  )
}
export default UiListContainerExample