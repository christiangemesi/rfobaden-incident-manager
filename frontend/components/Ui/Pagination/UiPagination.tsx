import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiButton from '@/components/Ui/Button/UiButton'
import styled, { css } from 'styled-components'

interface Props {
  currentOffset: number
  totalPages: number
  makeHref: (offset: number) => string
}

const UiPagination: React.VFC<Props> = ({ currentOffset, totalPages, makeHref }) => {
  const more = <MorePlaceholder><UiIcon.More size={0.8} /></MorePlaceholder>
  const prevMore = totalPages > 5 && currentOffset > 2 ? more : <React.Fragment />
  const nextMore = totalPages > 5 && currentOffset < totalPages - 3 ? more : <React.Fragment />
  const first = (
    <PaginationButton isActive={currentOffset === 0} href={makeHref(0)}>
      {1}
    </PaginationButton>
  )
  let center = undefined
  if (totalPages > 4) {
    center = [...Array(3)].map((_element, i) => {
      let iOffset = currentOffset - 1 + i
      if (currentOffset < 3) { // start
        iOffset = i + 1
      } else if(currentOffset > totalPages - 4) // end
      {
        iOffset = totalPages - 4 + i
      }
      return (
        <PaginationButton key={iOffset} isActive={currentOffset === iOffset} href={makeHref(iOffset)}>
          {iOffset + 1}
        </PaginationButton>
      )
    })
  } else {
    center = [...Array(totalPages - 2)].map((_element, i) => {
      const iOffset = i + 1
      return (
        <PaginationButton key={iOffset} isActive={currentOffset === iOffset} href={makeHref(iOffset)}>
          {iOffset + 1}
        </PaginationButton>
      )
    })
  }
  const last = (
    <PaginationButton isActive={currentOffset === totalPages - 1} href={makeHref(totalPages - 1)}>
      {totalPages}
    </PaginationButton>
  )

  return (
    <Pagination>
      <PaginationButton
        isActive={false}
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
        isActive={false}
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
  `}
`
const MorePlaceholder = styled.div`
  padding-top: 0.8rem;
`

