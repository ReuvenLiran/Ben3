import '../styles/SongsIndex.scss'
import React, { Component, PropTypes } from 'react'
import SongsList from '../containers/SongsListContainer'
import ReactMusicPlayerFloat from '../containers/ReactMusicPlayerFloatContainer'
import CircularProgress from 'material-ui/CircularProgress'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class SongsIndex extends Component {

  componentWillMount () {
    this.props.fetchSongs()
  }

  render () {
    const { songs, loading, error } = this.props.songsList

    if (loading) {
      return (
        <div className='container'>
          <div id='CircularProgress'>
            <MuiThemeProvider>
              <CircularProgress size={52} />
            </MuiThemeProvider>
          </div>
        </div>
      )
    } else if (error) {
      return <div className='alert alert-danger'>Error: {error.message}</div>
    } else {
      return (
        <div className='container'>
          <SongsList height='80%' songs={songs} />
          <ReactMusicPlayerFloat height='20%' songs={songs} song={songs[0]} />
        </div>
      )
    }
  }
}

SongsIndex.propTypes = {
  songsList: PropTypes.array.isRequired,
  fetchSongs: PropTypes.func.isRequired
}

export default SongsIndex
