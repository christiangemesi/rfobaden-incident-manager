import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'


interface Props{
   //isFluid?: boolean
  children: ReactNode
 }

const UiHeader: React.VFC <Props> =({ children, }) =>{

  return (
    <header>
      <UiHeaderContainer>
        <StyliedImage>
          <Image src="/RFOBaden_Logo_RGB.svg" alt="RFO Baden Logo" width="150" height="21" />
        </StyliedImage>
        <div>
          {children}
        </div>

      </UiHeaderContainer>
    </header>
  )

}
export default UiHeader

const UiHeaderContainer = styled.div`
  display: inline-flex;
  width: 100%;
  height: 3rem;
  background: ${({ theme }) => theme.colors.secondary.value};
  //background: lightskyblue;
`
const StyliedImage = styled.div`
  display: inline-flex;
  justify-content: left;
  margin-left: 50px;
`