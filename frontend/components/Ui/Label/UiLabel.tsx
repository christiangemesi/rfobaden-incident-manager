import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  children: ReactNode
}

const UiLabel: React.VFC<Props> = (props) => {
  return (
    <Item {...props} />
  )
}
export default styled(UiLabel)``

const Item = styled.li`
  display: flex;
  align-items: center;
  font-size: 0.9em;
  
  & > ${UiIcon}:first-child {
    --size: 0.75;
    margin-right: 0.25rem;
  }
  
  border: 1px solid currentColor;
  padding: 0.25rem 0.5rem;
`
