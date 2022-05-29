import React from 'react'
import Document, { getDocumentUrl } from '@/models/Document'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'

interface Props {
  /**
   * The {@link Document} to be displayed.
   */
  document: Document

  /**
   * Event caused by deleting a {@link Document}.
   */
  onDelete: (document: Document) => void
}

/**
 * `DocumentListItem` is a component to display {@link Document} values in a list.
 */
const DocumentListItem: React.VFC<Props> = ({
  document,
  onDelete,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(document)
  }
  return (
    <DownloadLink href={getDocumentUrl(document)} target="_blank">
      <Item>
        <UiGrid style={{ padding: '0 0.5rem' }} align="center" gapH={0.5}>
          <UiGrid.Col size={8}>
            {document.name}
          </UiGrid.Col>
          <UiGrid.Col size={3}>
            {document.extension}
          </UiGrid.Col>
          <UiGrid.Col size={1}>
            <DeleteButton onClick={handleDelete}><UiIcon.Trash /></DeleteButton>
          </UiGrid.Col>
        </UiGrid>
      </Item>
    </DownloadLink>
  )
}

export default DocumentListItem

const DeleteButton = styled(UiIconButton)`
  visibility: hidden;
  color: ${({ theme }) => theme.colors.secondary.contrast};
`

const DownloadLink = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
  text-decoration: none;
`

const Item = styled(UiListItem)`
  :hover {
    & * ${DeleteButton} {
      visibility: visible;
    } 
    background-color: ${({ theme }) => theme.colors.secondary.hover};
  }
`

