/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiTextInput from '@/components/Ui/Input/Text/UiTextInput'

const text = 'abcABC123#'

describe('UiTextInput', () => {
  describe('With label text', () => {
    it('should correctly display the label text', () => {
      const mockCallBack = jest.fn()
      const html = shallow(<UiTextInput value="" label={text} onChange={mockCallBack} /> )

      const span = html.find('span')
      expect(span.html()).toContain('</span>')
      expect(span.html()).toContain(text)
    })
  })

  describe('With input type text', () => {
    it('Should have type text', () => {
      const mockCallBack = jest.fn()
      const html = shallow(<UiTextInput value={text} type="text" onChange={mockCallBack} /> )
    })
  })
})

