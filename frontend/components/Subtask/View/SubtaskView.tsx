import Subtask from '@/models/Subtask'
import React from 'react'
import { useUser } from '@/stores/UserStore'
import styled from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiModal from '@/components/Ui/Modal/UiModal'
import UiTextWithIcon from '@/components/Ui/TextWithIcon/UiTextWithIcon'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import Task from '@/models/Task'
import Report from '@/models/Report'
import Incident from '@/models/Incident'
import { contrastDark } from '@/theme'
import BackendService from '@/services/BackendService'
import { useUsername } from '@/models/User'
import TaskStore from '@/stores/TaskStore'
import SubtaskStore from '@/stores/SubtaskStore'


interface Props {
  incident: Incident
  report: Report
  task: Task
  subtask: Subtask
}

const SubtaskView: React.VFC<Props> = ({ subtask, task, report, incident }) => {
  const assignee = useUser(subtask.assigneeId)
  const assigneeName = useUsername(assignee)

  const startDate = subtask.startsAt !== null ? subtask.startsAt : subtask.createdAt

  const handleDelete = async () => {
    if (confirm(`Sind sie sicher, dass sie den Teilauftrag "${subtask.title}" schliessen wollen?`)) {
      await BackendService.delete(`incidents/${incident.id}/reports/${report.id}/tasks/${task.id}/subtasks`, subtask.id)

      // todo what about report and incident? also updating or leaving

      SubtaskStore.remove(subtask.id)
    }
  }

  return (
    <Details>
      <Line />
      <TitleIconContainer>
        <UiTitle level={2}>
          {subtask.title}
        </UiTitle>
        <UiIconButtonGroup>
          <UiIconButton onClick={() => alert('not yet implemented')}>
            <UiIcon.PrintAction />
          </UiIconButton>

          <UiModal isFull>
            <UiModal.Activator>{({ open }) => (
              <UiIconButton onClick={open}>
                <UiIcon.EditAction />
              </UiIconButton>
            )}</UiModal.Activator>
            <UiModal.Body>{({ close }) => (
              <React.Fragment>
                <UiTitle level={1} isCentered>
                  Teilauftrag bearbeiten
                </UiTitle>
                <SubtaskForm incident={incident} report={report} task={task} subtask={subtask} onClose={close} />
              </React.Fragment>
            )}</UiModal.Body>
          </UiModal>

          <UiIconButton onClick={handleDelete}>
            <UiIcon.DeleteAction />
          </UiIconButton>
        </UiIconButtonGroup>
      </TitleIconContainer>

      <UiDateLabel start={startDate} end={subtask.endsAt} />


      {assigneeName && (
        <UiTextWithIcon text={assigneeName}>
          <UiIcon.UserInCircle />
        </UiTextWithIcon>
      )}
      <BlockContainer>
        {subtask.description}
      </BlockContainer>
    </Details>
  )
}

export default SubtaskView

const TitleIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Line = styled.div`
  height: 2px;
  background: ${contrastDark};
  margin-bottom: 2rem;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const BlockContainer = styled.div`
  width: 100%;
`
