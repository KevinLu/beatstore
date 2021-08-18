import { combineReducers } from 'redux';
import user_reducer from './user_reducer';
import cart_reducer from './cart_reducer';
import playlist_reducer from './playlist_reducer';
import license_reducer from './license_reducer';

const rootReducer = combineReducers({
    user: user_reducer,
    cart: cart_reducer,
    playlist: playlist_reducer,
    license: license_reducer,
});

export default rootReducer;