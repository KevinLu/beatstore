import { combineReducers } from 'redux';
import user_reducer from './user_reducer';
import cart_reducer from './cart_reducer';

const rootReducer = combineReducers({
    user: user_reducer,
    cart: cart_reducer
});

export default rootReducer;