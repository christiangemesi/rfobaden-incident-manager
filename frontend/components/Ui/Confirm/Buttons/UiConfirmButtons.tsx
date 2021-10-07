import React from 'react'
import UiGrid from '../../Grid/UiGrid'
import styled from 'styled-components'

interface Props {
  onSubmit?: () => void
  onCancel?: () => void
}

const UiConfirmButtons: React.VFC<Props> = ({
  onSubmit: doSubmit,
  onCancel: doCancel,
}) => {

  return (
    <UiGrid gap={0.5}>
      <UiGrid.Col size={8}>
        <StyledButton type="button" onClick={doSubmit}>
          Bestätigen
        </StyledButton>
      </UiGrid.Col>
      <UiGrid.Col>
        <StyledButton type="button" onClick={doCancel}>
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