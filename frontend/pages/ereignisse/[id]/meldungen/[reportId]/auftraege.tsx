import React from 'react'
import TaskForm from '@/components/Task/Form/TaskForm'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Task, { parseTask } from '@/models/Task'
import TaskList from '@/components/Task/List/TaskList'
import Incident from '@/models/Incident'
import Report from '@/models/Report'
import { useEffectOnce } from 'react-use'
import { useReport, useReports } from '@/stores/ReportStore'
import { useIncident } from '@/stores/IncidentStore'
import TaskStore, { useTasksOfReport } from '@/stores/TaskStore'

interface Props {
  data: {
    incident: Incident
    report: Report
    tasks: Task[]
  }
}

const AuftraegePage: React.VFC<Props> = ({ data }) => {
  useEffectOnce(() => {
    TaskStore.saveAll(data.tasks.map(parseTask))
  })

  const incident = useIncident(data.incident)
  const report = useReport(data.report)
  const tasks = useTasksOfReport(report.id)

  return (
    <div>
      <TaskForm incident={incident} report={report} />
      <TaskList tasks={tasks} />
    </div>
  )
}
export default AuftraegePage


type Query = {
  id: string
  reportId: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  if (params === undefined) {
    throw new Error('params is undefined')
  }

  const incidentId = parseInt(params.id)
  if(isNaN(incidentId)){
    return {
      notFound: true,
    }
  }

  const reportId = parseInt(params.reportId)
  if(isNaN(reportId)){
    return {
      notFound: true,
    }
  }

  const [incident, incidentError]: BackendResponse<Incident> = await BackendService.find(
    `incidents/${incidentId}`
  )
  if (incidentError !== null) {
    throw incidentError
  }

  const [report, reportError]: BackendResponse<Report> = await BackendService.find(
    `incidents/${incidentId}/reports/${reportId}`
  )
  if (reportError !== null) {
    throw reportError
  }

  const [tasks, tasksError]: BackendResponse<Task[]> = await BackendService.list(
    `incidents/${incidentId}/reports/${reportId}/tasks`
  )
  if (tasksError !== null) {
    throw tasksError
  }

  return {
    props: {
      data: {
        incident,
        report,
        tasks,
      },
    },
  }
}