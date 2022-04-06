import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import { useSession } from '@/stores/SessionStore'
import TransportStore from '@/stores/TransportStore'
import ReportStore from '@/stores/ReportStore'
import TaskStore from '@/stores/TaskStore'
import SubtaskStore from '@/stores/SubtaskStore'

const MeineAufgabenPage: React.VFC = () => {
  const { currentUser } = useSession()

  let usersTransports
  let usersReports
  let usersTasks
  let usersSubtasks
  if (currentUser != null) {
    usersTransports = TransportStore.list().filter((e) => e.assigneeId == currentUser?.id)
    usersReports = ReportStore.list().filter((e) => e.assigneeId == currentUser?.id)
    usersTasks = TaskStore.list().filter((e) => e.assigneeId == currentUser?.id)
    usersSubtasks = SubtaskStore.list().filter((e) => e.assigneeId == currentUser?.id)
  }

  return (
    <UiContainer>
      <UiTitle level={1}>Meine Aufgaben</UiTitle>
      <div id="hohe-prioritaet">

      </div>
      <div id="mittlere-prioritaet">

      </div>
      <div id="niedere-prioritaet">

      </div>
    </UiContainer>
  )
}
export default MeineAufgabenPage