import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import styled from 'styled-components'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiIcon from '@/components/Ui/Icon/UiIcon'

interface Props {
  /**
   * Renders the content that will be printed.
   */
  renderContent: () => ReactNode

  /**
   * Load data required inside {@link renderContent}.
   * Invoked right before printing.
   */
  loadData?: () => void | Promise<void>

  /**
   * Renders elements that can control the print behavior.
   */
  children: (props: ChildProps) => ReactNode
}

/**
 * `ChildProps` are properties passed to the {@link Props.children} of a {@link UiPrinter}.
 */
interface ChildProps {
  /**
   * Causes the content to be printed.
   */
  trigger: () => void
}

/**
 * `UiPrinter` is a component that allows React elements to be printed.
 */
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
    documentTitle: 'RFOBaden Incident Manager',
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
  @media not print {
    display: none;
  }

  @page {
    margin: 0.75in;
  }
  
  button {
    display: none;
  }
`