import Transport from '@/models/Transport'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import TaskList from '@/components/Task/List/TaskList'
import TaskStore, { useTask, useTasksOfTransport } from '@/stores/TaskStore'
import BackendService, { BackendResponse } from '@/services/BackendService'
import UiIconButtonGroup from '@/components/Ui/Icon/Button/Group/UiIconButtonGroup'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useAsync, useMeasure, useUpdateEffect } from 'react-use'
import Id from '@/models/base/Id'
import Task, { parseTask } from '@/models/Task'
import TaskView from '@/components/Task/View/TaskView'
import { Themed } from '@/theme'
import UiContainer from '@/components/Ui/Container/UiContainer'
import { sleep } from '@/utils/control-flow'
import UiDescription from '@/components/Ui/Description/UiDescription'
import TransportInfo from '@/components/Transport/Info/TransportInfo'
import Incident from '@/models/Incident'
import UiLevel from '@/components/Ui/Level/UiLevel'
import UiInlineDrawer from '@/components/Ui/InlineDrawer/UiInlineDrawer'
import useCachedEffect from '@/utils/hooks/useCachedEffect'
import TransportActions from '@/components/Transport/Actions/TransportActions'
import { useRouter } from 'next/router'
import { parseIncidentQuery } from '@/pages/ereignisse/[...path]'

interface Props {
  incident: Incident
  transport: Transport
  onClose?: () => void
}

const TransportView: React.VFC<Props> = ({ incident, transport, onClose: handleCloseView }) => {
  const router = useRouter()

  return (
    <UiLevel>
      <UiLevel.Header>
        <UiGrid justify="space-between" align="start" gap={1} style={{ flexWrap: 'nowrap' }}>
          <div>
            <TransportInfo transport={transport} />
            <UiTitle level={3}>
              {transport.title}
            </UiTitle>
          </div>
          <UiIconButtonGroup>
            <TransportActions incident={incident} transport={transport} onDelete={handleCloseView} />

            <UiIconButton onClick={handleCloseView}>
              <UiIcon.CancelAction />
            </UiIconButton>
          </UiIconButtonGroup>
        </UiGrid>

        <UiDescription description={transport.description} />
      </UiLevel.Header>
    </UiLevel>
  )
}
export default TransportView
