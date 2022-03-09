import React, { useCallback, useMemo, useState } from 'react'
import Subtask, { parseSubtask } from '@/models/Subtask'
import SubtaskListItem from '@/components/Subtask/List/Item/SubtaskListItem'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import SubtaskStore from '@/stores/SubtaskStore'
import styled from 'styled-components'
import { Themed } from '@/theme'
import UiCaption from '@/components/Ui/Caption/UiCaption'
import BackendService from '@/services/BackendService'
import UiScroll from '@/components/Ui/Scroll/UiScroll'


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
        <Side>
          <UiCaption>
            offene Teilaufträge
          </UiCaption>

          <Droppable droppableId={LIST_OPEN_ID}>{(provided) => (
            <DropTarget
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <UiScroll style={{ width: '100%', height: '100%' }}>
                <List>
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
                </List>
                {provided.placeholder}
              </UiScroll>
            </DropTarget>
          )}</Droppable>
        </Side>

        <Side>
          <UiCaption>
            geschlossene Teilaufträge
          </UiCaption>

          <Droppable droppableId={LIST_CLOSED_ID}>{(provided) => (
            <DropTarget
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <UiScroll style={{ width: '100%', height: '100%' }}>
                <List>
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
                </List>
                {provided.placeholder}
              </UiScroll>
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
  height: 100%;
  column-gap: 2rem;
  padding: 4px 4px 0 4px;
  
  width: 100%;  
  ${Themed.media.lg.max} {
    width: 200%;
  }
`

const Side = styled.div`
  width: 100%;
  height: 100%;
  
  padding: 1rem;
  box-shadow: 0 0 2px 1px gray;

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
  
  height: 100%;
  width: 100%;
`
