import React, { Component } from 'react'
import { createMessageMutation } from '../mutation/CreateMessageMutation'

export class CreateMessage extends Component {
  authorRef = React.createRef()
  contentRef = React.createRef()

  render() {
    return (
      <div>
        <div>
          <input
            ref={this.authorRef}
            type='text'
            placeholder='Author'
          />
          <input
            ref={this.contentRef}
            type='text'
            placeholder='Content'
          />
        </div>
        <button
          onClick={() => this._createMessage()}
        >
          submit
        </button>
      </div>
    )
  }

  _createMessage = () => {
    const { value: authorValue } =  this.authorRef.current 
    const { value: contentValue } =  this.contentRef.current 
    if (authorValue && contentValue) {
      createMessageMutation(authorValue, contentValue, () => {
        console.log('Update complete')
      })
    }
  }
}
