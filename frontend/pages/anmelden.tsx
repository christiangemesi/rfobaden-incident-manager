import UiContainer from '@/components/Ui/Container/UiContainer'
import SessionForm from '@/components/Session/Form/SessionForm'
import React from 'react'
import { GetServerSideProps } from 'next'
import { getSessionFromRequest } from '@/services/BackendService'
import styled from 'styled-components'
import Page from '@/components/Page/Page'
import Image from 'next/image'
import logo from '@/public/rfobaden-logo-text.png'
import { Themed } from '@/theme'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  imageIndex: number
}

const AnmeldenPage: React.VFC<Props> = ({ imageIndex }) => {
  return (
    <Page noHeader noFooter>
      <CenterContainer>
        <LogoContainer>
          <Image src={logo} alt="RFO Baden" width="300" height="42" />
        </LogoContainer>
        <SessionForm />
        <BackgroundContainer image={images[imageIndex]} />
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

  const index = Math.floor(Math.random() * images.length)
  return {
    props: {
      imageIndex: index,
    },
  }
}

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
  box-shadow: 0 0 4px 1px ${({ theme }) => theme.colors.tertiary.contrast};

  @media (max-height: ${({ theme }) => theme.breakpoints.sm.min}px) {
    margin-bottom: 2rem;
    padding: 2rem;

    img {
      transform: scale(80%);
    }
    
    + ${UiTitle} {
      margin-bottom: 1.5rem;
    }
  }
`

const CenterContainer = styled(UiContainer)`
  min-height: 370px;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
  margin-bottom: 2rem;

  @media (max-height: ${({ theme }) => theme.breakpoints.sm.min}px) {
    padding-bottom: 0;

    ${Themed.media.xs.max} {
      margin-top: -5rem;
    }
  }
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
