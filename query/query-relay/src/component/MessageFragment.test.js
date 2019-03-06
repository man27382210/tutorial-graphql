jest.mock('react-relay', () => ({createFragmentContainer: component => component}))
import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import MessageFragment from './MessageFragment'

describe('Info', () => {
  const mockData = {
    getMessage: {
      edges: [
        {
          node: {
            id: "f303b555c9d1f9f97160",
            author: "Davis",
            content: "init content1"
          }
        }
      ]
    }
  }

  describe('Info Fragment', () => {
    it('should render content when have data pass', async () => {
      const wrapper = mount(<MessageFragment classes={{}} data={mockData.getMessage} />)
      expect(wrapper.text()).toContain("Davis")
    })
    it('should render Error when given empty data', async () => {
      const wrapper = mount(<MessageFragment classes={{}} data={{}} />)
      expect(wrapper.text()).toContain("Error")
    })
  })
})
