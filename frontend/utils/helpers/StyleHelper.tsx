import React, { CSSProperties, ReactNode } from 'react'
import StringHelper from '@/utils/helpers/StringHelper'

class StyleHelper {
  tag<P>(name: keyof JSX.IntrinsicElements): React.VFC<P & StyledProps> {
    const Tag = name
    const StyledTag: React.VFC<P & StyledProps> = ({ className, style, children }) => (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    )
    StyledTag.displayName = `Styled${StringHelper.capitalize(name)}`
    return StyledTag
  }
}
export default new StyleHelper()

interface StyledProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}
