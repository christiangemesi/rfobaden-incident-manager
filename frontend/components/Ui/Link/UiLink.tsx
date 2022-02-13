import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { StyledProps } from '@/utils/helpers/StyleHelper'
import Link from 'next/link'

interface Props extends StyledProps {
  href: string
  children?: ReactNode
}

const UiLink: React.VFC<Props> = ({
  href,
  className,
  style,
  children,
}) => {
  return (
    <Link href={href} passHref>
      <A style={style} className={className}>
        {children}
      </A>
    </Link>
  )
}
export default styled(UiLink)``

const A = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary.value};

  &:hover {
    filter: brightness(150%);
  }
`
