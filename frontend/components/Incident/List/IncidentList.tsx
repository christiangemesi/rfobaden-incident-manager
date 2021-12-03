import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Incident, { parseIncident } from '@/models/Incident'
import BackendService, { BackendResponse } from '@/services/BackendService'
import IncidentStore from '@/stores/IncidentStore'
import IncidentView from '@/components/Incident/View/IncidentView'
import * as ReactDOM from 'react-dom'
import Link from 'next/link'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiList from '@/components/Ui/List/UiList'
import UiListItem from '@/components/Ui/List/Item/UiListItem'
import UiDate from '@/components/Ui/Date/UiDate'
import CloseReason from '@/models/CloseReason'

interface Props {
  incidents: Incident[]
}

const IncidentList: React.VFC<Props> = ({ incidents }) => {

  return (
    <UiContainer>
      <UiList>
        {incidents.map((incident) => {
          const closeReason = incident.closeReason as unknown as CloseReason
          console.log(closeReason)
          return (<UiListItem key={incident.id}>
            <span>{incident.title}</span>
            <UiDate value={incident.startsAt ?? incident.createdAt} />
            <UiDate value={closeReason.createdAt} />
            <span>{closeReason.message}</span>
          </UiListItem>)
        })}
      </UiList>
    </UiContainer>
  )
}
export default IncidentList
