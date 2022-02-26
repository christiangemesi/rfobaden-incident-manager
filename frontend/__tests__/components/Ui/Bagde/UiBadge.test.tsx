/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiBadge from '@/components/Ui/Badge/UiBadge'

describe('UiDateLabel', () => {
  it('should correctly display a single past date', () => {
    const children = <div></div>
    const value = 123
    const html = shallow(<UiBadge value={value} children={children} />)
    expect(html.text()).toBe(value.toString())
  })
})