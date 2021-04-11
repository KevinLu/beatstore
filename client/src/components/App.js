import React from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCart, getCart } from "../_actions/cart_actions";
import Auth from "../hoc/auth";
// pages for this product
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import BeatPlayer from "./views/BeatPlayer/BeatPlayer";
import DownloadPage from "./views/DownloadPage/DownloadPage";
import SearchResultsPage from './views/SearchResultsPage/SearchResultsPage';
import ErrorNotFoundPage from "./views/ErrorNotFoundPage/ErrorNotFoundPage";
import { AudioContextProvider } from "./utils/AudioContext";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const newCart = () => {
    dispatch(createCart())
      .then(response => {
        if (response.payload.success) {
          window.localStorage.setItem("cartId", response.payload.cart._id);
        } else {
          console.log(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getCartInfo = (cartId) => {
    dispatch(getCart(cartId))
      .then(response => {
        if (!response.payload.success) {
          // Cart id was not valid, create a new cart
          newCart();
        }
      });
  }

  if (!window.localStorage.getItem("cartId")) {
    newCart();
  } else {
    getCartInfo(window.localStorage.getItem("cartId"));
  }

  return (
    <ChakraProvider>
      <CSSReset />
      <AudioContextProvider>
        <NavBar>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, PUBLIC_PAGE, false)} />
            <Route exact path="/login" component={Auth(LoginPage, PUBLIC_ONLY, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, PUBLIC_ONLY, false)} />
            <Route exact path="/upload" component={Auth(UploadBeatPage, LOGGED_IN_ONLY, true)} />
            <Route exact path="/beat/:beatUrl" component={Auth(BeatPage, PUBLIC_PAGE, false)} />
            <Route exact path="/cart" component={Auth(CartPage, PUBLIC_PAGE, false)} />
            <Route exact path="/orders" component={Auth(OrdersPage, LOGGED_IN_ONLY, false)} />
            <Route exact path="/download" component={Auth(DownloadPage, PUBLIC_PAGE, false)} />
            <Route exact path="/beats" component={Auth(SearchResultsPage, PUBLIC_PAGE, false)} />
            <Route component={Auth(ErrorNotFoundPage, PUBLIC_PAGE, false)} />
          </Switch>
          <Main />
        </NavBar>
        {location.pathname.includes("dashboard") ? <div></div> : <Footer />}
        <BeatPlayer />
       </AudioContextProvider>
    </ChakraProvider>
  );
}

export default App;
