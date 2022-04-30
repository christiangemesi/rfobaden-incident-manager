import Incident from '@/models/Incident'
import React, { ReactNode } from 'react'
import UiLevel from '@/components/Ui/Level/UiLevel'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import IncidentViewHeader from '@/components/Incident/View/Header/IncidentViewHeader'

interface Props extends StyledProps {
  incident: Incident
  children: ReactNode
  onDelete?: () => void
}

const IncidentView: React.VFC<Props> = ({
  incident,
  className,
  style,
  children,
  onDelete: handleDelete,
}) => {
  return (
    <UiLevel className={className} style={style}>
      <UiLevel.Header>
        <IncidentViewHeader incident={incident} onDelete={handleDelete} />
      </UiLevel.Header>
      <StyledUiLevelContent noPadding>
        {children}
      </StyledUiLevelContent>
    </UiLevel>
  )
}
export default styled(IncidentView)``

const StyledUiLevelContent = styled(UiLevel.Content)`
  overflow: hidden;
`