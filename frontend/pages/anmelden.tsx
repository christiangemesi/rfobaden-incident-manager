import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'

const AnmeldenPage: React.VFC = () => {
  const images = useMemo(() => (
    [
      '/assets/background1.jpg',
      '/assets/background2.jpg',
      '/assets/background3.jpg',
      // '/assets/bg1.jpeg',
      // '/assets/bg2.jpeg',
      // '/assets/bg3.jpeg',
      // '/assets/bg4.jpeg',
    ]
  ), [])

  // todo st not finished loading - image not shown
  const index = Math.floor(Math.random() * images.length)
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
  height: 100vh;
  width: 100vw;
  background: url(${({ image }) => image}) center center no-repeat;
  background-size: cover;
  filter: brightness(30%) grayscale(20%);
  z-index: -1;
  overflow: hidden;
`