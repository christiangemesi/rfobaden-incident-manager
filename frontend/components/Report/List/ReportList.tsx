import React, { useMemo } from 'react'
import Report from '@/models/Report'
import ReportListItem from '@/components/Report/List/Item/ReportListItem'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import ReportForm from '@/components/Report/Form/ReportForm'
import Incident from '@/models/Incident'
import TrackableList from '@/components/Trackable/List/TrackableList'

interface Props extends StyledProps {
  /**
   * The incident the reports belongs to.
   */
  incident: Incident

  /**
   * The reports to display.
   */
  reports: readonly Report[]

  /**
   * The currently selected report.
   */
  selected?: Report | null

  /**
   * Event caused by selecting a report.
   */
  onSelect?: (report: Report) => void
}

/**
 * `ReportList` is a component that displays a list of {@link Report reports} using {@link ReportListItem}.
 * It offers a form to add new {@link Task tasks} to the report.
 */
const ReportList: React.VFC<Props> = ({
  incident,
  reports,
  ...listProps
}) => {
  const [keyReports, normalReports] = useMemo(function splitOfKeyReports() {
    return reports.reduce(([key, normal], report) => {
      if (report.isKeyReport) {
        key.push(report)
      } else {
        normal.push(report)
      }
      return [key, normal]
    }, [[] as Report[], [] as Report[]])
  }, [reports])

  return (
    <TrackableList
      {...listProps}
      incident={incident}
      records={[keyReports, normalReports]}
      formTitle="Meldung erfassen"
      renderForm={({ save, close }) => (
        <ReportForm incident={incident} onSave={save} onClose={close} />
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
