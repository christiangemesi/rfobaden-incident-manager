import React, { ReactNode } from 'react'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  type: 'Success' | 'info' | 'Warning' | 'Error'
  timeout: number
  children: ReactNode
}

const Alert : React.VFC<Props> = () => {
  return <div>
    <UiTitle level={6}>Title</UiTitle>
  </div>
}

export default Alert