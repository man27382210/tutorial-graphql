import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import { modernEnvironment } from '../env'
import { MessageQuery } from './Root'
import { mockFetch } from '../../test/mockFetch'

describe('MessageQuery', () => {
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

  describe('Root app', () => {
    it('should render content when given a successful response', async () => {
      mockFetch({response: { data: mockData }})
      const wrapper = mount(<MessageQuery />)
      return Promise.resolve(wrapper)
        .then((comp) => {
          return comp.update()
        })
        .then(() => {
          expect(wrapper.text()).toContain("Davis")
        })
    })

    it('should render error when given a fail response', async () => {
      mockFetch({status: 500})
      modernEnvironment.getStore().getSource().clear()
      const wrapper = mount(<MessageQuery />)
      return Promise.resolve(wrapper)
        .then((comp) => {
          return comp.update()
        })
        .then(() => {
          expect(wrapper.text()).toContain("Error")
        })
    })
  })
})
