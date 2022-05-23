import React, { useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'


interface Props {

  /**
   * The amount of finished items.
   */
  done: number

  /**
   * The amount of total reports.
   */
  total: number

  /**
   * Signals a closed state by using different colors.
   */
  isClosed?: boolean
}

/**
 * `UiCircularProgress` displays the progress of an incident.
 */
const UiCircularProgress: React.VFC<Props> = ({ done, total, isClosed = false }) => {
  return useMemo(() => {
    const progress = total == 0 ? 0 : parseFloat((done / total).toFixed(2))
    return (
      <svg width={SVG_SIZE} height={SVG_SIZE}>
        <g transform={`rotate(-90 ${RADIUS_OUTER} ${RADIUS_OUTER})`}>
          <OuterCircle radius={RADIUS_OUTER} centerX={SVG_CENTER_X} centerY={SVG_CENTER_Y} />
          <ProgressCircle progress={progress} radius={RADIUS_PROGRESS} centerX={SVG_CENTER_X} centerY={SVG_CENTER_Y} isClosed={isClosed} />
          <InnerCircle radius={RADIUS_INNER} centerX={SVG_CENTER_X} centerY={SVG_CENTER_Y} isClosed={isClosed} />
        </g>
        <ProgressText done={done} total={total} />
        <Percentage progress={progress} />
      </svg>
    )
  }, [done, total, isClosed])
}
export default UiCircularProgress

const BORDER_SIZE = 2
const RADIUS_PROGRESS = 3.5 * 16
const RADIUS_OUTER = 4 * 16
const RADIUS_INNER = 3 * 16
const SVG_SIZE = RADIUS_OUTER * 2 + BORDER_SIZE * 3
const SVG_CENTER_X = SVG_SIZE / 2 - BORDER_SIZE * 2
const SVG_CENTER_Y = SVG_SIZE / 2

interface ProgressCircleProps {
  progress: number
  radius: number
  centerX: number
  centerY: number
  isClosed: boolean
}

const ProgressCircle: React.VFC<ProgressCircleProps> = ({ progress, radius, centerX, centerY, isClosed }) => {
  const theme = useTheme()
  const color = isClosed ? theme.colors.grey.value : theme.colors.success.value
  const circ = 2 * Math.PI * radius
  const strokePct = ((100 - progress * 100) * circ) / 100

  return (
    <circle
      r={radius}
      cx={centerX}
      cy={centerY}
      fill="transparent"
      stroke={Math.round(strokePct) !== Math.round(circ) ? color : ''}
      strokeWidth="1rem"
      strokeDasharray={circ}
      strokeDashoffset={progress === 0 ? 0 : strokePct}
      strokeLinecap="round"
    />
  )
}


interface OuterCircleProps {
  radius: number
  centerX: number
  centerY: number
}

const OuterCircle: React.VFC<OuterCircleProps> = ({ radius, centerX, centerY }) => {
  const theme = useTheme()

  return (
    <circle
      r={radius}
      cx={centerX}
      cy={centerY}
      fill={theme.colors.success.contrast}
      stroke={theme.colors.secondary.value}
      strokeWidth={`${BORDER_SIZE}px`}
    />
  )
}

interface InnerCircleProps {
  radius: number
  centerX: number
  centerY: number
  isClosed: boolean
}

const InnerCircle: React.VFC<InnerCircleProps> = ({ radius, centerX, centerY, isClosed }) => {
  const theme = useTheme()

  return (
    <StyledCircle
      r={radius}
      cx={centerX}
      cy={centerY}
      isClosed={isClosed}
      fill={isClosed ? theme.colors.grey.value : theme.colors.secondary.value}
    />
  )
}

const StyledCircle = styled.circle<{ isClosed: boolean }>`
  ${({ isClosed }) => isClosed && css`
    filter: brightness(1.2);
  `}
`


interface TextProps {
  progress: number
}

const Percentage: React.VFC<TextProps> = ({ progress }) => {
  return (
    <text
      x="50%"
      y="61%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="15"
    >
      {(progress * 100).toFixed(0)}%
    </text>
  )
}

interface ProgressProps {
  done: number
  total: number
}

const ProgressText: React.VFC<ProgressProps> = ({ done, total }) => {
  return (
    <text
      x="50%"
      y="45%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="25"
    >
      {done}/{total}
    </text>)
}

