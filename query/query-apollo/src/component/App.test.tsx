import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { mount } from 'enzyme'

import '../../test/setup'

import clientMock from '../../test/client-mock'

import { Messages } from './App'
import { messageQUERY } from './queries'

describe('Messages', () => {
  it('calls the query method on Apollo Client', () => {
    const clientMockSpy = jest.spyOn(clientMock, 'watchQuery');

    mount(
      <ApolloProvider client={clientMock}>
        <Messages />
      </ApolloProvider>,
    )

    expect(clientMockSpy).toHaveBeenCalled()
    expect(clientMockSpy.mock.calls[0][0].query).toEqual(messageQUERY)
    clientMockSpy.mockRestore()
  })

  it('Render component', () => {
    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <Messages />
      </ApolloProvider>,
    )
    expect(wrapper.find('div').at(1).text()).toEqual('Davis')
  })
})
