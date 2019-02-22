import React from 'react'
import MessageApp from './Root'
import { mockFetch } from '../../test/mockFetch'
import { render, wait, fireEvent } from 'react-testing-library'

describe('PersonQuery', () => {
  const mockQuery = {
    getMessage: {
      __typename: 'getMessage',
      pageInfo: null,
      edges: [
        {
          __typename: 'edges',
          cursor: '55a248e46f0b57f48e27',
          node: {
            __typename: 'node',
            id: '55a248e46f0b57f48e27',
            content: 'init content',
            author: 'Davis'
          }
        }
      ],
    }
  }
  const mockMutation = {
    createMessage: {
      messageEdge: {
        node: {
          author: "andy",
          id: "008c542c4d78c2725706",
          content: "but we don't have it"
        }
      }
    }
  }

  describe('Root app',() => {
    it('should render content when given a successful response', async () => {
      mockFetch({response: { data: mockQuery }})
      const wrapper = render(<MessageApp />)
      await wait(() => wrapper.getByText('submit'))
      
      const authorInput = wrapper.getByPlaceholderText('Author')
      fireEvent.change(authorInput, { target: { value: 'andy' } })
      const contentInput = wrapper.getByPlaceholderText('Content')
      fireEvent.change(contentInput, { target: { value: "but we don't have it" } })

      mockFetch({response: { data: mockMutation }})
      
      fireEvent.click(wrapper.getByText('submit'))
      
      await wait(() => wrapper.getByText('andy'))
      expect(wrapper.getByText('andy')).toBeTruthy()
    })
  })
})
