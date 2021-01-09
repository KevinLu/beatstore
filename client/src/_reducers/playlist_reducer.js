import {
    SET_INDEX,
    SET_SHOW,
    SET_PLAYLIST,
    SET_PAUSED
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
        default:
            return state;
    }
}

export default playlistReducer;
