/**
 * @jest-environment jsdom
 */

import UiDateLabel from '@/components/Ui/DateLabel/UiDateLabel'
import { shallow } from 'enzyme'

const pastDate = new Date(2012, 10, 9, 10, 20)
const pastDate2 = new Date(2013, 1, 2, 8, 12)
const futureDate = new Date(4000, 5, 6)
const futureDate2 = new Date(4001, 3, 4)

describe('UiDateLabel', () => {
  it('should correctly display a single past date', () => {
    const html = shallow(<UiDateLabel start={pastDate} />)
    expect(html.html()).toBe('seit 09.10.2012')
  })

  it('should correctly display a single future date', () => {
    const html = shallow(<UiDateLabel start={futureDate} />)
    expect(html.html()).toBe('ab 06.05.4000')
  })

  it('should correctly display a pair of past dates', () => {
    const html = shallow(<UiDateLabel start={pastDate} end={pastDate2} />)
    expect(html.html()).toBe('von 09.10.2012 bis 02.01.2013')
  })

  it('should correctly display a pair of future dates', () => {
    const html = shallow(<UiDateLabel start={futureDate} end={futureDate2} />)
    expect(html.html()).toBe('von 06.05.4000 bis 04.03.4001')
  })

  it('should render the date and time if configured to do so', () => {
    const html = shallow(<UiDateLabel start={pastDate} type="datetime" />)
    expect(html.html()).toBe('seit 09.10.2012 10:20')
  })

  it('should render the date and time of both dates if configured to do so', () => {
    const html = shallow(<UiDateLabel start={pastDate} end={pastDate2} type="datetime" />)
    expect(html.html()).toBe('von 09.10.2012 10:20 bis 02.01.2013 08:12')
  })
})