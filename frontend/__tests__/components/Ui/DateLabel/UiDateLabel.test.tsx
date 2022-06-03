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
    expect(html.html()).toContain('<span><span>09.11.2012 10:20</span></span>')
  })

  it('should correctly display a single future date', () => {
    const html = shallow(<UiDateLabel start={futureDate} />)
    expect(html.html()).toBe('<span><span>06.06.4000</span></span>')
  })

  it('should correctly display a pair of past dates', () => {
    const html = shallow(<UiDateLabel start={pastDate} end={pastDate2} />)
    expect(html.html()).toBe('<span><p><span>09.11.2012 10:20</span> - <span>02.02.2013 08:12</span></p></span>')
  })

  it('should correctly display a pair of future dates', () => {
    const html = shallow(<UiDateLabel start={futureDate} end={futureDate2} />)
    expect(html.html()).toBe('<span><p><span>06.06.4000</span> - <span>04.04.4001</span></p></span>')
  })

  it('should render the date and time if configured to do so', () => {
    const html = shallow(<UiDateLabel start={pastDate} type="datetime" />)
    expect(html.html()).toBe('<span><span>09.11.2012 10:20</span></span>')
  })

  it('should render the date and time of both dates if configured to do so', () => {
    const html = shallow(<UiDateLabel start={pastDate} end={pastDate2} type="datetime" />)
    expect(html.html()).toBe('<span><p><span>09.11.2012 10:20</span> - <span>02.02.2013 08:12</span></p></span>')
  })
})
