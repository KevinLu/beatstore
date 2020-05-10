import {
    LOGIN_USER,
    LOGIN_ANON_USER,
    REGISTER_USER,
    REGISTER_ANON_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_FROM_CART_USER
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
        case ADD_TO_CART_USER:
            return {
                ...state, userData: {
                    ...state.userData,
                    cart: action.payload
                }
            }
        case GET_CART_ITEMS_USER:
            return {
                ...state, cartDetail: action.payload
            }
        case REMOVE_FROM_CART_USER:
            return {
                ...state,
                cartDetail: action.payload.cartDetail,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}