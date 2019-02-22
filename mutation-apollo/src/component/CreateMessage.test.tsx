import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { mount } from 'enzyme'

import '../../test/setup'

import clientMock from '../../test/client-mock'

import { CreateMessage } from './CreateMessage'
import { createMessageSchema } from './mutation'

describe('CreateMessage', () => {
  it('calls the mutation method on Apollo Client', () => {
    const clientMockSpy = jest.spyOn(clientMock, 'mutate');

    const wrapper = mount(
      <ApolloProvider client={clientMock}>
        <CreateMessage />
      </ApolloProvider>,
    )

    wrapper.find('button').simulate('click');
    expect(clientMockSpy).toHaveBeenCalled()
    expect(clientMockSpy.mock.calls[0][0].mutation).toEqual(createMessageSchema)
  })
})
