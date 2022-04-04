import React, { useMemo } from 'react'
import Report from '@/models/Report'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import UiTitle from '@/components/Ui/Title/UiTitle'
import ReportForm from '@/components/Report/Form/ReportForm'
import Incident from '@/models/Incident'
import TrackableList from '@/components/Trackable/List/TrackableList'

interface Props extends StyledProps {
  incident: Incident
  reports: readonly Report[]
  selected?: Report | null,
  onSelect?: (report: Report) => void
}

const ReportList: React.VFC<Props> = ({
  incident,
  reports,
  ...listProps
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

  return (
    <TrackableList
      {...listProps}
      records={[keyReports, normalReports]}
      renderForm={({ save, close }) => (
        <React.Fragment>
          <UiTitle level={1} isCentered>
            Meldung erfassen
          </UiTitle>
          <ReportForm incident={incident} onSave={save} onClose={close} />
        </React.Fragment>
      )}
      renderItem={({ record, ...itemProps }) => (
        <ReportListItem
          {...itemProps}
          record={record}
          isClosed={record.isClosed || record.isDone}
        />
      )}
    />
  )
}
export default styled(ReportList)``
