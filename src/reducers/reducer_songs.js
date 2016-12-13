import { FETCH_SONGS, FETCH_SONGS_SUCCESS,
         FETCH_SONGS_FAILURE, RESET_SONGS,
         ACTIVE_SONG
} from '../actions/songs'

const INITIAL_STATE =
  { songsList: { songs: [], error:null, loading: true },
    activeSong:{ song:null, error:null, loading: false }
  }

export default function (state = INITIAL_STATE, action) {
  let error

  switch (action.type) {

    case FETCH_SONGS: // start fetching songs and set loading = true
      return { ...state, songsList: { songs:[], error: null, loading: true } }
    case FETCH_SONGS_SUCCESS: // return list of songs and make loading = false
      return { ...state, songsList: { songs: action.payload.data, error:null, loading: false } }
    case FETCH_SONGS_FAILURE:// return error and make loading = false
      error = action.payload.data || { message: action.payload.message }// 2nd one is network or server down errors
      return { ...state, songsList: { songs: [], error: error, loading: false } }
    case RESET_SONGS:// reset songList to initial state
      return { ...state, songsList: { songs: [], error:null, loading: false } }
    case ACTIVE_SONG:
      return { ...state, activeSong: action.payload }
    default:
      return state
  }
}
