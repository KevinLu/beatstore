import axios from 'axios';
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
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function registerAnonUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/registerAnon`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_ANON_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function loginAnonUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/loginAnon`, dataToSubmit)
        .then(response => response.data);

    return {
        type: LOGIN_ANON_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(_id) {
    const request = axios.post(`${USER_SERVER}/addToCart?beatId=${_id}`)
        .then(response => response.data);

    return {
        type: ADD_TO_CART_USER,
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
        type: GET_CART_ITEMS_USER,
        payload: request
    }
}

export function removeFromCart(_id) {
    const request = axios.get(`${USER_SERVER}/removeFromCart?id=${_id}`)
        .then(response => {
            console.log(response)
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
        type: REMOVE_FROM_CART_USER,
        payload: request
    }
}
