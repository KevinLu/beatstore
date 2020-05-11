import {
    CREATE_CART,
    GET_CART,
    ADD_TO_CART,
    GET_ITEMS_INFO_CART,
    REMOVE_FROM_CART
} from '../_actions/types';

const initialState = {
    success: false,
    cart: {
        array: [],
        _id: "",
        _v: 0
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_CART:
            return { ...state, createCart: action.payload }
        case GET_CART:
            return action.payload
        case ADD_TO_CART:
            return { ...state, cart: action.payload }
        case GET_ITEMS_INFO_CART:
            return {
                ...state, cartDetail: action.payload
            }
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartDetail: action.payload.cartDetail,
                cartData: {
                    ...state.cartData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}