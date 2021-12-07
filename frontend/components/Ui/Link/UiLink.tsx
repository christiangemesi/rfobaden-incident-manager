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
  children,
}) => {
  return (
    <Link href={href} passHref>
      <A>
        {children}
      </A>
    </Link>
  )
}
export default styled(UiLink)``

const A = styled.a`
  text-decoration: none;
`
