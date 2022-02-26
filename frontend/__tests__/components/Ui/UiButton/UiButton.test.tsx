/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiActionButton from '@/components/Ui/Button/UiActionButton'


describe('UiButton', () => {
  it('should be "button" tag', () => {
    const html = shallow(<UiActionButton><div> </div></UiActionButton>)
    expect(html.html()).toContain('</button>')
  })
})
