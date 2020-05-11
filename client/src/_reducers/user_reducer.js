import {
    LOGIN_USER,
    LOGIN_ANON_USER,
    REGISTER_USER,
    REGISTER_ANON_USER,
    AUTH_USER,
    LOGOUT_USER,
} from '../_actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case REGISTER_ANON_USER:
            return { ...state, anon: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case LOGIN_ANON_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
        default:
            return state;
    }
}