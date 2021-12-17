import Subtask from '@/models/Subtask'
import React from 'react'

interface Props {
  subtask: Subtask
}

const SubtaskView: React.VFC<Props> = ({ subtask }) => {


  return (
    <div>Subtask View</div>

  )
}

export default SubtaskView