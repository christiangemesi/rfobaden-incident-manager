import React from 'react'
import TaskForm from '@/components/Task/Form/TaskForm'
import { GetServerSideProps } from 'next'
import BackendService, { BackendResponse } from '@/services/BackendService'
import Task from '@/models/Task'
import { parseDate } from '@/models/Date'

interface Props {
  data: {
    tasks: Task[]
  }
}

const AuftraegePage: React.VFC<Props> = ({ data }) => {
  const tasks = data.tasks.map((task) => ({
    ...task,
    createdAt: parseDate(task.createdAt),
    updatedAt: parseDate(task.updatedAt),
  }))
  return (
    <div>
      <TaskForm />
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

  const [tasks, tasksError]: BackendResponse<Task[]> = await BackendService.list(
    `incidents/${incidentId}/reports/${reportId}/tasks`
  )
  if (tasksError !== null) {
    throw tasksError
  }

  return {
    props: {
      data: {
        tasks,
      },
    },
  }
}