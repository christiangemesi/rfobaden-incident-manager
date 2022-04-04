import { ElementProps } from '@/utils/helpers/StyleHelper'
import { ReactNode } from 'react'
import styled from 'styled-components'
import UiLevelHeader from '@/components/Ui/Level/Header/UiLevelHeader'
import UiLevelContent from '@/components/Ui/Level/Content/UiLevelContent'

interface Props extends ElementProps<HTMLDivElement> {
  children: ReactNode
}

/**
 * `UiLevel` is a layout component that divides header data from content data.
 * Header and content data is displayed vertically after each other.
 * The header takes as much space as it needs, while the content takes the rest.
 *
 * @example
 * <UiLevel>
 *   <UiLevel.Header>
 *     ...
 *   </UiLevel.Header>
 *   <UiLevel.Content>
 *     ...
 *   </UiLevel.Content>
 * </UiLevel>
 */
const UiLevel = styled.div<Props>`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%; // Take full width.
  min-height: 100%;
  flex: 1; // Take full height if parent is a flex container.  
`

export default Object.assign(UiLevel, {
  Header: UiLevelHeader,
  Content: UiLevelContent,
})
