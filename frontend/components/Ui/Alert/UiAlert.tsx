import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  type: 'Success' | 'info' | 'Warning' | 'Error'
  timeout: number
  children: ReactNode
}

const UiAlert: React.VFC<Props> = () => {
  return (
    <Container>
      <div>
        <UiIcon.AlertCircle />
      </div>
      <div>
        <UiTitle level={6}>Title</UiTitle>
      </div>
    </Container>
  )
}

export default UiAlert

const Container = styled.div`
  display: inline-flex;
  background: blue;
  opacity: 90%;
  padding: 0.5rem;
  border-radius: 5px;
  
`