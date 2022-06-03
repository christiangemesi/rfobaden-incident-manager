import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  /**
   * The content of the list.
   */
  children: ReactNode
}

/**
 * `UiList` is displaying multiple {@link UiListItem} beneath each other.
 */
const UiList: React.VFC<Props> = ({ children, style, className }) => {
  return (
    <Box style={style} className={className}>
      {children}
    </Box>
  )
}
export default styled(UiList)``

const Box = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.4rem;
  
  & > ${UiListItem}:first-child, & > a:first-child > ${UiListItem} {
    &, :after {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      margin-top: 0.5rem;
    }
  }

  & > ${UiListItem}:last-child, & > a:last-child > ${UiListItem} {
    &, :after {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
`