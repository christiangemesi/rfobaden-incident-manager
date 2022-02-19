import React from 'react'
import styled from 'styled-components'
import UiCreateButton, { Props as UiCreateButtonProps } from '@/components/Ui/Button/UiCreateButton'

export type Props = UiCreateButtonProps;

const IncidentCreateButton:React.VFC<Props> = (props) => {
  return (
    <CreateButton {...props} />
  )
}
export default IncidentCreateButton

const CreateButton = styled(UiCreateButton)`
  height: 15rem;
`