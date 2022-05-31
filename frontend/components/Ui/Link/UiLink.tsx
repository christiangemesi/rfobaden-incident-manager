import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

interface Props extends StyledProps {
  /**
   * The URL that the hyperlink points to.
   */
  href: string

  /**
   * The content that is displayed as the link.
   */
  children?: ReactNode

  /**
   * Defines the content as text.
   */
  isText?: boolean

  /**
   * The target where the content should be displayed.
   */
  target?: string
}

/**
 * `UiLink` provides a navigation to other resources.
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
