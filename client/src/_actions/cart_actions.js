import axios from 'axios';
import {
    CREATE_CART,
    GET_CART,
    ADD_TO_CART,
    GET_ITEMS_INFO_CART,
    REMOVE_FROM_CART
} from './types';
import { CART_SERVER } from '../components/Config.js';

export function createCart() {
    const request = axios.post(`${CART_SERVER}/create`)
        .then(response => response.data);

    return {
        type: CREATE_CART,
        payload: request
    }
}

export function getCart(cartId) {
    const request = axios.get(`${CART_SERVER}/cartById?cartId=${cartId}`)
        .then(response => response.data);

    return {
        type: GET_CART,
        payload: request
    }
}

export function addToCart(beatId, cartId) {
    const request = axios.post(`${CART_SERVER}/add?beatId=${beatId}&cartId=${cartId}`)
        .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}

export function getCartItems(cartItems, cartInfo) {
    const request = axios.get(`/api/beat/beats_by_id?id=${cartItems}&type=array`)
        .then(response => {
            cartInfo.forEach(cartItem => {
                response.data.forEach((beatDetail, index) => {
                    if (cartItem.id === beatDetail._id) {
                        response.data[index].quantity = cartItem.quantity;
                    }
                })
            })
            return response.data;
        });
    return {
        type: GET_ITEMS_INFO_CART,
        payload: request
    }
}

export function removeFromCart(beatId, cartId) {
    const request = axios.post(`${CART_SERVER}/remove?beatId=${beatId}&cartId=${cartId}`)
        .then(response => {
            response.data.cart.forEach(cartItem => {
                response.data.cartDetail.forEach((beatDetail, index) => {
                    if (cartItem.id === beatDetail._id) {
                        response.data.cartDetail[index].quantity = cartItem.quantity;
                    }
                })
            })
            return response.data;
        });
    return {
        type: REMOVE_FROM_CART,
        payload: request
    }
}
