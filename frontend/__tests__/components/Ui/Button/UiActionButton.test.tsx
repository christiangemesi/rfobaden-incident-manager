/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import { defaultTheme } from '@/theme'

import { ThemeProvider } from 'styled-components'
import UiActionButton from '@/components/Ui/Button/UiActionButton'


describe('UiActionButton', () => {
  it('should be a "button" tag', () => {
    const children = <div />
    const wrapper = shallow(
      <ThemeProvider theme={defaultTheme}>
        <UiActionButton children={children} />
      </ThemeProvider>,
    )
    expect(wrapper.html()).toContain('</button>')
  })

  it('should call the onClick function', () => {
    const children = <div />
    const mockCallBack = jest.fn()
    const wrapper = shallow(
      <ThemeProvider theme={defaultTheme}>
        <UiActionButton children={children} onClick={mockCallBack} />
      </ThemeProvider>,
    )
    wrapper.find('UiActionButton').simulate('click')
    expect(mockCallBack.mock.calls).toHaveLength(1)
  })
})

