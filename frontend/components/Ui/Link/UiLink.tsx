import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

interface Props extends StyledProps {
  href: string
  children?: ReactNode
  isText?: boolean
}

const UiLink: React.VFC<Props> = ({
  href,
  className,
  style,
  children,
  isText = false,
}) => {
  const AComponent = isText ? TextA : A
  return (
    <Link href={href} passHref>
      <AComponent style={style} className={className}>
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
  color: ${({ theme }) => theme.colors.primary.value};

  &:hover {
    filter: brightness(150%);
  }
`
