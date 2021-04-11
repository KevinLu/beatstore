import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCart, getCart } from "../_actions/cart_actions";
import Auth from "../hoc/auth";
// pages for this product
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import BeatPlayer from "./views/BeatPlayer/BeatPlayer";
import { AudioContextProvider } from "./utils/AudioContext";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";

// Auth(SpecificComponent, option, adminRoute)
// option:
const PUBLIC_PAGE = 0;
const LOGGED_IN_ONLY = 1;
const PUBLIC_ONLY = 2;
// adminRoute:
// true for Admin only
// false for all users

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
      <Suspense fallback={(<div>Loading...</div>)}>
       <AudioContextProvider>
        <NavBar>
          <Main />
        </NavBar>
        {location.pathname.includes("dashboard") ? <div></div> : <Footer />}
        <BeatPlayer />
       </AudioContextProvider>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
