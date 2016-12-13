import { connect } from 'react-redux'
import { setActiveSong } from '../actions/songs'

import ReactMusicPlayerFloat from '../components/ReactMusicPlayerFloat'

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

const ReactMusicPlayerFloatContainer = connect(mapStateToProps, mapDispatchToProps)(ReactMusicPlayerFloat)

export default ReactMusicPlayerFloatContainer
