import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiIconButton from '@/components/Ui/Icon/Button/UiIconButton'
import { useEffectOnce } from 'react-use'
import { ColorName } from '@/theme'

interface Props {
  type: ColorName
  text: string
  onRemove: () => void
  timeout?: number
}

const UiAlert: React.VFC<Props> = ({
  type,
  text,
  timeout = 3000,
  onRemove,
}) => {
  const [isVisible, setVisibility] = useState(true)

  useEffectOnce(() => {
    setTimeout(() => {
      onRemove()
    }, timeout)
    setTimeout(() => {
      setVisibility(false)
    }, timeout - 500)
  })

  let icon = <UiIcon.AlertInfo />

  switch (type) {
  case 'warning' :
    icon = <UiIcon.AlertWarning />
    break
  case 'error' :
    icon = <UiIcon.AlertError />
    break
  case 'success' :
    icon = <UiIcon.AlertSuccess />
    break
  }

  return (
    <Box type={type} isVisible={isVisible}>
      <TextContainer>
        <IconContainer>
          {icon}
        </IconContainer>
        <UiTitle level={6}>{text}</UiTitle>
      </TextContainer>
      <IconContainer>
        <UiIconButton onClick={onRemove}><DeleteIcon /></UiIconButton>
      </IconContainer>
    </Box>
  )
}

export default UiAlert

const Box = styled.div<{ type: ColorName, isVisible: boolean }>`
  background: ${({ theme, type }) => theme.colors[type].value};

  border-radius: 5px;
  width: 20rem;

  display: inline-flex;
  justify-content: space-between;
  padding: 1rem;
  opacity: 75%;
  transition: 500ms ease-out;
  transition-property: opacity, display;

  ${({ isVisible }) => !isVisible && css`
    opacity: 0;
  `}
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