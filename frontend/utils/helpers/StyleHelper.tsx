import React, { CSSProperties, ReactNode } from 'react'
import StringHelper from '@/utils/helpers/StringHelper'

class StyleHelper {
  tag<P>(name: keyof JSX.IntrinsicElements): React.VFC<P & StyledProps & { children?: ReactNode }>
  tag<P, K extends keyof JSX.IntrinsicElements>(name: K, mapProps?: (props: P) => Partial<JSX.IntrinsicElements[K]>): React.VFC<P & StyledProps & { children?: ReactNode }>
  tag<P, K extends keyof JSX.IntrinsicElements>(name: K, mapProps?: (props: P) => Partial<JSX.IntrinsicElements[K]>): React.VFC<P & StyledProps & { children?: ReactNode }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = name as any
    const StyledTag: React.VFC<P & StyledProps & { children?: ReactNode }> = (props) => {
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

export interface StyledProps {
  className?: string
  style?: CSSProperties
}
