import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React from 'react'
import styled from 'styled-components'
import { GetServerSideProps } from 'next'
import { useAppState } from '@/pages/_app'
import { useEffectOnce } from 'react-use'

interface Props {
  imageIndex: number
}

const AnmeldenPage: React.VFC<Props> = ({ imageIndex }) => {
  const [_, setAppState] = useAppState()

  useEffectOnce(() => {
    setAppState({ hasHeader: false, hasFooter: false })
  })

  return (
    <CenterContainer>
      <LogoContainer>
        <Logo src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="300" height="42" />
      </LogoContainer>
      <SessionForm />
      <BackgroundContainer image={images[imageIndex]} />
    </CenterContainer>
  )
}
export default AnmeldenPage

const images = [
  '/assets/background1.jpg',
  '/assets/background2.jpg',
  '/assets/background3.jpg',
  // '/assets/bg1.jpeg',
  // '/assets/bg2.jpeg',
  // '/assets/bg3.jpeg',
  // '/assets/bg4.jpeg',
]

const Logo = styled.img`
  display: block;
`
const LogoContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.tertiary.value};
  z-index: 0;
  padding: 1rem;
  box-shadow: 0 0 4px 4px ${({ theme }) => theme.colors.tertiary.value};
`
const CenterContainer = styled(UiContainer)`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
`
const BackgroundContainer = styled.div<{ image: string }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: url('${({ image }) => image}') center center no-repeat;
  background-size: cover;
  filter: brightness(30%) grayscale(20%);
  z-index: -1;
  overflow: hidden;
`

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const index = Math.floor(Math.random() * images.length)
  return {
    props: {
      imageIndex: index,
    },
  }
}