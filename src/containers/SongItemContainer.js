import { connect } from 'react-redux'
import { setActiveSong } from '../actions/songs'

import SongItem from '../components/SongItem'

const mapStateToProps = (state) => {
  return {
    activeSong: state.songs.activeSong
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveSong: (song) => {
      dispatch(setActiveSong(song))
    }
  }
}

const SongItemContainer = connect(mapStateToProps, mapDispatchToProps)(SongItem)

export default SongItemContainer
