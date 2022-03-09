/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from '@/theme'
import UiPrioritySlider from '@/components/Ui/PrioritySlider/UiPrioritySlider'
import Priority from '@/models/Priority'

describe('UiPrioritySlider', () => {
  it('should correctly display priority low', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiPrioritySlider value={Priority.LOW} onChange={mockCallBack} />
      </ThemeProvider>
    )
    const slider = wrapper.find('UiPrioritySlider__Selector')
    expect(slider.props().value).toBe('LOW')
  })
  it('should correctly display priority medium', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiPrioritySlider value={Priority.MEDIUM} onChange={mockCallBack} />
      </ThemeProvider>
    )
    const slider = wrapper.find('UiPrioritySlider__Selector')
    expect(slider.props().value).toBe('MEDIUM')
  })
  it('should correctly display priority high', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiPrioritySlider value={Priority.HIGH} onChange={mockCallBack} />
      </ThemeProvider>
    )
    const slider = wrapper.find('UiPrioritySlider__Selector')
    expect(slider.props().value).toBe('HIGH')
  })
  it('should correctly display errors', () => {
    const mockCallBack = jest.fn()
    const error1 = 'error1'
    const error2 = 'error2'
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiPrioritySlider value={Priority.MEDIUM} errors={[error1, error2]} onChange={mockCallBack} />
      </ThemeProvider>
    )
    const errors = wrapper.find('UiInputErrors__Errors')
    expect(errors.html()).toContain(error1)
    expect(errors.html()).toContain(error2)
  })
})