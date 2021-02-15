import {
    SET_INDEX,
    SET_SHOW,
    SET_PLAYLIST,
    SET_PAUSED,
    INC_INDEX,
    DEC_INDEX,
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

export function incIndex(index) {
    return {
        type: INC_INDEX,
        payload: index
    }
}
    
export function decIndex(index) {
    return {
        type: DEC_INDEX,
        payload: index
    }
}
