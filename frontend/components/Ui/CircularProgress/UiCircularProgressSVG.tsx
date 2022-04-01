import React from 'react'
import styled, { useTheme } from 'styled-components'

interface Props {
  done: number
  total: number
}

const UiCircularProgressSVG: React.VFC<Props> = ({ done = 0, total = 0 }) => {
  const decimal = total == 0 ? 0 : parseFloat((done / total).toFixed(2))
  const svgSize = 8*20
  const svgCenter = svgSize/2
  const radiusTrack = 4*16
  const radiusBar = 3.5*16
  const radiusText = 3*15.9

  return (
    <svg width={svgSize} height={svgSize}>
      <g transform={`rotate(-90 ${'80 80'})`}>
        <ProgressTrack radius={radiusTrack} center={svgCenter} />
        <ProgressBar percentDecimal={decimal} radius={radiusBar} center={svgCenter} />
        <TextCircle radius={radiusText} center={svgCenter} />
      </g>
      <ProgressText done={done} total={total} />
      <Percentage percentDecimal={decimal} />
    </svg>
  )
}
export default UiCircularProgressSVG

interface BarProps{
  percentDecimal: number
  radius: number
  center: number
}

const ProgressBar: React.VFC<BarProps> = ({ percentDecimal, radius, center }) => {
  const theme = useTheme()
  const color = theme.colors.success.value
  const circ = 2 * Math.PI * radius
  const strokePct = ((100 - percentDecimal*100) * circ)/100

  return (
    <circle
      r={radius}
      cx={center}
      cy={center}
      fill="transparent"
      stroke={Math.round( strokePct) !== Math.round(circ)? color : ''}
      strokeWidth={'1rem'}
      strokeDasharray={circ}
      strokeDashoffset={percentDecimal ? strokePct : 0}
      strokeLinecap="round"
    />
  )
}

interface TrackProps{
  radius: number
  center: number
}
const ProgressTrack:React.VFC<TrackProps> =  ({ radius, center }) => {
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

interface CircleProps{
  radius: number
  center: number
}

const TextCircle:React.VFC<CircleProps> =  ({ radius, center }) => {
  const theme = useTheme()

  return(
    <circle
      r={radius}
      cx={center}
      cy={center}
      fill={theme.colors.secondary.value}
      stroke={theme.colors.secondary.value}
      strokeWidth={'1px'}
    />

  )
}

interface TextProps {
  percentDecimal: number
}

const Percentage: React.VFC<TextProps> =  ({ percentDecimal }) => {
  return (
    <text
      x="50%"
      y="60%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={'15'}
    >
      {(percentDecimal * 100).toFixed(0)}%
    </text>
  )
}

interface ProgressProps {
  done: number
  total: number
}

const ProgressText: React.VFC<ProgressProps> = ({ done , total }) => {
  return(
    <text
      x="50%"
      y="45%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={'25'}
    >
      {done}/{total}
    </text>)
}

