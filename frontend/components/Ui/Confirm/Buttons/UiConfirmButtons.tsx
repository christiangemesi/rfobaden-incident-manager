import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import styled from 'styled-components'

interface Props {
  allowSubmit?: boolean
  allowCancel?: boolean
  onSubmit?: () => void
  onCancel?: () => void
}

const UiConfirmButtons: React.VFC<Props> = ({
  allowSubmit = true,
  allowCancel = true,
  onSubmit: doSubmit,
  onCancel: doCancel,
}) => {

  return (
    <UiGrid gap={0.5}>
      <UiGrid.Col size={8}>
        <StyledButton type="button" disabled={!allowSubmit} onClick={doSubmit}>
          Bestätigen
        </StyledButton>
      </UiGrid.Col>
      <UiGrid.Col>
        <StyledButton type="button" disabled={!allowCancel} onClick={doCancel}>
          Abbrechen
        </StyledButton>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default UiConfirmButtons

const StyledButton = styled.button`
  display: block;
  width: 100%;
`