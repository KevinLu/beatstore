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
    },
    isLoaded: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            return {...state, register: action.payload, isLoaded: true};
        case LOGIN_USER:
            return {...state, loginSucces: action.payload, isLoaded: true};
        case AUTH_USER:
            return {...state, userData: action.payload, isLoaded: true};
        case LOGOUT_USER:
            return {...state, userData: state, isLoaded: true};
        default:
            return state;
    }
}

export default userReducer;
