import React from 'react'
import { FileId } from '@/models/FileUpload'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'

interface Props {
  src: string
  id: FileId
  onDelete: (id: FileId) => void
}

const DocumentItem: React.VFC<Props> = ({
  src = '',
  id,
  onDelete,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }
  return (
    <FileText href={src} download>
      <DocumentListItem>
        <UiGrid style={{ padding: '0 0.5rem' }} align="center" gapH={0.5}>
          <UiGrid.Col size={8}>
            {'File with ID: ' + id}
          </UiGrid.Col>
          <UiGrid.Col size={3}>
            <p>PDF</p>
          </UiGrid.Col>
          <UiGrid.Col size={1}>
            <DeleteButton onClick={handleDelete}><UiIcon.Trash /></DeleteButton>
          </UiGrid.Col>
        </UiGrid>
      </DocumentListItem>
    </FileText>
  )
}

export default DocumentItem

const DeleteButton = styled(UiIconButton)`
  visibility: hidden;
  color: ${({ theme }) => theme.colors.secondary.contrast};
`

const FileText = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
  text-decoration: none;
`

const DocumentListItem = styled(UiListItem)`
  :hover {
    & * ${DeleteButton} {
      visibility: visible;
    }
  }
`

