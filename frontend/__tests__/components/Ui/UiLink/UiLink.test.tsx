/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiLink from '@/components/Ui/Link/UiLink'

const url = 'www.google.com'
const content = 'A link to google'

describe('UiLink', () => {
  it('should be "a" tag with content', () => {
    const html = shallow(<UiLink href={url}>{content}</UiLink>)
    expect(html.html()).toContain('</a>') // check on end tag as otherwise could be in text
    expect(html.html()).toContain(`href="${content}"`)
    expect(html.html()).toContain(content)
  })
})
