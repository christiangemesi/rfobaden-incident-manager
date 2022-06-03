import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'


interface Props {
  /**
   * The amount of finished items.
   */
  done: number

  /**
   * The total amount of items.
   */
  total: number

  /**
   * Signals a closed state by using different colors.
   */
  isClosed?: boolean
}

/**
 * `UiCircularProgress` displays progress on a total number of items.
 */
const UiCircularProgress: React.VFC<Props> = ({
  done,
  total,
  isClosed = false,
}) => {
  return useMemo(() => {
    const progress = total == 0 ? 0 : parseFloat((done / total).toFixed(2))
    return (
      <svg width={SVG_SIZE} height={SVG_SIZE}>
        <g transform={`rotate(-90 ${RADIUS_OUTER} ${RADIUS_OUTER})`}>
          <OuterCircle radius={RADIUS_OUTER} centerX={SVG_CENTER_X} centerY={SVG_CENTER_Y} isClosed={isClosed} />
          <ProgressCircle
            progress={progress}
            radius={RADIUS_PROGRESS}
            centerX={SVG_CENTER_X}
            centerY={SVG_CENTER_Y}
            isClosed={isClosed}
          />
          <InnerCircle radius={RADIUS_INNER} centerX={SVG_CENTER_X} centerY={SVG_CENTER_Y} isClosed={isClosed} />
        </g>

        <ProgressText done={done} total={total} />
        <Percentage progress={progress} />
      </svg>
    )
  }, [done, total, isClosed])
}
export default UiCircularProgress

// Constant circle calculations.
const BORDER_SIZE = 2
const RADIUS_PROGRESS = 3.5 * 16
const RADIUS_OUTER = 4 * 16
const RADIUS_INNER = 3 * 16
const SVG_SIZE = RADIUS_OUTER * 2 + BORDER_SIZE * 3
const SVG_CENTER_X = SVG_SIZE / 2 - BORDER_SIZE * 2
const SVG_CENTER_Y = SVG_SIZE / 2

interface ProgressCircleProps {
  /**
   * Progress to display.
   */
  progress: number

  /**
   * Size of the inner circle.
   */
  radius: number

  /**
   * X center of the inner circle.
   */
  centerX: number

  /**
   * Y center of the inner circle.
   */
  centerY: number

  /**
   * Whether the entity is closed or opened.
   */
  isClosed: boolean
}

/**
 * `ProgressCircle` displays the progress part of a {@link UiCircularProgress}.
 */
const ProgressCircle: React.VFC<ProgressCircleProps> = ({ progress, radius, centerX, centerY, isClosed }) => {
  const theme = useTheme()
  const color = isClosed ? theme.colors.grey.hover : theme.colors.success.value
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
      strokeLinecap="butt"
    />
  )
}


interface OuterCircleProps {
  /**
   * Size of the outer circle.
   */
  radius: number

  /**
   * X center of the outer circle.
   */
  centerX: number

  /**
   * Y center of the outer circle.
   */
  centerY: number
  isClosed: boolean
}

/**
 * `OuterCircle` displays the outer circle of a {@link UiCircularProgress}.
 */
const OuterCircle: React.VFC<OuterCircleProps> = ({ radius, centerX, centerY, isClosed }) => {
  const theme = useTheme()

  return (
    <circle
      r={radius}
      cx={centerX}
      cy={centerY}
      fill={theme.colors.success.contrast}
      stroke={isClosed ? theme.colors.grey.value : theme.colors.secondary.value}
      strokeWidth={`${BORDER_SIZE}px`}
    />
  )
}

interface InnerCircleProps {
  /**
   * Size of the inner circle.
   */
  radius: number

  /**
   * X center of the inner circle.
   */
  centerX: number

  /**
   * Y center of the inner circle.
   */
  centerY: number

  /**
   * Whether the entity is closed or opened.
   */
  isClosed: boolean
}

/**
 * `InnerCircle` displays the inner circle, including the text, of a {@link UiCircularProgress}.
 */
const InnerCircle: React.VFC<InnerCircleProps> = ({ radius, centerX, centerY, isClosed }) => {
  const theme = useTheme()

  return (
    <circle
      r={radius}
      cx={centerX}
      cy={centerY}
      stroke={isClosed ? theme.colors.grey.value : theme.colors.secondary.value }
      fill={isClosed ? theme.colors.activeClosed.value : theme.colors.secondary.value}
      strokeWidth={`${BORDER_SIZE}px`}
    />
  )
}

interface TextProps {
  progress: number
}

/**
 * `Percentage` displays the percentage text of a {@link UiCircularProgress}.
 */
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

/**
 * `ProgressText` displays the number of progressed entities as text.
 */
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

