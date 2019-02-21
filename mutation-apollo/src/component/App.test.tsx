import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { mount } from 'enzyme'

import '../../test/setup'

import clientMock from '../../test/client-mock'

import { GraphQLPerson } from './App'
import { SWPersonQUERY } from './queries'

describe('GraphQLPerson', () => {
  it('calls the query method on Apollo Client', () => {
    const clientMockSpy = jest.spyOn(clientMock, 'watchQuery');

    mount(
      <ApolloProvider client={clientMock}>
        <GraphQLPerson personID={'1'} />
      </ApolloProvider>,
    )

    expect(clientMockSpy).toHaveBeenCalled()
    expect(clientMockSpy.mock.calls[0][0].query).toEqual(SWPersonQUERY)
    clientMockSpy.mockRestore()
  })

  it('Render component', () => {
    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <GraphQLPerson personID={'1'} />
      </ApolloProvider>,
    )
    expect(wrapper.find('div').at(1).text()).toEqual('Luke Skywalker')
  })
})
