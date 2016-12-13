import '../styles/SongList.scss'
import React, { Component, PropTypes } from 'react'
import SongItem from '../containers/SongItemContainer'

class SongsList extends Component {

  componentWillMount () {
   // this.props.fetchSongs()
  }

  renderSongs (songs) {
    return songs.map((song) => {
      return (
        <SongItem song={song} />
      )
    })
  }

  render () {
    const { songs } = this.props
    console.log('SongsList', songs)

    return (
      <div className='container' style={{ 'margin' : '0', 'width' : 'inherit' }} >
        <ul className='list-group songs-list'>
          {this.renderSongs(songs)}
        </ul>
      </div>
    )
  }
}

SongsList.propTypes = {
  songs: PropTypes.array.isRequired
}

export default SongsList
