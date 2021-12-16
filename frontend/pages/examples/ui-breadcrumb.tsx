import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiBreadcrumb, { Link } from '@/components/Ui/Breadcrumb/UiBreadcrumb'

const UiBreadcrumbExample: React.VFC = () => {
  const links: Link[] = [
    { label: 'hier', url: '#' },
    { label: 'hier', url: '#' },
    { label: 'zurück Link', url: '/examples' },
  ]

  const allLinks: Link[] = [
    { label: 'Test Incident', url: '#' },
    { label: 'Test Meldung', url: '#' },
    { label: 'Test Aufgabe', url: '#' },
  ]

  const mediumLinks = [
    allLinks[1],
    allLinks[2],
  ]

  const shortLinks = [
    allLinks[1],
  ]

  return (
    <UiContainer>
      <UiBreadcrumb links={links} />
      <UiBreadcrumb links={allLinks} />
      <UiBreadcrumb links={mediumLinks} />
      <UiBreadcrumb links={shortLinks} />
    </UiContainer>
  )
}
export default UiBreadcrumbExample
