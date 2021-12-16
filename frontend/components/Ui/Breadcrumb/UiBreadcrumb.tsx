import React from 'react'
import styled from 'styled-components'
import UiLink from '@/components/Ui/Link/UiLink'

interface Props {
  links: Link[]
}

const UiTitle: React.VFC<Props> = ({
  links,
}) => {
  return (
    <LinkContainer>
      {links.map((link) => (
        <React.Fragment key={link.label}>
          <UiLink href={link.url}>
            {link.label}
          </UiLink>
          <SpacerArrow>/</SpacerArrow>
        </React.Fragment>
      ))}
    </LinkContainer>
  )
}

export default UiTitle

export interface Link {
  url: string
  label: string
}

const LinkContainer = styled.div`
  margin: 1rem 0;
`

const SpacerArrow = styled.div`
  display: inline-block;
  margin: 0 0.5rem;
  
  :last-child{
    display: none;
  }
`