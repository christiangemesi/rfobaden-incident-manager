import React from 'react'
import { FileId, getDocumentUrl } from '@/models/FileUpload'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'

interface Props {
  id: FileId
  onDelete: (id: FileId) => void
}

const DocumentListItem: React.VFC<Props> = ({
  id,
  onDelete,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(id)
  }
  return (
    <DownloadLink href={getDocumentUrl(id)} target="_blank" download>
      <Item>
        <UiGrid style={{ padding: '0 0.5rem' }} align="center" gapH={0.5}>
          <UiGrid.Col size={8}>
            File with ID: {id}
          </UiGrid.Col>
          <UiGrid.Col size={3}>
            <p>PDF</p>
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
  }
`

