/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme'
import { defaultTheme } from '@/theme'

import { ThemeProvider } from 'styled-components'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'


describe('UiCheckbox', () => {
  it('should correctly display a label', () => {
    const mockCallBack = jest.fn()
    const text = 'abcABC123#'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiCheckbox value={false} label={text} onChange={mockCallBack} />
      </ThemeProvider>,
    )
    expect(wrapper.find('label').text()).toBe(text)
  })

  it('should call the onClick function', () => {
    const mockCallBack = jest.fn()
    const text = 'abcABC123#'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiCheckbox value={false} label={text} onChange={mockCallBack} />
      </ThemeProvider>,
    )
    wrapper.find('UiCheckbox__Container').simulate('click')
    expect(mockCallBack.mock.calls).toHaveLength(1)
  })
})
