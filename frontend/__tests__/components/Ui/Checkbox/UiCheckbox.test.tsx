/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme'
import { defaultTheme } from '@/theme'

import { ThemeProvider } from 'styled-components'
import UiCheckbox from '@/components/Ui/Checkbox/UiCheckbox'
import UiIcon from '@/components/Ui/Icon/UiIcon'
import UiInputErrors from '@/components/Ui/Input/Errors/UiInputErrors'


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
    wrapper.find('label').simulate('click')
    expect(mockCallBack.mock.calls).toHaveLength(1)
  })

  it('should correctly display the inactive icon', () => {
    const mockCallBack = jest.fn()
    const text = 'abcABC123#'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiCheckbox value={true} label={text} isDisabled={false} onChange={mockCallBack} />
      </ThemeProvider>,
    )
    const icon = wrapper.find(UiIcon.CheckboxInactive)
    expect(icon.exists()).toBe(true)
  })

  it('should correctly display the active icon', () => {
    const mockCallBack = jest.fn()
    const text = 'abcABC123#'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiCheckbox value={true} label={text} isDisabled={true} onChange={mockCallBack} />
      </ThemeProvider>,
    )
    const icon = wrapper.find(UiIcon.CheckboxActive)
    expect(icon.exists()).toBe(true)
  })

  it('should display multiple errors', () => {
    const mockCallBack = jest.fn()
    const text = 'abcABC123#'
    const error1 = 'error1'
    const error2 = 'error2'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiCheckbox value={false} label={text} errors={[error1, error2]} onChange={mockCallBack} />
      </ThemeProvider>,
    )
    const errors = wrapper.find(UiInputErrors)
    expect(errors.html()).toContain(error1)
    expect(errors.html()).toContain(error2)
  })
})
