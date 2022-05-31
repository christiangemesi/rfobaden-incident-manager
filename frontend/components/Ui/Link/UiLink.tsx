import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

interface Props extends StyledProps {
  /**
   * The URL or path that the hyperlink points to.
   */
  href: string

  /**
   * The content that is displayed as the link.
   */
  children?: ReactNode

  /**
   * Signals that the content is text-only, causing the link to be styled differently.
   */
  isText?: boolean

  /**
   * The target attribute for the displayed anchor element.
   */
  target?: string
}

/**
 * `UiLink` displays a HTML anchor element.
 */
const UiLink: React.VFC<Props> = ({
  href,
  className,
  style,
  children,
  isText = false,
  target,
}) => {
  const AComponent = isText ? TextA : A
  return (
    <Link href={href} passHref>
      <AComponent target={target} style={style} className={className}>
        {children}
      </AComponent>
    </Link>
  )
}
export default styled(UiLink)``

const A = styled.a`
  text-decoration: none;
`

const TextA = styled(A)`
  color: ${({ theme }) => theme.colors.light.contrast};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.hover};
  }
`
