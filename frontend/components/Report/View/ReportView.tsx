import Report from '@/models/Report'
import React, { ReactNode, Ref } from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'

interface Props {
  report: Report
  innerRef?: Ref<HTMLDivElement>
}

const ReportView: React.VFC<Props> = ({ report, innerRef }) => {
  return (
    <Container ref={innerRef}>
      <h1>
        {report.title}
      </h1>
      <div style={{ width: '100%' }}>
        <UiGrid style={{ justifyContent: 'center' }}>
          <UiGrid.Col size={{ md: 8, lg: 5 }}>
            <div style={{ marginTop: '1rem' }} />
            <Info name="erstellt am">
              {report.createdAt.toLocaleString()}
            </Info>
            <Info name="zuletzt bearbeitet am">
              {report.updatedAt.toLocaleString()}
            </Info>
            <Info name="gedruckt am" className="print-only">
              {new Date().toLocaleString()}
            </Info>
          </UiGrid.Col>
        </UiGrid>
      </div>
      <article style={{ marginTop: '1.5rem' }}>
        {report.description}
      </article>
    </Container>
  )
}
export default ReportView

interface InfoProp {
  name: string
  children: ReactNode
  className?: string
}

const Info: React.VFC<InfoProp> = ({ name, children, className }) => {
  return (
    <UiGrid gap={1} className={className}>
      <UiGrid.Col size={6} style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: 600 }}>
          {name}
        </span>
      </UiGrid.Col>
      <UiGrid.Col>
        {children}
      </UiGrid.Col>
    </UiGrid>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`
