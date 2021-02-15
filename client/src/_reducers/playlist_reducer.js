import {
    SET_INDEX,
    SET_SHOW,
    SET_PLAYLIST,
    SET_PAUSED,
    NEXT_BEAT,
    PREV_BEAT,
} from '../_actions/types';

const initialState = {
    index: -1,
    show: false,
    paused: true,
    playlist: []
}

const playlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INDEX:
            return {...state, index: action.payload};
        case SET_SHOW:
            return {...state, show: action.payload};
        case SET_PLAYLIST:
            return {...state, playlist: action.payload};
        case SET_PAUSED:
            return {...state, paused: action.payload};
        case NEXT_BEAT:
            if (state.index + 1 === state.playlist.length) {
                return {...state, index: 0};
            } else {
                return {...state, index: state.index + 1};
            }
        case PREV_BEAT:
            if (state.index === 0) {
                return {...state, index: state.playlist.length - 1};
            } else {
                return {...state, index: state.index - 1};
            }
        default:
            return state;
    }
}

export default playlistReducer;
