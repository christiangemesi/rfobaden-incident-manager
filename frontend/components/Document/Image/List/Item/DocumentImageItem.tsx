import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import Document, { getImageUrl } from '@/models/Document'

interface Props {
  /**
   * The {@link Document image} to be displayed.
   */
  image: Document

  /**
   * Event caused by deleting a {@link Document image}.
   */
  onDelete: (image: Document) => void
}

/**
 * `DocumentImageItem` is a component to display {@link Document image} values in a list.
 */
const DocumentImageItem: React.VFC<Props> = ({
  image,
  onDelete,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(image)
  }

  const src = getImageUrl(image)

  return (
    <UiModal>
      <UiModal.Trigger>{({ open }) => (
        <ImageCard onClick={open}>
          <ImageThumbnail>
            <Image src={src} width={200} height={200} alt={src} />
          </ImageThumbnail>
          <DeleteButton onClick={handleDelete}><UiIcon.Trash /></DeleteButton>
          <ImageName>
            {image.name}
          </ImageName>
        </ImageCard>
      )}</UiModal.Trigger>
      <UiModal.Body>
        <Image src={src} width={1280} height={720} objectFit="contain" alt={src} />
      </UiModal.Body>
    </UiModal>
  )
}

export default DocumentImageItem

const DeleteButton = styled(UiIconButton)`
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.secondary.contrast};
`

const ImageName = styled.div`
  padding: 0.5rem 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
`

const ImageThumbnail = styled.div` 
  position: relative;
  transition: 250ms ease;
  transition-property: opacity;
`

const ImageCard = styled.div`
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  position: relative;


  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    & > ${DeleteButton} {
      visibility: visible;
    }
    & > ${ImageThumbnail} {
      opacity: 50%;
    }
  }
`


