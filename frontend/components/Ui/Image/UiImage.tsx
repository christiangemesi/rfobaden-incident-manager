import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'


interface Props {
  src: string
  text: string
}

const UiImage: React.VFC<Props> = ({
  src = '',
  text = '',
}) => {

  const deleteImage = () => {
    // TODO
    console.error('Operation not supported yet')
  }

  return (
    <ImageCard>
      <Image src={src} width={200} height={200} alt="Kein Bild" />
      <TextArea>
        {text}
        <DeleteButton onClick={deleteImage}><UiIcon.Trash /></DeleteButton>
      </TextArea>
    </ImageCard>
  )
}

export default UiImage

const ImageCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;

  :hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    & > div {
      & > button {
        visibility: visible;
      }
    }
  }
`

const DeleteButton = styled(UiIconButton)`
  visibility: hidden;
  transition: 250ms;
  transition-property: visibility;
`

const TextArea = styled.div`
  padding: 8px 16px;
`