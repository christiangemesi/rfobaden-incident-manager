/**
 * @jest-environment jsdom
 */

import UiDate, { UiDateType } from '@/components/Ui/Date/UiDate'
import { shallow } from 'enzyme'

// Be aware! https://stackoverflow.com/questions/2552483/why-does-the-month-argument-range-from-0-to-11-in-javascripts-date-constructor
const singleDigitDate = new Date(2012, 7, 8, 1, 2)
const normalDate = new Date(2013, 10, 20, 20, 30)

describe('UiDate', () => {
  describe('with default type (datetime)', () => {
    it('should correctly display a date and time with leading zeros', () => {
      const html = shallow(<UiDate value={singleDigitDate} />)
      expect(html.find('span').text()).toBe('08.08.2012 01:02')
    })

    it('should correctly display a date and time', () => {
      const html = shallow(<UiDate value={normalDate} />)
      expect(html.find('span').text()).toBe('20.11.2013 20:30')
    })
  })
  describe('with incorrect type', () => {
    it('should throw an error', () => {
      expect(()=>shallow(<UiDate value={singleDigitDate} type={'Banana' as UiDateType} />)).toThrow('Invalid type passed to UiDate')
    })
  })
  describe('with type date', () => {
    it('should correctly display a date with leading zeros', () => {
      const html = shallow(<UiDate value={singleDigitDate} type="date" />)
      expect(html.find('span').text()).toBe('08.08.2012')
    })

    it('should correctly display a date', () => {
      const html = shallow(<UiDate value={normalDate} type="date" />)
      expect(html.find('span').text()).toBe('20.11.2013')
    })
  })
  describe('with type time', () => {
    it('should correctly display a time with leading zeros', () => {
      const html = shallow(<UiDate value={singleDigitDate} type="time" />)
      expect(html.find('span').text()).toBe('01:02')
    })

    it('should correctly display a time', () => {
      const html = shallow(<UiDate value={normalDate} type="time" />)
      expect(html.find('span').text()).toBe('20:30')
    })
  })
  describe('with type datetime', () => {
    it('should correctly display a date and time with leading zeros', () => {
      const html = shallow(<UiDate value={singleDigitDate} type="datetime" />)
      expect(html.find('span').text()).toBe('08.08.2012 01:02')
    })

    it('should correctly display a date and time', () => {
      const html = shallow(<UiDate value={normalDate} type="datetime" />)
      expect(html.find('span').text()).toBe('20.11.2013 20:30')
    })
  })
})
