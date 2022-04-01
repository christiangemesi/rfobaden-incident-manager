import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'

interface Props {
  done: number
  total: number
}

const UiCircularProgress: React.VFC<Props> = ({ done, total }) => {
  return useMemo(() => {
    const progress = total == 0 ? 0 : parseFloat((done / total).toFixed(2))

    return (
      <svg width={SVG_SIZE} height={SVG_SIZE}>
        <g transform={`rotate(-90 ${RADIUS_OUTER} ${RADIUS_OUTER})`}>
          <OuterCircle radius={RADIUS_OUTER} center={SVG_CENTER} />
          <ProgressCircle progress={progress} radius={RADIUS_PROGRESS} center={SVG_CENTER} />
          <InnerCircle radius={RADIUS_INNER} center={SVG_CENTER} />
        </g>
        <ProgressText done={done} total={total} />
        <Percentage progress={progress} />
      </svg>
    )
  }, [done, total])
}
export default UiCircularProgress

const RADIUS_PROGRESS = 3.5 * 16
const RADIUS_OUTER = 4 * 16
const RADIUS_INNER = 3 * 16
const SVG_SIZE = RADIUS_OUTER * 2
const SVG_CENTER = SVG_SIZE / 2

interface ProgressCircleProps{
  progress: number
  radius: number
  center: number
} 

const ProgressCircle: React.VFC<ProgressCircleProps> = ({ progress, radius, center }) => {
  const theme = useTheme()
  const color = theme.colors.success.value
  const circ = 2 * Math.PI * radius
  const strokePct = ((100 - progress * 100) * circ) / 100

  return (
    <circle
      r={radius}
      cx={center}
      cy={center}
      fill="transparent"
      stroke={Math.round(strokePct) !== Math.round(circ) ? color : ''}
      strokeWidth="1rem"
      strokeDasharray={circ}
      strokeDashoffset={progress === 0 ? 0 : strokePct}
      strokeLinecap="round"
    />
  )
}

interface OuterCircleProps{
  radius: number
  center: number
}

const OuterCircle: React.VFC<OuterCircleProps> =  ({ radius, center }) => {
  const theme = useTheme()

  return(
    <circle
      r={radius}
      cx={center}
      cy={center}
      fill={theme.colors.success.contrast}
    />
  )
}

interface InnerCircleProps{
  radius: number
  center: number
}

const InnerCircle: React.VFC<InnerCircleProps> =  ({ radius, center }) => {
  const theme = useTheme()

  return(
    <circle
      r={radius}
      cx={center}
      cy={center}
      fill={theme.colors.secondary.value}
    />
  )
}

interface TextProps {
  progress: number
}

const Percentage: React.VFC<TextProps> =  ({ progress }) => {
  return (
    <text
      x="50%"
      y="60%"
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

const ProgressText: React.VFC<ProgressProps> = ({ done , total }) => {
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

