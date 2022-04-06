/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme'
import { defaultTheme } from '@/theme'

import { ThemeProvider } from 'styled-components'
import UiConfirmButtons from '@/components/Ui/Confirm/Buttons/UiConfirmButtons'


describe('UiConfirmButtons', () => {
  it('should be a "button" tag', () => {
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiConfirmButtons />
      </ThemeProvider>,
    )
    expect(wrapper.html()).toContain('</button>')
  })

  it('should be a submit button', () => {
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiConfirmButtons type={'submit'} />
      </ThemeProvider>,
    )
    const btn = wrapper.find('button')
    expect(btn.props().type).toBe('submit')
  })

  it('should be a default button', () => {
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiConfirmButtons type={'button'} />
      </ThemeProvider>,
    )
    const btn = wrapper.find('button')
    expect(btn.props().type).toBe('button')
  })

  it('should call the onSubmit function', () => {
    const mockCallBack = jest.fn()
    const wrapper = mount(
      <ThemeProvider theme={defaultTheme}>
        <UiConfirmButtons onSubmit={mockCallBack} />
      </ThemeProvider>,
    )
    wrapper.find('button').simulate('click')
    expect(mockCallBack.mock.calls).toHaveLength(1)
  })
})

