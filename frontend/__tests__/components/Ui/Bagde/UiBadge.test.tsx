/**
 * @jest-environment jsdom
 */

import { mount, shallow } from 'enzyme'
import UiBadge from '@/components/Ui/Badge/UiBadge'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'

describe('UiBadge', () => {
  it('should be a span', () => {
    const children = <div />
    const value = 123
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiBadge value={value} children={children} />
      </ThemeProvider>
    )
    expect(wrapper.find('span').first().html()).toContain('</span>')
  })
  it('should correctly display the value', () => {
    const children = <div />
    const value = 123
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiBadge value={value} children={children} />
      </ThemeProvider>
    )

    const content = wrapper.find('span')
    expect(content).toHaveLength(2)
    expect(content.get(1).props.children).toBe(value)
  })
})