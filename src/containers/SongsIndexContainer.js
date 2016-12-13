import { connect } from 'react-redux'
import { fetchSongs, fetchSongsSuccess, setActiveSong } from '../actions/songs'

import SongsIndex from '../components/SongsIndex'

const mapStateToProps = (state) => {
  return {
    songsList: state.songs.songsList,
    activeSong: state.songs.activeSong
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSongs: () => {
      dispatch(fetchSongs()).then((response) => {
        dispatch(fetchSongsSuccess(response.payload))
        dispatch(setActiveSong(response.payload.data[0]))
      })
    }
  }
}

const SongsIndexContainer = connect(mapStateToProps, mapDispatchToProps)(SongsIndex)

export default SongsIndexContainer
