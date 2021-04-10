import {
    CREATE_CART,
    GET_CART,
    ADD_TO_CART,
    GET_ITEMS_INFO_CART,
    REMOVE_FROM_CART,
    REMOVE_ALL_FROM_CART
} from '../_actions/types';

const initialState = {
    success: false,
    cartId: "",
    items: [],
    cartDetail: []
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CART:
            return state;
        case GET_CART:
            if (action.payload.success) {
                return {
                    success: true,
                    cartId: action.payload.cart._id,
                    items: action.payload.cart.items,
                    cartDetail: [],
                };
            } else {
                return {...state, success: false};
            }
        case ADD_TO_CART:
            return {...state, items: action.payload.items}
        case GET_ITEMS_INFO_CART:
            return {
                ...state, cartDetail: action.payload
            }
        case REMOVE_FROM_CART:
            if (Object.keys(action.payload.cart).length === 0) {
                return {
                    ...state,
                    items: [],
                    cartDetail: action.payload.cartDetail
                }
            } else {
                return {
                    ...state,
                    cart: {...state.cart, array: action.payload.cart},
                    cartDetail: action.payload.cartDetail
                }
            }
        case REMOVE_ALL_FROM_CART:
            if (Object.keys(action.payload.cart).length === 0) {
                return {
                    ...state,
                    items: [],
                    cartDetail: action.payload.cartDetail
                }
            } else {
                return {
                    ...state,
                    cart: {...state.cart, items: action.payload.cart},
                    cartDetail: action.payload.cartDetail
                }
            }
        default:
            return state;
    }
}

export default cartReducer;
