import Priority from '@/models/Priority'
import React, { useMemo } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import styled from 'styled-components'
import { ColorName } from '@/theme'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {

  /**
   * The level of the priority, between low, medium and high.
   */
  priority: Priority

  /**
   * Size of the priority label.
   */
  isSmall?: boolean
}

/**
 * `UiPriority` defines the priority.
 */
const UiPriority: React.VFC<Props> = ({ priority, isSmall = false, style, className }) => {
  const [PriorityIcon, priorityColor] = useMemo(() => {
    switch (priority) {
    case Priority.HIGH:
      return [UiIcon.PriorityHigh, 'error' as const]
    case Priority.MEDIUM:
      return [UiIcon.PriorityMedium, 'warning' as const]
    case Priority.LOW:
      return [UiIcon.PriorityLow, 'success' as const]
    }
  }, [priority])

  return (
    <PriorityContainer color={priorityColor} isSmall={isSmall} style={style} className={className}>
      <PriorityIcon size={1.5} />
    </PriorityContainer>
  )
}
export default styled(UiPriority)``

const PriorityContainer = styled.div<{ color: ColorName, isSmall: boolean }>`
  display: inline-flex;
  color: ${({ theme, color }) => theme.colors[color].value};
`

