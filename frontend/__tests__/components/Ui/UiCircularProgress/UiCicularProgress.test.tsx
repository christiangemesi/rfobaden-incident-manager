/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiCircularProgress from '@/components/Ui/CircularProgress/UiCircularProgress'

describe('UiTextInput', () => {
  it('should be "button" tag', () => {
    const html = shallow(<UiCircularProgress done={0} total={0} />)
  })
})