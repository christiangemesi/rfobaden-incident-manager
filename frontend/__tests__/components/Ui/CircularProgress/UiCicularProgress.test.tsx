/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiTitle from '@/components/Ui/Title/UiTitle'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'

describe('UiCircularProgress', () => {
  describe('With two titles in it', () => {
    it('Should be the first a h5 and the second a h6 title', () => {
      const html = shallow(<UiCircularProgress done={0} total={0} />)
      const title1 = html.find(UiTitle).first()
      expect(title1.html()).toContain('h5')
      expect(title1.text()).toBe('0/0')

      const title2 = html.find(UiTitle).at(1)
      expect(title2.html()).toContain('h6')
      expect(title2.text()).toBe('0%')
    })

    it('Should correctly display the amount of completed tasks', () => {
      const html = shallow(<UiCircularProgress done={1} total={2} />)
      const title1 = html.find(UiTitle).first()
      expect(title1.html()).toContain('h5')
      expect(title1.text()).toBe('1/2')

      const title2 = html.find(UiTitle).at(1)
      expect(title2.html()).toContain('h6')
      expect(title2.text()).toBe('50%')
    })
  })
})