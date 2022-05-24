import SessionForm from '@/components/Session/Form/SessionForm'
import React from 'react'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'
import styled from 'styled-components'
import Page from '@/components/Page/Page'
import Image from 'next/image'
import logo from '@/public/rfobaden-logo-text.png'

interface Props {
  /**
   * Array index of image to display in the background.
   */
  imageIndex: number
}

/**
 * `AnmeldenPage` is a page that shows a {@link SessionForm login form}.
 */
const AnmeldenPage: React.VFC<Props> = ({ imageIndex }) => {
  return (
    <Page noHeader noFooter>
      <CenterContainer>
        <Center>
          <LogoContainer>
            <Image src={logo} alt="RFO Baden" width="300" height="42" />
          </LogoContainer>
          <SessionForm />
          <BackgroundContainer image={images[imageIndex]} />
        </Center>
      </CenterContainer>
    </Page>
  )
}
export default AnmeldenPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = getSessionFromRequest(req)
  if (user !== null) {
    return { redirect: { statusCode: 302, destination: '/' }}
  }

  // Calculate background image index.
  const index = Math.floor(Math.random() * images.length)

  return {
    props: {
      imageIndex: index,
    },
  }
}

/**
 * Possible background images to show.
 */
const images = [
  '/assets/background1.jpg',
  '/assets/background2.jpg',
  '/assets/background3.jpg',
]

const LogoContainer = styled.div`
  margin-bottom: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.tertiary.value};
  z-index: 0;
  padding: 3rem;
  box-shadow: 0 0 4px 1px ${({ theme }) => theme.colors.tertiary.contrast}
`

const CenterContainer = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`

const Center = styled.div`
  margin: auto 0;
  padding-bottom: 2rem;
  width: 100%;
`

const BackgroundContainer = styled.div<{ image: string }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: url('${({ image }) => image}') center center no-repeat;
  background-size: cover;
  filter: brightness(40%) grayscale(20%);
  z-index: -1;
  overflow: hidden;
`
