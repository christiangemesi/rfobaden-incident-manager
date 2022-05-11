import React from 'react'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiButton from '@/components/Ui/Button/UiButton'
import styled from 'styled-components'

interface Props {
  currentOffset: number
  totalPages: number
  makeHref: (offset: number) => string
}

const UiPagination: React.VFC<Props> = ({ currentOffset, totalPages, makeHref }) => {
  return (
    <Pagination>
      <PaginationButton
        isCurrent={false}
        isDisabled={currentOffset === 0}
        href={currentOffset === 0 ? undefined : makeHref(currentOffset - 1)}
      >
        <UiIcon.Previous />
      </PaginationButton>
      
      {totalPages < 6 &&(
        [...Array(totalPages)].map((_element, i) => (
          <PaginationButton key={i} isCurrent={currentOffset === i} href={makeHref(i)}>
            {i + 1}
          </PaginationButton>
        ))
      )}

      {(totalPages > 5 && currentOffset < 3) && (
        <React.Fragment>
          {[...Array(4)].map((_element, i) => (
            <PaginationButton key={i} isCurrent={currentOffset === i} href={makeHref(i)}>
              {i + 1}
            </PaginationButton>
          ))}
          <MorePlaceholder>
            <UiIcon.More size={0.8} />
          </MorePlaceholder>
          <PaginationButton isCurrent={currentOffset === totalPages-1} href={makeHref(totalPages-1)}>
            {totalPages}
          </PaginationButton>
        </React.Fragment>
      )}

      {(totalPages > 5 && currentOffset > 2 && currentOffset < totalPages-3) && (
        <React.Fragment>
          <PaginationButton isCurrent={currentOffset === 0} href={makeHref(0)}>
            {1}
          </PaginationButton>
          <MorePlaceholder>
            <UiIcon.More size={0.8} />
          </MorePlaceholder>
          {[...Array(3)].map((_element, i) => {
            const iOffset = currentOffset-1 + i
            return (
              <PaginationButton key={iOffset} isCurrent={currentOffset === iOffset} href={makeHref(iOffset)}>
                {iOffset + 1}
              </PaginationButton>
            )
          })}
          <MorePlaceholder>
            <UiIcon.More size={0.8} />
          </MorePlaceholder>
          <PaginationButton isCurrent={currentOffset === totalPages-1} href={makeHref(totalPages-1)}>
            {totalPages}
          </PaginationButton>
        </React.Fragment>
      )}

      {(totalPages > 5 && currentOffset > totalPages-4) && (
        <React.Fragment>
          <PaginationButton isCurrent={currentOffset === 0} href={makeHref(0)}>
            {1}
          </PaginationButton>
          <MorePlaceholder>
            <UiIcon.More size={0.8} />
          </MorePlaceholder>
          {[...Array(4)].map((_element, i) => {
            const iOffset = totalPages-4 + i
            return (
              <PaginationButton key={iOffset} isCurrent={currentOffset === iOffset} href={makeHref(iOffset)}>
                {iOffset + 1}
              </PaginationButton>
            )
          })}
        </React.Fragment>
      )}

      {currentOffset === totalPages - 1 ? (
        <PaginationButton isCurrent={false} isDisabled={true}>
          <UiIcon.Next />
        </PaginationButton>
      ) : (
        <PaginationButton isCurrent={false} href={makeHref(currentOffset+1)}>
          <UiIcon.Next />
        </PaginationButton>
      )}
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
const PaginationButton = styled(UiButton)<{ isCurrent: boolean}>`
  margin: 0 0.1rem;
  min-width: 2rem;

  text-decoration: none;
  background: ${({ theme, isCurrent }) => isCurrent ? theme.colors.primary.value : theme.colors.secondary.value};
  color: ${({ theme, isCurrent }) => isCurrent ? theme.colors.primary.contrast : theme.colors.secondary.contrast};
`
const MorePlaceholder = styled.div`
  padding-top: 0.8rem;
`

