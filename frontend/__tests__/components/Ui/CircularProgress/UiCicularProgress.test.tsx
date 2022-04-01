/**
 * @jest-environment jsdom
 */

import { render, shallow } from 'enzyme'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiCircularProgressSVG from '@/components/Ui/CircularProgress/UiCircularProgressSVG'
import { defaultTheme } from '@/theme'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'
import { ThemeProvider } from 'styled-components'

describe('UiCircularProgress', () => {
  it('Should contain the correct progress numbers', () => {
    const html = render(
      <ThemeProvider theme={defaultTheme}>
        <UiCircularProgressSVG done={0} total={0} />
      </ThemeProvider>
    )
    const stats = html.find('text').first()
    expect(stats.text()).toBe('0/0')

    const percentage = html.find('text').last()
    expect(percentage.text()).toBe('0%')
  })

  it('should correctly display the amount of completed tasks', () => {
    const html = render(
      <ThemeProvider theme={defaultTheme}>
        <UiCircularProgressSVG done={1} total={2} />
      </ThemeProvider>
    )
    const stats = html.find('text').first()
    expect(stats.text()).toBe('1/2')

    const percentage = html.find('text').last()
    expect(percentage.text()).toBe('50%')
  })
})