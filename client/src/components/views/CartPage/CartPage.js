import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions';

function CartPage(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) { // if userData exists
            if (props.user.userData.cart.length > 0) { // if the cart is not empty
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id);
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart));
                console.log(cartItems)
                console.log(props.user.userData.cart)
            }
        }
    }, [props.user.userData])

    /*useEffect(() => {
        console.log(props.user.userData)
    }, [])*/

    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage
