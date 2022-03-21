import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'

const AnmeldenPage: React.VFC = () => {
  const images = [
    '/assets/background1.jpg',
    '/assets/background2.jpg',
    '/assets/background3.jpg',
    // '/assets/bg1.jpeg',
    // '/assets/bg2.jpeg',
    // '/assets/bg3.jpeg',
    // '/assets/bg4.jpeg',
  ]
  const index = useMemo(() => (
    Math.floor(Math.random() * images.length)
  ), [images.length])
  const image = images[index]
  console.log('loaded Bg-Image', index, image)

  return (
    <Fragment>
      <CenterContainer>
        <SessionForm />
      </CenterContainer>
      <BackgroundContainer image={image} />
    </Fragment>
  )
}
export default AnmeldenPage

const CenterContainer = styled(UiContainer)`
  height: 100%;
  position: relative;
`
const BackgroundContainer = styled.div<{ image: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(${({ image }) => image}) black center center no-repeat;
  background-size: cover;
  z-index: -1;
  overflow: hidden;
  filter: brightness(30%) grayscale(20%);
`