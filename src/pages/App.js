import { Component, PropTypes } from 'react'

export default class App extends Component {
  render () {
    return (
      /* <AppContainer> */
      this.props.children
      /* </AppContainer> */
    )
  }

  propTypes = {
    children: PropTypes.any
  }
}
