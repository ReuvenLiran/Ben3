import '../styles/SongItem.scss'
import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class SongItem extends Component {

  handleClick (song) {
    this.props.setActiveSong(song)
  }

  secondsToMinutes (s) {
    var m = Math.floor(s / 60) // Get remaining minutes
    s -= m * 60
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s) // zero padding on minutes and seconds
  }

  alignArtists (artists) {
    var strArtists = ''
    artists.map((artist) => {
      strArtists = strArtists.concat(artist).concat(', ')
    })

    return strArtists.slice(0, strArtists.length - 2)
  }

  render () {
    const { song, activeSong } = this.props

    let songItemClass = classnames('song-item', { 'active-song': song._id === activeSong._id })
    // let songItemClass = classnames('btn btn-lg song-item', { 'active-song': song._id === activeSong._id })

    return (
      <li className={songItemClass} onClick={() => { this.handleClick(song) }}
        key={song.file}>
        <div className='player-cover1'
          style={{ backgroundImage: 'url("data:image/png;base64,' + song.cover + '")' }} />
        <div style={{ 'float' : 'left', 'width' : '20vw', 'margin-left' : '5vw' }} className='song-name'>
          {song.track_name}
        </div>
        <div style={{ 'float' : 'left', 'width' : '40vw', 'margin-left' : '5vw' }} className='artists'>
          {this.alignArtists(song.artists)}
        </div>
        <div style={{ 'float' : 'left', 'width' : '5vw', 'margin-left' : '5vw' }} className='duration'>
          {this.secondsToMinutes(song.track_length)}
        </div>
      </li>
    )
  }
}

SongItem.propTypes = {
  song: PropTypes.object.isRequired,
  setActiveSong: PropTypes.func.isRequired,
  activeSong: PropTypes.object.isRequired
}

export default SongItem
