jest.mock('react-relay', () => ({createFragmentContainer: component => component}))
import React from 'react'
import '../../test/setup'
import { mount } from 'enzyme'
import InfoFragment from './InfoFragment'

describe('Info', () => {
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

  describe('Info Fragment', () => {
    it('should render content when have data pass', async () => {
      const wrapper = mount(<InfoFragment classes={{}} data={mockPerson.person} />)
      expect(wrapper.text()).toContain("Luke Skywalker")
    })
    it('should render Error when given empty data', async () => {
      const wrapper = mount(<InfoFragment classes={{}} data={{}} />)
      expect(wrapper.text()).toContain("Error")
    })
  })
})
