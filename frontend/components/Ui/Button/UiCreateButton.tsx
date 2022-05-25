import React from 'react'
import styled from 'styled-components'
import UiButton, { Props as UiButtonProps } from '@/components/Ui/Button/UiButton'

export type Props = Exclude<UiButtonProps, 'color'>;

/**
 * `UiCreateButton` is an input component to create Entities.
 */
const UiCreateButton: React.VFC<Props> = ({ isFull= true, ...props }) => {
  return (
    <CreateButton {...props} color="secondary" isFull={isFull} />
  )
}
export default styled(UiCreateButton)``

const CreateButton = styled(UiButton)`
  color: ${({ theme }) => theme.colors.primary.value};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
`
