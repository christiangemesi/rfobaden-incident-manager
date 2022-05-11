import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useEffectOnce } from 'react-use'
import { ColorName, Themed } from '@/theme'
import Alert from '@/models/Alert'

interface Props {
  alert: Alert
  onRemove: (alert: Alert) => void
}

const UiAlert: React.VFC<Props> = ({
  alert,
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
      <TextContainer>
        <IconContainer>
          {icon}
        </IconContainer>
        <UiTitle level={6}>{alert.text}</UiTitle>
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
  display: inline-flex;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  width: 20rem;
  opacity: 75%;
  transition: 500ms ease-out;
  transition-property: opacity;

  ${({ isVisible }) => !isVisible && css`
    opacity: 0;
  `}

  ${Themed.media.sm.max} {
    width: 95%;
  }
`

const TextContainer = styled.div`
  display: inline-flex;
  color: white;
`

const DeleteIcon = styled(UiIcon.CancelAction)`
  color: white;
`

const IconContainer = styled.div`
  color: white;

  margin-right: 0.5rem;
  margin-left: 0.5rem;
`