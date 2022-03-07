import React, { useCallback, useMemo, useState } from 'react'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import SubtaskStore from '@/stores/SubtaskStore'
import styled from 'styled-components'
import { Themed } from '@/theme'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import BackendService from '@/services/BackendService'


interface Props {
  subtasks: Subtask[]
  onClick?: (subtask: Subtask) => void
}

const SubtaskList: React.VFC<Props> = ({
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

  const [isDragInProgress, setDragInProgress] = useState(false)

  const handleDragStart = useCallback(() => {
    setDragInProgress(true)
  }, [])

  const handleDragEnd = useCallback(async (result: DropResult) => {
    setDragInProgress(false)
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

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container>
        <Droppable droppableId={LIST_OPEN_ID}>{(provided, snapshot) => (
          <List
            isDragInProgress={isDragInProgress}
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >

            <UiCaption>
              offene Teilaufträge
            </UiCaption>
            {openSubtasks.map((subtask, i) => (
              <Draggable key={subtask.id} draggableId={subtask.id.toString()} index={i}>{(provided, snapshot) => (
                <SubtaskListItem
                  subtask={subtask}
                  onClick={handleClick}
                  provided={provided}
                  snapshot={snapshot}
                />
              )}</Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}</Droppable>

        <Droppable droppableId={LIST_CLOSED_ID}>{(provided, snapshot) => (
          <List
            isDragInProgress={isDragInProgress}
            isDraggingOver={snapshot.isDraggingOver}
            is={snapshot.draggingFromThisWith}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <UiCaption>
              geschlossene Teilaufträge
            </UiCaption>
            {closedSubtasks.map((subtask, i) => (
              <Draggable key={subtask.id} draggableId={subtask.id.toString()} index={i}>{(provided, snapshot) => (
                <SubtaskListItem
                  subtask={subtask}
                  onClick={handleClick}
                  provided={provided}
                  snapshot={snapshot}
                />
              )}</Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}</Droppable>
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
  height: 100%;
  column-gap: 2rem;
  padding: 4px 4px 0 4px;
  
  ${Themed.media.lg.max} {
    width: 200%;
  }
`

const List = styled.ul<{ isDragInProgress: boolean, isDraggingOver: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  padding: 1rem;
  box-shadow: 0 0 2px 1px gray;
  
  & > ${UiCaption}:first-child {
    margin-bottom: 0.5rem;
  }
`
