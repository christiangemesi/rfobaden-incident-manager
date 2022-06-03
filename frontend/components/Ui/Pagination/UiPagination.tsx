import React, { useMemo } from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiButton from '@/components/Ui/Button/UiButton'
import styled, { css } from 'styled-components'

interface Props {
  /**
   * The current offset indicates which page is currently active.
   */
  currentOffset: number

  /**
   * The amount of all pages.
   */
  totalPages: number

  /**
   * Event caused by creating a path to its resource.
   */
  makeHref: (offset: number) => string
}

/**
 * `UiPagination` is a component that indicates a series of related content exists across multiple pages.
 */
const UiPagination: React.VFC<Props> = ({ currentOffset, totalPages, makeHref }) => {
  const more = <MorePlaceholder><UiIcon.More size={0.8} /></MorePlaceholder>
  const prevMore = totalPages > 5 && currentOffset > 2 ? more : <React.Fragment />
  const nextMore = totalPages > 5 && currentOffset < totalPages - 3 ? more : <React.Fragment />
  const first = (
    <PaginationButton isActive={currentOffset === 0} href={makeHref(0)}>
      {1}
    </PaginationButton>
  )
  const center = useMemo(() => {
    if (totalPages > 4) {
      let baseOffset = currentOffset - 1
      if (currentOffset < 3) { // start
        baseOffset = 1
      } else if(currentOffset > totalPages - 4) { // end
        baseOffset = totalPages - 4
      }
      return [...Array(3)].map((_element, i) => {
        const iOffset = baseOffset + i
        return (
          <PaginationButton key={iOffset} isActive={currentOffset === iOffset} href={makeHref(iOffset)}>
            {iOffset + 1}
          </PaginationButton>
        )
      })
    } else if (totalPages > 2){
      return [...Array(totalPages - 2)].map((_element, i) => {
        const iOffset = i + 1
        return (
          <PaginationButton key={iOffset} isActive={currentOffset === iOffset} href={makeHref(iOffset)}>
            {iOffset + 1}
          </PaginationButton>
        )
      })
    }
  }, [currentOffset, makeHref, totalPages])

  const last = totalPages > 1 ? (
    <PaginationButton isActive={currentOffset === totalPages - 1} href={makeHref(totalPages - 1)}>
      {totalPages}
    </PaginationButton>
  ) : undefined

  return (
    <Pagination>
      <PaginationButton
        isDisabled={currentOffset === 0}
        href={currentOffset === 0 ? undefined : makeHref(currentOffset - 1)}
      >
        <UiIcon.Previous />
      </PaginationButton>
      {first}
      {prevMore}
      {center}
      {nextMore}
      {last}
      <PaginationButton
        isDisabled={currentOffset === totalPages - 1}
        href={currentOffset === totalPages - 1 ? undefined : makeHref(currentOffset + 1)}
      >
        <UiIcon.Next />
      </PaginationButton>
    </Pagination>
  )
}
export default UiPagination

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
`
const PaginationButton = styled(UiButton)<{ isActive?: boolean}>`
  margin: 0 0.1rem;
  min-width: 2rem;

  text-decoration: none;
  
  ${({ theme, isActive }) => isActive ? css`
    background: ${theme.colors.primary.value};
    color: ${theme.colors.primary.contrast};
  ` : css`
    background: ${theme.colors.secondary.value};
    color: ${theme.colors.secondary.contrast};
    
    :hover:not(&[disabled]) {
      background: ${({ theme }) => theme.colors.secondary.hover};
    }
  `}
  
`
const MorePlaceholder = styled.div`
  padding-top: 0.8rem;
`
