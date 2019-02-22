import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import { modernEnvironment } from '../env'
import { PersonQuery } from './Root'
import { mockFetch } from '../../test/mockFetch'

describe('PersonQuery', () => {
  const mockPerson = {
    person: {
      id: 'cGVvcGxlOjE=',
      name: 'Luke Skywalker',
      filmConnection: {
        films: [
          {
            title: 'A New Hope',
            episodeID: 4
          }
        ]
      },
      starshipConnection:{
        starships:[
          {  
            name: "X-wing",
            starshipClass: "Starfighter"
          }
        ],
        totalCount: 1
      }
    }
  }

  describe('Root app', () => {
    it('should render content when given a successful response', async () => {
      mockFetch({response: { data: mockPerson }})
      const wrapper = mount(<PersonQuery personID={'1'} />)
      return Promise.resolve(wrapper)
        .then((comp) => {
          return comp.update()
        })
        .then(() => {
          expect(wrapper.text()).toContain("Luke Skywalker")
        })
    })

    it('should render error when given a fail response', async () => {
      mockFetch({status: 500})
      modernEnvironment.getStore().getSource().clear()
      const wrapper = mount(<PersonQuery personID={'1'} />)
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
