import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useEffectOnce } from 'react-use'
import { ColorName, Themed } from '@/theme'
import Alert from '@/models/Alert'

interface Props {
  alert: Alert
  onRemove: (alert: Alert) => void
}

/**
 * `UiAlert` is a component to inform the user about past events.
 */
const UiAlert: React.VFC<Props> = ({

  /**
   * The {@link Alert} to be displayed.
   */
  alert,

  /**
   * Event caused by closing the {@link Alert}.
   */
  onRemove: handleRemove,
}) => {
  const [isVisible, setVisibility] = useState(true)

  useEffectOnce(() => {
    if (alert.isFading) {
      setTimeout(() => {
        setVisibility(false)
        setTimeout(() => {
          handleRemove(alert)
        }, 500)
      }, 3000)
    }
  })

  /**
   * Determine which {@link UiIcon} should be displayed in relation to the {@link alert.type}
   */
  const icon = useMemo(() => {
    switch (alert.type) {
    case 'warning' :
      return <UiIcon.AlertWarning />
    case 'error' :
      return <UiIcon.AlertError />
    case 'success' :
      return <UiIcon.AlertSuccess />
    default:
      return <UiIcon.AlertInfo />
    }
  }, [alert.type])

  return (
    <Box type={alert.type} isVisible={isVisible}>
      <IconContainer>
        {icon}
      </IconContainer>
      <TextContainer>
        {alert.text}
      </TextContainer>
      <IconContainer>
        <UiIconButton onClick={() => handleRemove(alert)}><DeleteIcon /></UiIconButton>
      </IconContainer>
    </Box>
  )
}

export default UiAlert

const Box = styled.div<{ type: ColorName, isVisible: boolean }>`
  background: ${({ theme, type }) => theme.colors[type].value};
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  width: 20rem;
  opacity: 75%;
  transition: 500ms ease-out;
  transition-property: opacity;
  z-index: 150;

  ${({ isVisible }) => !isVisible && css`
    opacity: 0;
  `}

  ${Themed.media.sm.max} {
    width: 95%;
  }
`

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  word-break: break-all;
  white-space: normal;
  overflow: visible;
  width: 100%;

  grid-column: auto / span 8;
`

const DeleteIcon = styled(UiIcon.CancelAction)`
  color: white;
`

const IconContainer = styled.div`
  display: flex;
  align-items: flex-start;
  color: white;

  margin-right: 0.5rem;
  margin-left: 0.5rem;

  grid-column: auto / span 2;
`