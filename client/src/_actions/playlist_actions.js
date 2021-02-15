import {
    SET_INDEX,
    SET_SHOW,
    SET_PLAYLIST,
    SET_PAUSED,
    NEXT_BEAT,
    PREV_BEAT,
} from './types';

export function setIndex(index) {
    return {
        type: SET_INDEX,
        payload: index
    }
}

export function setShow(bool) {
    return {
        type: SET_SHOW,
        payload: bool
    }
}

export function setPlaylist(playlist) {
    return {
        type: SET_PLAYLIST,
        payload: playlist
    }
}

export function setPaused(bool) {
    return {
        type: SET_PAUSED,
        payload: bool
    }
}

export function nextBeat(index) {
    return {
        type: NEXT_BEAT,
        payload: index
    }
}
    
export function prevBeat(index) {
    return {
        type: PREV_BEAT,
        payload: index
    }
}
