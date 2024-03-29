import React, { useCallback, useMemo } from 'react'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import SubtaskStore from '@/stores/SubtaskStore'
import styled from 'styled-components'
import { Themed } from '@/theme'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import BackendService from '@/services/BackendService'
import Task from '@/models/Task'
import UiDrawer from '@/components/Ui/Drawer/UiDrawer'
import SubtaskForm from '@/components/Subtask/Form/SubtaskForm'
import UiCreateButton from '@/components/Ui/Button/UiCreateButton'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import { useIncident } from '@/stores/IncidentStore'
import UiListItem from '@/components/Ui/List/Item/UiListItem'


interface Props {
  task: Task
  subtasks: Subtask[]
  onClick?: (subtask: Subtask) => void
}

const SubtaskList: React.VFC<Props> = ({
  task,
  subtasks,
  onClick: handleClick,
}) => {
  const [openSubtasks, closedSubtasks] = useMemo(() => (
    subtasks.reduce(([open, closed], subtask) => {
      if (subtask.isClosed) {
        closed.push(subtask)
      } else {
        open.push(subtask)
      }
      return [open, closed]
    }, [[] as Subtask[], [] as Subtask[]])

  ), [subtasks])

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (result.destination == null) {
      return
    }
    const subtask = SubtaskStore.find(parseInt(result.draggableId))
    if (subtask === null) {
      throw new Error(`unknown subtask id: ${result.draggableId}`)
    }
    const [isClosed, index] = result.destination.droppableId === LIST_CLOSED_ID
      ? [true, result.destination.index + openSubtasks.length - 1]
      : [false, result.destination.index]
    SubtaskStore.save({ ...subtask, isClosed }, { index })
    if (isClosed !== subtask.isClosed) {
      const [updatedSubtask, error] = await BackendService.update<Subtask>(`incidents/${subtask.incidentId}/reports/${subtask.reportId}/tasks/${subtask.taskId}/subtasks`, subtask.id, {
        ...subtask,
        isClosed,
      })
      if (error !== null) {
        throw error
      }
      SubtaskStore.save(parseSubtask(updatedSubtask), { index })
    }
  }, [openSubtasks])

  const incident = useIncident(task.incidentId)
  if(incident === null) {
    throw new Error('incident not found')
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container>
        <Side>
          <UiCaption>
            offene Teilaufträge
          </UiCaption>

          {!incident.isClosed &&
          <UiDrawer title="Teilauftrag erfassen" size="fixed">
            <UiDrawer.Trigger>{({ open }) => (
              <UiCreateButton onClick={open} title="Teilauftrag erfassen" style={{ marginBottom: '1rem' }}>
                <UiIcon.CreateAction size={1.5} />
              </UiCreateButton>
            )}</UiDrawer.Trigger>
            <UiDrawer.Body>{({ close }) => (
              <SubtaskForm task={task} onClose={close} />
            )}</UiDrawer.Body>
          </UiDrawer>}

          <Droppable droppableId={LIST_OPEN_ID}>{(provided) => (
            <DropTarget
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <List>
                {openSubtasks.map((subtask, i) => (
                  <Draggable key={subtask.id} draggableId={subtask.id.toString()} index={i}>{(provided, snapshot) => (
                    <SubtaskListItem
                      task={task}
                      subtask={subtask}
                      onClick={handleClick}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}</Draggable>
                ))}
              </List>
              {provided.placeholder}
            </DropTarget>
          )}</Droppable>
        </Side>

        <Side>
          <UiCaption>
            abgeschlossene Teilaufträge
          </UiCaption>

          <Droppable droppableId={LIST_CLOSED_ID}>{(provided) => (
            <DropTarget
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <List>
                {closedSubtasks.map((subtask, i) => (
                  <Draggable key={subtask.id} draggableId={subtask.id.toString()} index={i}>{(provided, snapshot) => (
                    <SubtaskListItem
                      task={task}
                      subtask={subtask}
                      onClick={handleClick}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}</Draggable>
                ))}
              </List>
              {provided.placeholder}
            </DropTarget>
          )}</Droppable>
        </Side>
      </Container>
    </DragDropContext>
  )
}
export default SubtaskList

const LIST_OPEN_ID = 'list-open'
const LIST_CLOSED_ID = 'list-closed'

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  min-height: 100%;
  column-gap: 2rem;
  padding: 4px 4px 0 4px;
  
  width: 100%;  
  ${Themed.media.sm.max} {
    width: 180%;
    flex-shrink: 0;
  }
`

const Side = styled.div`
  width: calc(50% - 1rem);
  height: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.grey.value};

  & > ${UiCaption}:first-child {
    margin-bottom: 0.5rem;
  }
`

const DropTarget = styled.div`
  height: 100%;
  width: 100%;
  
  max-height: 100%;
`

const List = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  padding-top: 0.5rem;

  width: 100%;

  div:first-child > ${UiListItem} {
    &, :after {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }
  }

  div:last-child > ${UiListItem} {
    &, :after {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
`