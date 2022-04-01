import React from 'react'
import styled, { css } from 'styled-components'
import UiTitle from '@/components/Ui/Title/UiTitle'

interface Props {
  done: number
  total: number
}

const UICircularProgress: React.VFC<Props> = ({ done = 0, total = 0 }) => {
  const decimal = total == 0 ? 0 : parseFloat((done / total).toFixed(2))
  return (
    <Circle percentDecimal={decimal}>
      <CircleOverlay>
        <CompletionRate>
          <UiTitle level={5}>
            {done}/{total}
          </UiTitle>
        </CompletionRate>
        <Percent>
          <UiTitle level={6}>
            {(decimal * 100).toFixed(0)}%
          </UiTitle>
        </Percent>
      </CircleOverlay>
    </Circle>
  )
}
export default UICircularProgress

const Circle = styled.div<{ percentDecimal: number }>`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ theme, percentDecimal }) => css`
    --circle-color: ${theme.colors.tertiary.value};
    --progress-color: ${theme.colors.success.value};
    --progress-ratio: ${percentDecimal * 100}%;
  `}
  
  background: conic-gradient(
    var(--progress-color) var(--progress-ratio), 0,
    var(--circle-color) calc(100% - var(--progress-ratio))
  );
`


const CircleOverlay = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.tertiary.value};
`

const CompletionRate = styled.div`
  color: ${({ theme }) => theme.colors.tertiary.contrast};
`

const Percent = styled.div`
  color: ${({ theme }) => theme.colors.tertiary.contrast};
`
