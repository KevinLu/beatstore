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
    },
    cartDetail: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_CART:
            return state;
        case GET_CART:
            return { success: true, cart: action.payload.cart, cartDetail: [] }
        case ADD_TO_CART:
            return { ...state, cart: action.payload }
        case GET_ITEMS_INFO_CART:
            return {
                ...state, cartDetail: action.payload
            }
        case REMOVE_FROM_CART:
            console.log(action)
            if (Object.keys(action.payload.cart).length === 0) {
                return {
                    ...state,
                    cart: {
                        array: [],
                        _id: "",
                        _v: 0
                    },
                    cartDetail: action.payload.cartDetail
                }
            } else {
                return {
                    ...state,
                    cart: { ...state.cart, array: action.payload.cart },
                    cartDetail: action.payload.cartDetail
                }
            }
        default:
            return state;
    }
}