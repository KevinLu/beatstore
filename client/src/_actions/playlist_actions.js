import {
    SET_INDEX,
    SET_SHOW
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
