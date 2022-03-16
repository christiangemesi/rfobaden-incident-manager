import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'

const UiLabel = styled.li`
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
export default UiLabel