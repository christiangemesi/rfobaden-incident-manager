/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiButton from '@/components/Ui/Button/UiButton'
import { defaultTheme } from '@/theme'

import { ThemeProvider } from 'styled-components'


describe('UiButton', () => {
  it('should be a "button" tag', () => {
    const wrapper = shallow(
      <ThemeProvider theme={defaultTheme}>
        <UiButton />
      </ThemeProvider>,
    )
    expect(wrapper.html()).toContain('</button>')
  })

  it('should call the onClick function', () => {
    const mockCallBack = jest.fn()
    const wrapper = shallow(
      <ThemeProvider theme={defaultTheme}>
        <UiButton onClick={mockCallBack} />
      </ThemeProvider>,
    )
    wrapper.find('UiButton').simulate('click')
    expect(mockCallBack.mock.calls).toHaveLength(1)
  })
})

