import React, { CSSProperties } from 'react'
import UiGrid from '@/components/Ui/Grid/UiGrid'
import UiContainer from '@/components/Ui/Container/UiContainer'
import styled from 'styled-components'

/**
 * `UiButtonExample` is an example page for the {@link UiGrid} component.
 */
const UiGridExample: React.VFC = () => {
  const colStyle: CSSProperties = {
    border: '1px solid black',
    padding: '0.5rem',
    textAlign: 'center',
  }
  return (
    <UiContainer>
      <Heading>
        <Code>UiGrid</Code> Examples
      </Heading>
      <SpacedSection>
        Simple Grid with 12 columns:
        <UiGrid>
          {[...Array(12)].map((_, i) => (
            <UiGrid.Col key={i} style={colStyle}>
              {i + 1}
            </UiGrid.Col>
          ))}
        </UiGrid>
      </SpacedSection>
      <SpacedSection>
        Columns that don&apos;t fit into a row are pushed to the next one:
        <UiGrid>
          {[...Array(14)].map((_, i) => (
            <UiGrid.Col size={1} key={i} style={colStyle}>
              {i + 1}
            </UiGrid.Col>
          ))}
        </UiGrid>
      </SpacedSection>

      <Heading>
        Fixed Size
      </Heading>
      <SpacedSection>
        Columns with fixed <Code>size</Code>:
        <UiGrid>
          <UiGrid.Col size={4} style={colStyle}>
            4
          </UiGrid.Col>
          <UiGrid.Col size={8} style={colStyle}>
            8
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <Heading>
        Default Size
      </Heading>
      <SpacedSection>
        Columns with no <Code>size</Code> share remaining space evenly among each other.
        <UiGrid>
          <UiGrid.Col size={7} style={colStyle}>
            7
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            default
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            default
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            default
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>
      <SpacedSection>
        Using the default <Code>size</Code> is the same as setting it to <Code>true</Code> explicitly:
        <UiGrid>
          <UiGrid.Col size={7} style={colStyle}>
            7
          </UiGrid.Col>
          <UiGrid.Col size={true} style={colStyle}>
            true
          </UiGrid.Col>
          <UiGrid.Col size={true} style={colStyle}>
            true
          </UiGrid.Col>
          <UiGrid.Col size={true} style={colStyle}>
            true
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <Heading>
        auto
      </Heading>
      <SpacedSection>
        Columns with <Code>size</Code> set to <Code>&quot;auto&quot;</Code> scale to have just enough space
        for their content, but no more.
        <UiGrid>
          <UiGrid.Col size={7} style={colStyle}>
            7
          </UiGrid.Col>
          <UiGrid.Col size="auto" style={colStyle}>
            auto
          </UiGrid.Col>
          <UiGrid.Col size="auto" style={colStyle}>
            auto
          </UiGrid.Col>
          <UiGrid.Col size="auto" style={colStyle}>
            auto
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>
      <SpacedSection>
        <Code>auto</Code> can be used together with the default <Code>size</Code> to always fill a row completely:
        <UiGrid>
          <UiGrid.Col size="auto" style={colStyle}>
            auto
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            default
          </UiGrid.Col>
          <UiGrid.Col size="auto" style={colStyle}>
            auto
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <Heading>
        Responsive Grid
      </Heading>
      <SpacedSection>
        The <Code>size</Code> can be adapted to multiple screen sizes using breakpoints.
        <UiGrid>
          <UiGrid.Col size={{ xs: 12, md: 8, lg: true }} style={colStyle}>
            left
          </UiGrid.Col>
          <UiGrid.Col size={{ xs: 12, md: 4, lg: 'auto' }} style={colStyle}>
            right
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <Heading>
        Gap
      </Heading>
      <SpacedSection>
        You can add space between rows and columns by using <Code>gap</Code> on the <Code>UiGrid</Code> component.
        The gap is based on the <Code>rem</Code> unit.
        <UiGrid gap={0.5}>
          <UiGrid.Col style={colStyle}>
            left
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            right
          </UiGrid.Col>
          <UiGrid.Col size={12} style={colStyle}>
            bottom
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <SpacedSection>
        To set only the horizontal gap, use <Code>gapH</Code>.
        <UiGrid gapH={0.5}>
          <UiGrid.Col style={colStyle}>
            left
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            right
          </UiGrid.Col>
          <UiGrid.Col size={12} style={colStyle}>
            bottom
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <SpacedSection>
        To set only the vertical gap, use <Code>gapV</Code>.
        <UiGrid gapV={0.5}>
          <UiGrid.Col style={colStyle}>
            left
          </UiGrid.Col>
          <UiGrid.Col style={colStyle}>
            right
          </UiGrid.Col>
          <UiGrid.Col size={12} style={colStyle}>
            bottom
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <Heading>
        Order
      </Heading>
      <SpacedSection>
        You can redefine the order of columns using the <Code>order</Code> prop.
        <UiGrid>
          <UiGrid.Col order={2} style={colStyle}>
            1
          </UiGrid.Col>
          <UiGrid.Col order={3} style={colStyle}>
            2
          </UiGrid.Col>
          <UiGrid.Col order={1} style={colStyle}>
            3
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>
      <SpacedSection>
        Just like <Code>size</Code>, the <Code>order</Code> attribute is also responsive:
        <UiGrid>
          <UiGrid.Col order={{ sm: 3, lg: 2 }} style={colStyle}>
            1
          </UiGrid.Col>
          <UiGrid.Col order={{ sm: 1, lg: 3 }} style={colStyle}>
            2
          </UiGrid.Col>
          <UiGrid.Col order={{ sm: 2, lg: 1 }} style={colStyle}>
            3
          </UiGrid.Col>
        </UiGrid>
      </SpacedSection>

      <SpacedSection />
    </UiContainer>
  )
}
export default UiGridExample

const Heading = styled.h1`
  font-size: 2rem;
  margin-top: 3rem;
`

const SpacedSection = styled.section`
  margin-top: 1rem;
`

const Code = styled.code`
  font-family: monospace;
`