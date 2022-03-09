/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'

const text = 'abcABC123#'

describe('UiTextInput', () => {
  it('should have type text', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiTextInput value="" type="text" label={text} onChange={mockCallBack} />
      </ThemeProvider>)
    expect(wrapper.find('input').first().props().type).toBe('text')
  })
  it('should have type password', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiTextInput value="" type="password" label={text} onChange={mockCallBack} />
      </ThemeProvider>)
    expect(wrapper.find('input').first().props().type).toBe('password')
  })
  it('should display a placeholder', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiTextInput value="" type="text" placeholder={text} label={text} onChange={mockCallBack} />
      </ThemeProvider>)
    expect(wrapper.find('input').first().props().placeholder).toBe(text)
  })
  it('should display a label', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiTextInput value="" label={text} onChange={mockCallBack} />
      </ThemeProvider>)
    expect(wrapper.find('span').first().html()).toContain(text)
  })
})

