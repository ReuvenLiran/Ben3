import { connect } from 'react-redux'
import { setActiveSong } from '../actions/songs'

import ReactMusicPlayer from '../components/ReactMusicPlayer'

const mapStateToProps = (state) => {
  return {
    activeSong: state.songs.activeSong
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveSong: (activeSong) => {
           // console.log('setActiveSong', activeSong);
      dispatch(setActiveSong(activeSong))
    }
  }
}

const ReactMusicPlayerContainer = connect(mapStateToProps, mapDispatchToProps)(ReactMusicPlayer)

export default ReactMusicPlayerContainer
