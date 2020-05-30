import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
} from '../_actions/types';

const initialState = {
    userData: {
        isAuth: false,
        role: 0,
        error: true
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state, userData: state }
        default:
            return state;
    }
}