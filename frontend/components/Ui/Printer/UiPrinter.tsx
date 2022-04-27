import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  renderContent: () => ReactNode
  loadData?: () => void | Promise<void>
  children: (props: ChildProps) => ReactNode
}

interface ChildProps {
  trigger: () => void
}

const UiPrinter: React.VFC<Props> = ({ renderContent, loadData, children }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [isLoading, setLoading] = useState(false)
  const [content, setContent] = useState<ReactNode | null>(null)

  const handleTrigger = useCallback(async () => {
    if (loadData) {
      setLoading(true)
      await loadData()
    }
    const content = renderContent()
    if (loadData) {
      setLoading(false)
    }
    setContent(content)
  }, [renderContent, loadData])

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
      <UiModal isOpen={isLoading} isPersistent noCloseButton>
        <UiModal.Body>
          <UiIcon.Loader isSpinner />
        </UiModal.Body>
      </UiModal>
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