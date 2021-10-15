import React, { CSSProperties, ReactNode } from 'react'
import StringHelper from '@/utils/helpers/string.helper'

class StyleHelper {
  tag<P>(name: keyof JSX.IntrinsicElements): React.VFC<P & StyledProps>
  tag<P, K extends keyof JSX.IntrinsicElements>(name: K, mapProps?: (props: P) => Partial<JSX.IntrinsicElements[K]>): React.VFC<P & StyledProps>
  tag<P, K extends keyof JSX.IntrinsicElements>(name: K, mapProps?: (props: P) => Partial<JSX.IntrinsicElements[K]>): React.VFC<P & StyledProps> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = name as any
    const StyledTag: React.VFC<P & StyledProps> = (props) => {
      const {
        className = props.className,
        style = props.style,
        children = props.children,
        ...mappedProps
      } = mapProps ? mapProps(props) : { className: props.className, style: props.style, children: props.children }
      return (
        <Tag className={className} style={style} {...mappedProps}>
          {children}
        </Tag>
      )
    }
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
