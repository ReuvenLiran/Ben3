import { combineReducers } from 'redux'
import SongsReducer from './reducer_songs'

const rootReducer = combineReducers({
  songs: SongsReducer // <-- Songs
})

export default rootReducer
