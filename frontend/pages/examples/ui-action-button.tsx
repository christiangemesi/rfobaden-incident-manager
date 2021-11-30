import React from 'react'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiActionButtonExample: React.VFC = () => {

  const handleClick = () => {
    console.log('Clicked...')
  }

  return(
    <div>
      <UiActionButton onClick={handleClick} title= "Title of a activated FAB" color="primary">
        <UiIcon.KeyMessage />
      </UiActionButton>

      <UiActionButton onClick={handleClick} title= "Title of a activated FAB" color="error">
        <UiIcon.EditAction />
      </UiActionButton>

      <UiActionButton onClick={handleClick} isDisabled title= "Title of a disabled FAB">
        <UiIcon.LocationRelevancy />
      </UiActionButton>
    </div>
  )
}

export default UiActionButtonExample