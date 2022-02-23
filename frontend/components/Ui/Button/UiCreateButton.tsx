import React from 'react'
import styled from 'styled-components'
import UiButton, { Props as UiButtonProps } from '@/components/Ui/Button/UiButton'

export type Props = UiButtonProps;

const UiCreateButton: React.VFC<Props> = ({ color = 'primary', isFull= true, ...props }) => {
  return (
    <CreateButton {...props} color={color} isFull={isFull} />
  )
}
export default styled(UiCreateButton)``

const CreateButton = styled(UiButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`
