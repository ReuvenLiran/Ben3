import '../styles/ReactMusicPlayer.scss'
import * as constants from '../constants'
import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import shuffle from 'shuffle-array'

class ReactMusicPlayer extends Component {

  state = {
    activeSong: this.props.activeSong,
    active: this.props.activeSong,
    current: 0,
    progress: 0,
    random: false,
    repeat: false,
    mute: false,
    play: this.props.autoplay || false,
    songs: this.props.songs
  }

  componentDidMount = () => {
    let playerElement = this.refs.player
    playerElement.addEventListener('timeupdate', this.updateProgress)
    playerElement.addEventListener('ended', this.end)
    playerElement.addEventListener('error', this.next)
  }

  componentWillUnmount = () => {
    let playerElement = this.refs.player
    playerElement.removeEventListener('timeupdate', this.updateProgress)
    playerElement.removeEventListener('ended', this.end)
    playerElement.removeEventListener('error', this.next)
  }

  setProgress = (e) => {
    let target = e.target.nodeName === 'SPAN' ? e.target.parentNode : e.target
    let width = target.clientWidth
    let rect = target.getBoundingClientRect()
    let offsetX = e.clientX - rect.left
    let duration = this.refs.player.duration
    let currentTime = (duration * offsetX) / width
    let progress = (currentTime * 100) / duration

    this.refs.player.currentTime = currentTime
    this.setState({ progress: progress })
    this.play()
  }

  updateProgress = () => {
    let duration = this.refs.player.duration
    let currentTime = this.refs.player.currentTime
    let progress = (currentTime * 100) / duration

    this.setState({ progress: progress })
  }

  play = () => {
    this.setState({ play: true })
    this.refs.player.play()
  }

  pause = () => {
    this.setState({ play: false })
    this.refs.player.pause()
  }

  toggle = () => {
    this.state.play ? this.pause() : this.play()
  }

  end = () => {
    (this.state.repeat) ? this.play() : this.setState({ play: false })
  }

  next = () => {
    var total = this.state.songs.length
    var current = (this.state.repeat) ? this.state.current
        : (this.state.current < total - 1) ? this.state.current + 1 : 0
    var active = this.state.songs[current]

    this.setState({ current: current, active: active, progress: 0 })
    this.props.setActiveSong(active)
        // this.refs.player.src = active.url;
    this.refs.player.src = active.file
    this.play()
  }

  previous = () => {
    var total = this.state.songs.length
    var current = (this.state.current > 0) ? this.state.current - 1 : total - 1
    var active = this.state.songs[current]

    this.setState({ current: current, active: active, progress: 0 })
    this.props.setActiveSong(active)
        // this.refs.player.src = active.url;
    this.refs.player.src = active.file
    this.play()
  }

  randomize = () => {
    var s = shuffle(this.state.songs.slice())

    this.setState({ songs: (!this.state.random) ? s : this.state.songs, random: !this.state.random })
  }

  repeat = () => {
    this.setState({ repeat: !this.state.repeat })
  }

  toggleMute = () => {
    let mute = this.state.mute

    this.setState({ mute: !this.state.mute })
    this.refs.player.volume = (mute) ? 1 : 0
  }

  setSong = () => {
    if (this.props.activeSong !== this.state.activeSong) {
      this.setState({ active: this.props.activeSong })
      this.setState({ activeSong: this.props.activeSong })
    }
  }

  alignArtists (artists) {
    var strArtists = ''
    if (artists !== undefined) {
      artists.map((artist) => {
        strArtists = strArtists.concat(artist).concat(', ')
      })
    }
    return strArtists.slice(0, strArtists.length - 2)
  }

  render () {
    this.setSong()
    const { activeSong, play, progress } = this.state

    // let coverClass = classnames('player-cover', { 'no-height': activeSong.cover })
    let playPauseClass = classnames('fa', { 'fa-pause': play }, { 'fa-play': !play })
    let volumeClass = classnames('fa', { 'fa-volume-up': !this.state.mute }, { 'fa-volume-off': this.state.mute })
    let repeatClass = classnames('player-btn small repeat', { 'active': this.state.repeat })
    let randomClass = classnames('player-btn small random', { 'active': this.state.random })

    return (
      <div className='player-container'>
        <audio src={constants.ROOT_URL + '/' + activeSong.file}
          autoPlay={this.state.play} preload='auto' ref='player' />

        <div className='player-cover'
          style={{ backgroundImage: 'url("data:image/png;base64,' + activeSong.cover + '")' }}>

          <div className='artist-info'>
            <h1 className='artist-song-name'>{activeSong.track_name}</h1>
            <h3 className='artist-name'>{this.alignArtists(activeSong.artists)}</h3>
          </div>

        </div>

        <div className='player-progress-container' onClick={this.setProgress}>
          <span className='player-progress-value' style={{ width: progress + '%' }} />
        </div>

        <div className='player-options'>
          <div className='player-buttons player-controls'>
            <button onClick={this.toggle} className='player-btn big' title='Play/Pause'>
              <i className={playPauseClass} />
            </button>

            <button onClick={this.previous} className='player-btn medium' title='Previous Song'>
              <i className='fa fa-backward' />
            </button>

            <button onClick={this.next} className='player-btn medium' title='Next Song'>
              <i className='fa fa-forward' />
            </button>
          </div>

          <div className='player-buttons'>
            <button className='player-btn small volume' onClick={this.toggleMute} title='Mute/Unmute'>
              <i className={volumeClass} />
            </button>

            <button className={repeatClass} onClick={this.repeat} title='Repeat'>
              <i className='fa fa-repeat' />
            </button>

            <button className={randomClass} onClick={this.randomize} title='Shuffle'>
              <i className='fa fa-random' />
            </button>
          </div>

        </div>
      </div>
    )
  }
}

ReactMusicPlayer.propTypes = {
  autoplay: PropTypes.bool,
  songs: PropTypes.array.isRequired,
  setActiveSong: PropTypes.func.isRequired,
  activeSong: PropTypes.object
}

export default ReactMusicPlayer
