import React from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCart, getCart } from "../_actions/cart_actions";
import { setIndex } from "../_actions/playlist_actions";
// pages for this product
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import BeatPlayer from "./views/BeatPlayer/BeatPlayer";
import { AudioContextProvider } from "./utils/AudioContext";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const newCart = () => {
    dispatch(createCart())
      .then(response => {
        if (response.payload.success) {
          window.localStorage.setItem("cartId", response.payload.cartId);
        } else {
          console.log(response)
        }
      });
  }

  const getCartInfo = (cartId) => {
    dispatch(getCart(cartId));
  }

  const createIndex = () => {
    dispatch(setIndex(0));
  }

  if (!window.localStorage.getItem("cartId")) {
    newCart();
    createIndex();
  } else {
    getCartInfo(window.localStorage.getItem("cartId"));
    createIndex();
  }

  return (
    <ThemeProvider>
      <CSSReset />
      <AudioContextProvider>
        <NavBar>
          <Main />
        </NavBar>
        {location.pathname.includes("dashboard") ? <div></div> : <Footer />}
        <BeatPlayer />
      </AudioContextProvider>
    </ThemeProvider>
  );
}

export default App;
