import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiModal from '@/components/Ui/Modal/UiModal'
import { FileId } from '@/models/FileUpload'

interface Props {
  src: string
  text: string
  id: FileId
  onDelete: (id: FileId) => void
}

const UiImage: React.VFC<Props> = ({
  src = '',
  text = '',
  id,
  onDelete,
}) => {

  const deleteCallback = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <UiModal>
      <UiModal.Trigger>{({ open }) => (
        <ImageCard onClick={open}>
          <ImageArea>
            <div>
              <Image src={src} width={200} height={200} alt="Kein Bild" />
            </div>
            <DeleteButton onClick={deleteCallback}><UiIcon.Trash /></DeleteButton>
          </ImageArea>
          <TextArea>
            {text}
          </TextArea>
        </ImageCard>
      )}</UiModal.Trigger>
      <UiModal.Body>
        <Image src={src} width={1280} height={720} objectFit="contain" alt="Kein Bild" />
      </UiModal.Body>
    </UiModal>
  )
}

export default UiImage

const ImageCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);

    & > div {
      & > button {
        visibility: visible;
      }

      & > div {
        filter: opacity(50%);
      }
    }
  }
`

const DeleteButton = styled(UiIconButton)`
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
`

const TextArea = styled.div`
  padding: 8px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`
const ImageArea = styled.div`
  position: relative;
`