import {
    SET_INDEX,
    SET_SHOW
} from '../_actions/types';

const initialState = {
    index: 0,
    show: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_INDEX:
            return { ...state, index: action.payload };
        case SET_SHOW:
            return { ...state, show: action.payload };
        default:
            return state;
    }
}