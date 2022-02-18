/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme'
import UiTitle from '@/components/Ui/Title/UiTitle'

const someTitleText = 'Blablabla'

describe('UiTitle', () => {
  it('with level 1 should be a h1 tag with correct content', () => {
    const html = shallow(<UiTitle level={1}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h1>') // check on end tag as otherwise could be in text
    expect(html.html()).toContain(someTitleText)
  })
  it('with level 2 should be a h2 tag with correct content', () => {
    const html = shallow(<UiTitle level={2}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h2>')
    expect(html.html()).toContain(someTitleText)
  })
  it('with level 3 should be a h3 tag with correct content', () => {
    const html = shallow(<UiTitle level={3}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h3>')
    expect(html.html()).toContain(someTitleText)
  })
  it('with level 4 should be a h4 tag with correct content', () => {
    const html = shallow(<UiTitle level={4}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h4>')
    expect(html.html()).toContain(someTitleText)
  })
  it('with level 5 should be a h5 tag with correct content', () => {
    const html = shallow(<UiTitle level={5}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h5>')
    expect(html.html()).toContain(someTitleText)
  })
  it('with level 6 should be a h6 tag with correct content', () => {
    const html = shallow(<UiTitle level={6}>{someTitleText}</UiTitle>)
    expect(html.html()).toContain('</h6>')
    expect(html.html()).toContain(someTitleText)
  })
})
