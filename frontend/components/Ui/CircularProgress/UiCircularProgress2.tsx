import React from 'react'
import styled, { useTheme } from 'styled-components'

interface Props {
  done: number
  total: number
}

const UICircularProgress2: React.VFC<Props> = ({ done = 0, total = 0 }) => {
  const decimal = total == 0 ? 0 : parseFloat((done / total).toFixed(2))
  const theme = useTheme()

  return (
    <svg width={8*20} height={8*20}>
      <g transform={`rotate(-90 ${'80 80'})`}>
        {/*<circle r={4*16.2} cx={80} cy={80} fill={theme.colors.secondary.value} />*/}
        <circle r={4*16} cx={80} cy={80} fill={theme.colors.success.contrast} />
        <CircleBar percentDecimal={decimal} color={ theme.colors.success.value} />
        <circle r={3*15.9} cx={80} cy={80} fill={theme.colors.secondary.value} stroke={theme.colors.secondary.value} strokeWidth={'1px'} />
      </g>
      <ProgressText done={done} total={total} />
      <Percentage percentDecimal={decimal} />
    </svg>
  )
}
export default UICircularProgress2

interface CircleProps {
  percentDecimal: number
  color: string
}

const CircleBar: React.VFC<CircleProps> = ({ percentDecimal, color }) => {
  const r = 3.5 * 16
  const circ = 2 * Math.PI * r
  const strokePct = ((100 - percentDecimal*100) * circ)/100
  return (
    <circle
      r={r}
      cx={4*20}
      cy={4*20}
      fill="transparent"
      stroke={Math.round( strokePct) !== Math.round(circ)? color : ''} // remove colour as 0% sets full circumference
      strokeWidth={'1rem'}
      strokeDasharray={circ}
      strokeDashoffset={percentDecimal ? strokePct : 0}
      strokeLinecap="round"
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

