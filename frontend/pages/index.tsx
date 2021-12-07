import React from 'react'
import UiContainer from '@/components/Ui/Container/UiContainer'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiButton from '@/components/Ui/Button/UiButton'
import UiLink from '@/components/Ui/Link/UiLink'

const HomePage: React.VFC = () => {
  return (
    <UiContainer>
      <UiTitle level={1} isCentered>
        Home Sweet Home
      </UiTitle>

      <UiGrid justify="center">
        <UiGrid.Col size={{ xs: 12, md: 6, xl: 4 }}>
          <UiLink href="/ereignisse">
            <UiButton isFull>
              Ereignisse
            </UiButton>
          </UiLink>
        </UiGrid.Col>
      </UiGrid>
    </UiContainer>
  )
}
export default HomePage
