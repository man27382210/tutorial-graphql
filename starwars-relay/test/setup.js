import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

global.fetch = require('jest-fetch-mock')

configure({ adapter: new Adapter() })
