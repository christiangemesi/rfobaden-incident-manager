import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'

interface Props {
  renderContent: () => ReactNode
  children: (props: ChildProps) => ReactNode
}

interface ChildProps {
  trigger: () => void
}

const UiPrinter: React.VFC<Props> = ({ renderContent, children }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [content, setContent] = useState<ReactNode | null>(null)

  const handleTrigger = useCallback(() => {
    setContent(renderContent())
  }, [renderContent])

  const triggerPrint = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint() {
      setContent(null)
    },
  })

  useEffect(function resetContent() {
    const { current: contentElement } = contentRef
    if (content !== null && contentElement !== null) {
      triggerPrint()
    }
  }, [content, triggerPrint])

  return (
    <React.Fragment>
      {children({ trigger: handleTrigger })}
      {content !== null && (
        <Content ref={contentRef}>
          {content}
        </Content>
      )}
    </React.Fragment>
  )
}
export default UiPrinter

const Content = styled(UiContainer)`
  margin: 4rem;
  
  @media not print {
    display: none;
  }
`