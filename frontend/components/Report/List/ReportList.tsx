import React, { useMemo } from 'react'
import Report from '@/models/Report'
import UiList from '@/components/Ui/List/UiList'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled from 'styled-components'
import useBreakpoint from '@/utils/hooks/useBreakpoints'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import Incident from '@/models/Incident'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'

interface Props extends StyledProps {
  incident: Incident
  reports: readonly Report[]
  selected?: Report | null,
  onSelect?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({
  incident,
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
      <UiModal isFull>
        <UiModal.Activator>{({ open }) => (
          <UiCreateButton onClick={open} title="Meldung erfassen">
            <UiIcon.CreateAction size={1.5} />
          </UiCreateButton>
        )}</UiModal.Activator>
        <UiModal.Body>{({ close }) => (
          <React.Fragment>
            <UiTitle level={1} isCentered>
              Meldung erfassen
            </UiTitle>
            <ReportForm incident={incident} onSave={handleSelect} onClose={close} />
          </React.Fragment>
        )}</UiModal.Body>
      </UiModal>

      {keyReports.length !== 0 && (
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
      )}

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
  gap: 1rem;
`
