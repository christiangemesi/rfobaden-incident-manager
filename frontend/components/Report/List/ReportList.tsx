import React, { useMemo } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled from 'styled-components'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { StyledProps } from '@/utils/helpers/StyleHelper'

interface Props extends StyledProps {
  reports: readonly Report[]
  selected?: Report | null,
  onSelect?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({
  reports: reports,
  selected = null,
  onSelect: handleSelect,
  style,
  className,
}) => {
  const [keyReports, normalReports] = useMemo(() => (
    reports.reduce(([key, normal], report) => {
      if (report.isKeyReport) {
        key.push(report)
      } else {
        normal.push(report)
      }
      return [key, normal]
    }, [[] as Report[], [] as Report[]])
  ), [reports])

  const canListBeSmall = useBreakpoint(() => ({
    xs: false,
    xl: true,
  }))
  return (
    <ListContainer style={style} className={className}>
      <UiList>
        {keyReports.map((report) => (
          <ReportListItem
            key={report.id}
            report={report}
            isActive={selected?.id === report.id}
            isSmall={canListBeSmall && selected !== null}
            onClick={handleSelect}
          />
        ))}
      </UiList>

      <UiList>
        {normalReports.map((report) => (
          <ReportListItem
            key={report.id}
            report={report}
            isActive={selected?.id === report.id}
            isSmall={canListBeSmall && selected !== null}
            onClick={handleSelect}
          />
        ))}
      </UiList>
    </ListContainer>
  )
}
export default styled(ReportList)``

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
