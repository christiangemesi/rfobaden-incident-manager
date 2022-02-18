import React from 'react'
import styled from 'styled-components'
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
  background: conic-gradient(${({
    theme,
    percentDecimal,
  }) => theme.colors.success.value + ' ' + (percentDecimal * 100) + '%' + ',0,' + theme.colors.secondary.value + ' ' + (100 - (percentDecimal * 100)) + '%'});
  /* This is done so there aren't 4 inline parts*/
`


const CircleOverlay = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary.contrast};
`

const CompletionRate = styled.div`
  color: ${({ theme }) => theme.colors.primary.value};
`

const Percent = styled.div`
  color: ${({ theme }) => theme.colors.primary.value};
`
