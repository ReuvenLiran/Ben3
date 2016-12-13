import React, { Component, PropTypes } from 'react'

export default class App extends Component {
  componentWillMount () {
    // this.props.loadUserFromToken()
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }

  propTypes = {
    children: PropTypes.any
  }
}
