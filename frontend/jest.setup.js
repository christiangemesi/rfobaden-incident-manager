import '@testing-library/jest-dom/extend-expect'

import Enzyme from 'enzyme'

// This is an unofficial adapter, since there's not yet an offical enzyme adapter for React 17 (2021.12.09).
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({ adapter: new Adapter() })
